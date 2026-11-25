import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import {
  buildMessages,
  draftRecord,
  generationLog,
  jsonSchemaFor,
  knowledgeLabel,
  parseGeneration,
  readGenerationConfig,
  sourcesFromSearch,
  unsupportedSearchError,
} from "@/lib/studio-generate";
import { assertPublicUrl, fetchPublicSource, isBlockedIp, publicHttpUrl } from "@/lib/studio-source";
import { createRevisionContext, sameRevisionContext } from "@/lib/studio-revision";
import { studioVoice } from "@/lib/studio-voice";

describe("generation config", () => {
  it("stays off until both the key and the model are set", () => {
    expect(readGenerationConfig({ apiKey: "", model: "grok" })).toBeNull();
    expect(readGenerationConfig({ apiKey: "present", model: "  " })).toBeNull();
    expect(readGenerationConfig({ apiKey: "present", model: "grok-test" })).toEqual({
      apiKey: "present",
      model: "grok-test",
    });
  });
});

describe("generation results", () => {
  it("rejects malformed JSON and accepts a draft object", () => {
    expect(parseGeneration("draft", "not json")).toBeNull();
    expect(parseGeneration("draft", '{"title":"Only a title"}')).toBeNull();
    const parsed = parseGeneration(
      "draft",
      JSON.stringify({
        title: "A useful title",
        h1: "A useful title",
        excerpt: "A short excerpt.",
        body: "A paragraph that a person can edit.",
        category: "SEO",
        seoTitle: "A useful title",
        metaDescription: "A short excerpt.",
      }),
    );
    expect(parsed?.action).toBe("draft");
  });

  it("saves a generated article as an unchecked draft", () => {
    const parsed = parseGeneration(
      "draft",
      JSON.stringify({
        title: "Local pages",
        h1: "Local pages",
        excerpt: "How a page can be clearer.",
        body: "Start with the question a buyer asks.",
        category: "Local SEO",
        seoTitle: "Local pages",
        metaDescription: "How a page can be clearer.",
      }),
    );
    if (!parsed || parsed.action !== "draft") throw new Error("expected a draft");
    const record = draftRecord(parsed.draft, false);
    expect(record.status).toBe("draft");
    expect(record.publish_date).toBeNull();
    expect(record.claims_checked).toBe(false);
    expect(record.source_note).toBe(knowledgeLabel(false));
    expect(record.source_note).toContain("Unverified model knowledge");
  });

  it("aligns JSON schema limits with parser bounds", () => {
    const schema = (action: "ideas" | "brief" | "outline" | "draft" | "rewrite") => jsonSchemaFor(action) as { properties: Record<string, { maxLength?: number; maxItems?: number; items?: { maxLength?: number } }> };
    expect(schema("ideas").properties.ideas?.maxItems).toBe(8);
    expect(schema("brief").properties.questions?.maxItems).toBe(8);
    expect(schema("outline").properties.sections?.maxItems).toBe(10);
    expect(schema("draft").properties.body?.maxLength).toBe(20000);
    expect(schema("rewrite").properties.text?.maxLength).toBe(20000);
  });

  it("only classifies an explicit unsupported-search response for fallback", () => {
    expect(unsupportedSearchError({ code: "unsupported_parameter", param: "search_parameters" })).toBe(true);
    expect(unsupportedSearchError({ code: "invalid_request_error", message: "invalid model" })).toBe(false);
    expect(unsupportedSearchError({ code: "unsupported_parameter", param: "temperature" })).toBe(false);
  });

  it("compares full document and selection snapshots to reject stale revisions", () => {
    const before = createRevisionContext({ type: "doc", content: ["before"] }, 2, 8, "selected");
    expect(sameRevisionContext(before, createRevisionContext({ type: "doc", content: ["before"] }, 2, 8, "selected"))).toBe(true);
    expect(sameRevisionContext(before, createRevisionContext({ type: "doc", content: ["before"] }, 2, 8, "selected", 1))).toBe(false);
    expect(sameRevisionContext(before, createRevisionContext({ type: "doc", content: ["changed"] }, 2, 8, "selected"))).toBe(false);
    expect(sameRevisionContext(before, createRevisionContext({ type: "doc", content: ["before"] }, 3, 8, "elected"))).toBe(false);
  });

  it("does not keep model citations when search did not run", () => {
    expect(sourcesFromSearch(["https://example.com/invented"], false)).toEqual([]);
    expect(sourcesFromSearch(["https://example.com/found"], true)[0]?.url).toBe("https://example.com/found");
  });

  it("logs only the model, status, tokens and error class", () => {
    const entry = generationLog({
      model: "grok-test",
      action: "draft",
      status: "error",
      promptTokens: 12,
      completionTokens: 4,
      errorClass: "malformed_json",
    });
    expect(Object.keys(entry).sort()).toEqual(
      ["action", "completion_tokens", "error_class", "model", "prompt_tokens", "status"].sort(),
    );
    const serialised = JSON.stringify(entry);
    expect(serialised).not.toContain("secret-client-note");
    expect(serialised).not.toContain("xai-test-key");
  });

  it("puts the brand voice on every model call", () => {
    const messages = buildMessages({
      action: "brief",
      topic: "Local SEO",
      notes: "secret-client-note",
      sources: [],
    });
    expect(messages[0]?.content).toBe(studioVoice);
    expect(messages[0]?.content).toContain("UK English");
    expect(messages[1]?.content).toContain("secret-client-note");
    expect(JSON.stringify(generationLog({ model: "m", action: "brief", status: "ok" }))).not.toContain("secret-client-note");
  });
});

describe("source import", () => {
  it("blocks private and link-local addresses", () => {
    expect(isBlockedIp("127.0.0.1")).toBe(true);
    expect(isBlockedIp("10.1.2.3")).toBe(true);
    expect(isBlockedIp("192.168.1.9")).toBe(true);
    expect(isBlockedIp("169.254.169.254")).toBe(true);
    expect(isBlockedIp("172.16.4.4")).toBe(true);
    expect(isBlockedIp("8.8.8.8")).toBe(false);
    expect(isBlockedIp("::1")).toBe(true);
    expect(isBlockedIp("::ffff:8.8.8.8")).toBe(true);
    expect(isBlockedIp("2001:4860:4860::8888")).toBe(false);
    expect(isBlockedIp("2002:0808:0808::1")).toBe(true);
    expect(isBlockedIp("2001:db8::1")).toBe(true);
    expect(isBlockedIp("2001:4860::5efe:808:808")).toBe(true);
    expect(isBlockedIp("198.18.0.1")).toBe(true);
    expect(publicHttpUrl("http://2130706433/secret")).toBeNull();
    expect(publicHttpUrl("http://0x08080808/")).toBeNull();
    expect(publicHttpUrl("http://127.0.0.1/latest")).toBeNull();
    expect(publicHttpUrl("javascript:alert(1)")).toBeNull();
    expect(publicHttpUrl("https://www.example.com/guide")).not.toBeNull();
  });

  it("rejects DNS answers if any address is private", async () => {
    expect(await assertPublicUrl("https://mixed.example", async () => ["8.8.8.8", "10.0.0.1"])).toBeNull();
  });

  it("pins the selected approved DNS answer into the fetch callback", async () => {
    const pinned: string[] = [];
    const fetch = async (_url: string, _init: RequestInit, ip: string) => { pinned.push(ip); return new Response("<p>Public data</p>"); };
    const page = await fetchPublicSource("https://public.example/guide", { lookup: async () => ["8.8.8.8", "1.1.1.1"], fetch });
    expect(page?.text).toContain("Public data");
    expect(pinned).toEqual(["8.8.8.8"]);
  });

  it("stops when a redirect resolves to a private address", async () => {
    const lookup = async (hostname: string) => (hostname === "public.example" ? ["8.8.8.8"] : ["127.0.0.1"]);
    const fetchImpl = async () =>
      new Response(null, { status: 302, headers: { location: "http://loop.example/secret" } });
    const page = await fetchPublicSource("https://public.example/start", { lookup, fetch: fetchImpl });
    expect(page).toBeNull();
  });
});

describe("july drafts", () => {
  it("still keeps the repository drafts unpublished", () => {
    expect(insights.every((item) => item.published === false)).toBe(true);
  });
});

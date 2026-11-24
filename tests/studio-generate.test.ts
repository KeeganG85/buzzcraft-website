import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import {
  buildMessages,
  draftRecord,
  generationLog,
  knowledgeLabel,
  parseGeneration,
  readGenerationConfig,
  sourcesFromSearch,
} from "@/lib/studio-generate";
import { fetchPublicSource, isBlockedIp, publicHttpUrl } from "@/lib/studio-source";
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
    expect(record.claims_checked).toBe(false);
    expect(record.source_note).toBe(knowledgeLabel(false));
    expect(record.source_note).toContain("Unverified model knowledge");
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
    expect(publicHttpUrl("http://127.0.0.1/latest")).toBeNull();
    expect(publicHttpUrl("javascript:alert(1)")).toBeNull();
    expect(publicHttpUrl("https://www.example.com/guide")).not.toBeNull();
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

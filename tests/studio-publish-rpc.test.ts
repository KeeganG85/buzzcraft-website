import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordPublishedVersion } from "@/lib/studio-store";
import type { ArticleRecord } from "@/lib/studio";
import type { ProseNode } from "@/lib/studio-doc";

const articleId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const versionId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function article(): ArticleRecord {
  return {
    id: articleId,
    slug: "snapshot-example",
    title: "Snapshot example",
    h1: "Snapshot example",
    excerpt: "An example.",
    author: "Keegan Goocin",
    category: "Strategy",
    tags: ["strategy"],
    body: "The complete rich-text document.",
    hero_image: "",
    hero_alt: "",
    publish_date: "2026-11-25",
    seo_title: "Snapshot example",
    meta_description: "An example.",
    canonical: "https://www.buzzcraft.co.za/insights/snapshot-example/",
    og_title: "Snapshot example",
    og_description: "An example.",
    focus_phrase: "snapshot",
    source_note: "Reviewed source",
    claims_checked: true,
    status: "archived",
    published_version_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  };
}

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://supabase.example.test");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("atomic rich-text publication", () => {
  it("stores the document and advances the article through one RPC call", async () => {
    const published = { ...article(), status: "published" as const, published_version_id: versionId };
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify([published]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);
    const doc: ProseNode = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "The complete rich-text document." }] }],
    };

    const result = await recordPublishedVersion(article(), doc);

    expect(result).toEqual(published);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toContain("/rest/v1/rpc/publish_studio_article_version");
    expect(init?.method).toBe("POST");
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(payload.p_article_id).toBe(articleId);
    expect(payload.p_content_json).toMatchObject({ title: "Snapshot example", doc });
    expect(String(payload.p_content_html)).toContain("The complete rich-text document.");
    expect(payload.p_metadata_json).toMatchObject({ slug: "snapshot-example", status: "published" });
  });
});

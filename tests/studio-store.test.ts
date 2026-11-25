import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listPublishedArticles, lookupLatestVersion, lookupPublishedArticles, recordPublishedVersion } from "@/lib/studio-store";
import type { ArticleRecord, ArticleVersionSnapshot } from "@/lib/studio";

const articleId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const versionId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function article(overrides: Partial<ArticleRecord> = {}): ArticleRecord {
  return {
    id: articleId,
    slug: "safe-example",
    title: "Flat legacy title",
    h1: "Flat legacy title",
    excerpt: "Legacy excerpt",
    author: "Keegan Goocin",
    category: "Strategy",
    tags: ["strategy"],
    body: "Flat legacy body must never be used as a fallback.",
    hero_image: "",
    hero_alt: "",
    publish_date: "2026-11-25",
    seo_title: "Legacy SEO title",
    meta_description: "Legacy description",
    canonical: "https://www.buzzcraft.co.za/insights/safe-example/",
    og_title: "Legacy OG title",
    og_description: "Legacy OG description",
    focus_phrase: "legacy",
    source_note: "Legacy source",
    claims_checked: true,
    status: "published",
    published_version_id: versionId,
    ...overrides,
  };
}

function approvedVersion(overrides: Partial<ArticleVersionSnapshot> = {}): ArticleVersionSnapshot {
  return {
    id: versionId,
    article_id: articleId,
    approval_status: "approved",
    content_json: {
      title: "Approved title",
      h1: "Approved heading",
      excerpt: "Approved excerpt",
      author: "Keegan Goocin",
      category: "Strategy",
      tags: ["approved"],
      body: "Approved body",
      hero_image: "",
      hero_alt: "",
      seo_title: "Approved SEO title",
      meta_description: "Approved description",
      canonical: "https://www.buzzcraft.co.za/insights/safe-example/",
      og_title: "Approved OG title",
      og_description: "Approved OG description",
      focus_phrase: "approved",
      source_note: "Approved source",
      claims_checked: true,
    },
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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

describe("latest article version lookup", () => {
  it("reports storage errors rather than treating them as an empty version list", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupLatestVersion(articleId)).resolves.toEqual({
      state: "error",
      reason: "Article version storage could not be read.",
    });
  });

  it("distinguishes a successful empty result from a storage error", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ message: "unavailable" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupLatestVersion(articleId)).resolves.toEqual({ state: "no-version" });
    await expect(lookupLatestVersion(articleId)).resolves.toMatchObject({ state: "error" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns the latest version when storage responds with a row", async () => {
    const version = {
      id: versionId,
      article_id: articleId,
      version_number: 3,
      approval_status: "draft",
      content_json: { title: "Draft" },
      metadata_json: {},
    };
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([version])));

    await expect(lookupLatestVersion(articleId)).resolves.toEqual({ state: "version", version });
  });
});

describe("published version lookup", () => {
  it("fails closed on article lookup errors without retrying through flat legacy columns", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ message: "unavailable" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupPublishedArticles();

    expect(result).toEqual({ state: "error", articles: [] });
    expect(await listPublishedArticles()).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("status=eq.published");
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("status=eq.published");
  });

  it("distinguishes a successful published row with no version from a lookup error", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse([article({ published_version_id: null })]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupPublishedArticles();

    expect(result).toEqual({ state: "no-version", articles: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails closed when a pointer has no matching approved version", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse([article()]))
      .mockResolvedValueOnce(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupPublishedArticles();

    expect(result).toEqual({ state: "no-version", articles: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns only the content from the approved version named by the published row", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse([article()]))
      .mockResolvedValueOnce(jsonResponse([approvedVersion()]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupPublishedArticles();

    expect(result.state).toBe("version");
    if (result.state !== "version") throw new Error("Expected a version result");
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0]?.title).toBe("Approved title");
    expect(result.articles[0]?.body).toBe("Approved body");
  });

  it("does not expose any article when the version lookup fails", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse([article()]))
      .mockResolvedValueOnce(jsonResponse({ message: "unavailable" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    expect(await lookupPublishedArticles()).toEqual({ state: "error", articles: [] });
  });
});

describe("atomic publication RPC", () => {
  it("stores the approved snapshot and advances publication in one database call", async () => {
    const publishedRow = article({ status: "published", published_version_id: versionId });
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse([publishedRow]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await recordPublishedVersion(article({ status: "draft", published_version_id: null }));

    expect(result).toEqual(publishedRow);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/rest/v1/rpc/publish_studio_article_version");
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe("POST");
    const payload = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(payload.p_article_id).toBe(articleId);
    expect(payload.p_content_json).toMatchObject({ title: "Flat legacy title", claims_checked: true });
  });

  it("returns failure after a failed RPC without making a second state-changing request", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ message: "transaction failed" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    const result = await recordPublishedVersion(article({ published_version_id: versionId }));

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("rpc/publish_studio_article_version");
  });
});

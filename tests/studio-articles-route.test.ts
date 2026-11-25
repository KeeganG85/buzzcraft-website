import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleRecord } from "@/lib/studio";

const mocks = vi.hoisted(() => ({
  articleSavePlan: vi.fn(),
  canPublish: vi.fn(),
  publishChecklist: vi.fn(),
  rowPatchForSave: vi.fn(),
  studioSession: vi.fn(),
  listArticles: vi.fn(),
  recordPublishedVersion: vi.fn(),
  saveArticle: vi.fn(),
  saveDraftVersion: vi.fn(),
  updateArticle: vi.fn(),
}));

vi.mock("@/lib/studio", () => ({
  articleSavePlan: mocks.articleSavePlan,
  canPublish: mocks.canPublish,
  publishChecklist: mocks.publishChecklist,
  rowPatchForSave: mocks.rowPatchForSave,
  studioSession: mocks.studioSession,
}));
vi.mock("@/lib/studio-store", () => ({
  listArticles: mocks.listArticles,
  recordPublishedVersion: mocks.recordPublishedVersion,
  saveArticle: mocks.saveArticle,
  saveDraftVersion: mocks.saveDraftVersion,
  updateArticle: mocks.updateArticle,
}));

import { POST } from "@/app/api/studio/articles/route";

const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const priorVersionId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function article(status: ArticleRecord["status"]): ArticleRecord {
  return {
    id,
    slug: "safe-example",
    title: "Prior title",
    h1: "Prior heading",
    excerpt: "Prior excerpt",
    author: "Keegan Goocin",
    category: "Strategy",
    tags: ["strategy"],
    body: "Prior body",
    hero_image: "",
    hero_alt: "",
    publish_date: "2026-11-25",
    seo_title: "Prior SEO",
    meta_description: "Prior description",
    canonical: "https://www.buzzcraft.co.za/insights/safe-example/",
    og_title: "Prior OG",
    og_description: "Prior OG description",
    focus_phrase: "growth systems",
    source_note: "Reviewed source",
    claims_checked: true,
    status,
    published_version_id: priorVersionId,
  };
}

const publishBody = {
  id,
  slug: "safe-example",
  title: "Replacement title",
  h1: "Replacement heading",
  excerpt: "Replacement excerpt",
  author: "Keegan Goocin",
  category: "Strategy",
  tags: ["strategy"],
  body: "Replacement body",
  hero_image: "",
  hero_alt: "",
  publish_date: "2026-11-25",
  seo_title: "Replacement SEO",
  meta_description: "Replacement description",
  canonical: "https://www.buzzcraft.co.za/insights/safe-example/",
  og_title: "Replacement OG",
  og_description: "Replacement OG description",
  focus_phrase: "growth systems",
  source_note: "Reviewed source",
  claims_checked: true,
  intent: "publish",
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.studioSession.mockResolvedValue({ email: "editor@example.test" });
  mocks.articleSavePlan.mockReturnValue({
    status: "published",
    updateRowContent: true,
    writeDraftVersion: false,
    version: { action: "insert", version_number: 4, approval_status: "approved" },
  });
  mocks.canPublish.mockReturnValue(true);
  mocks.publishChecklist.mockReturnValue([]);
  mocks.rowPatchForSave.mockImplementation((value: ArticleRecord) => ({ ...value }));
  mocks.recordPublishedVersion.mockResolvedValue(null);
  mocks.saveArticle.mockResolvedValue(null);
  mocks.saveDraftVersion.mockResolvedValue(true);
});

describe.each(["published", "in_review", "archived"] as const)("failed publish from %s", (status) => {
  it("preserves the workflow state and live version pointer", async () => {
    const prior = article(status);
    mocks.listArticles.mockResolvedValue([prior]);
    mocks.updateArticle.mockImplementation(async (_id: string, patch: Partial<ArticleRecord>) => ({
      ...prior,
      ...patch,
    }));

    const response = await POST(
      new Request("https://www.buzzcraft.co.za/api/studio/articles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishBody),
      }),
    );

    expect(response.status).toBe(503);
    expect(mocks.updateArticle).toHaveBeenCalledOnce();
    const patch = mocks.updateArticle.mock.calls[0]?.[1] as Partial<ArticleRecord>;
    expect(patch.status).toBe(status);
    expect(patch).not.toHaveProperty("published_version_id");
    expect(mocks.recordPublishedVersion).toHaveBeenCalledOnce();
  });
});

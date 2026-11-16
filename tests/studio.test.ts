import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { canPublish, publishChecklist, type ArticleRecord } from "@/lib/studio";

function article(overrides: Partial<ArticleRecord> = {}): ArticleRecord {
  return {
    id: "1",
    slug: "what-is-a-growth-system",
    title: "What is a growth system?",
    h1: "What is a growth system?",
    excerpt: "A plain explanation.",
    author: "Keegan Goocin",
    category: "Strategy",
    tags: ["strategy"],
    body: "Strategy, visibility and conversion have to connect.",
    hero_image: "/brand/mascot-reading.webp",
    hero_alt: "Buzz reading",
    publish_date: "2026-11-16",
    seo_title: "What is a growth system?",
    meta_description: "A plain explanation of a growth system for South African SMEs.",
    canonical: "https://www.buzzcraft.co.za/insights/what-is-a-growth-system/",
    og_title: "What is a growth system?",
    og_description: "A plain explanation.",
    focus_phrase: "growth system",
    source_note: "BuzzCraft method note, 16 November 2026. No measured claim.",
    claims_checked: true,
    status: "draft",
    ...overrides,
  };
}

describe("studio publishing", () => {
  it("keeps the three repository drafts unpublished", () => {
    expect(insights).toHaveLength(3);
    expect(insights.every((item) => item.published === false)).toBe(true);
  });

  it("blocks publish until the checklist is clear", () => {
    const draft = article({ source_note: "", claims_checked: false, hero_alt: "" });
    const issues = publishChecklist(draft, []);
    expect(issues.join(" ")).toContain("Source note");
    expect(issues.join(" ")).toContain("alt text");
    expect(issues.join(" ")).toContain("factual claim");
    expect(canPublish(draft, [])).toBe(false);
  });

  it("allows publish when a person has checked the claims and the slug is unique", () => {
    expect(canPublish(article(), [])).toBe(true);
    expect(canPublish(article(), ["what-is-a-growth-system"])).toBe(false);
  });
});

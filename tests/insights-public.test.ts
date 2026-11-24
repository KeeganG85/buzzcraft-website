import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  insightsEmpty,
  insightsHeadline,
  insightsSupport,
  isWithheldInsightSlug,
  redirectSlug,
  safeInsightHtml,
  visibleInsights,
  withheldInsightSlugs,
  type PublicInsight,
} from "@/lib/insights-public";
import type { ArticleRecord } from "@/lib/studio";

function article(overrides: Partial<PublicInsight> = {}): PublicInsight {
  const base: ArticleRecord = {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "local-pages",
    title: "Local pages",
    h1: "Local pages",
    excerpt: "A short explanation.",
    author: "Keegan Goocin",
    category: "Local SEO",
    tags: [],
    body: "Johannesburg firms can start with one clear page.",
    hero_image: "",
    hero_alt: "",
    publish_date: "2026-11-24",
    seo_title: "Local pages",
    meta_description: "A short explanation.",
    canonical: "https://www.buzzcraft.co.za/insights/local-pages/",
    og_title: "Local pages",
    og_description: "A short explanation.",
    focus_phrase: "",
    source_note: "Checked against the public page.",
    claims_checked: true,
    status: "published",
  };
  return { ...base, ...overrides };
}

describe("public insights", () => {
  it("uses the public headline and does not mention the July drafts", () => {
    expect(insightsHeadline).toBe("Insights for businesses that want to be found, trusted and chosen.");
    expect(insightsSupport).toContain("Practical insights on search visibility");
    const publicCopy = `${insightsHeadline} ${insightsSupport} ${insightsEmpty}`;
    expect(publicCopy).not.toContain("July");
    expect(publicCopy.toLowerCase()).not.toContain("in review");
    expect(publicCopy).not.toContain("Studio");
  });

  it("keeps the three July drafts unpublished and off the public list", () => {
    expect(insights).toHaveLength(3);
    expect(insights.every((item) => item.published === false)).toBe(true);
    expect(withheldInsightSlugs.every((slug) => isWithheldInsightSlug(slug))).toBe(true);
    const visible = visibleInsights([
      article({ slug: "what-is-a-growth-system" }),
      article(),
    ]);
    expect(visible.map((item) => item.slug)).toEqual(["local-pages"]);
  });

  it("redirects a changed slug and refuses withheld slugs", () => {
    expect(redirectSlug("old-slug", "local-pages")).toBe("local-pages");
    expect(redirectSlug("local-pages", "local-pages")).toBeNull();
    expect(redirectSlug("what-is-a-growth-system", "local-pages")).toBeNull();
    expect(redirectSlug("old-slug", "whatsapp-lead-conversion-sme")).toBeNull();
  });

  it("matches visible schema text and skips FAQ markup", () => {
    const item = article();
    const posting = JSON.stringify(blogPostingJsonLd(item));
    const crumbs = JSON.stringify(breadcrumbJsonLd(item));
    expect(posting).toContain(item.h1);
    expect(posting).toContain(item.excerpt);
    expect(posting).toContain(item.author);
    expect(posting).not.toContain("FAQPage");
    expect(crumbs).toContain("Insights");
    expect(crumbs).toContain(item.category);
    expect(crumbs).toContain(item.h1);
  });

  it("rejects unsafe article HTML", () => {
    expect(safeInsightHtml("<p>Hello</p>")).toBe("<p>Hello</p>");
    expect(safeInsightHtml("<p>Hello</p><script>alert(1)</script>")).toBeNull();
    expect(safeInsightHtml("Plain text")).toBeNull();
  });

  it("does not import TipTap from public insight files", () => {
    const files = [
      "app/insights/page.tsx",
      "app/insights/[slug]/page.tsx",
      "app/insights/category/[slug]/page.tsx",
      "app/insights/rss.xml/route.ts",
      "components/insights/InsightList.tsx",
      "components/insights/InsightArticle.tsx",
      "lib/insights-public.ts",
    ];
    for (const file of files) {
      const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      expect(text).not.toContain("@tiptap/");
    }
  });
});

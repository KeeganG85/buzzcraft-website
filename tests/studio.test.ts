import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { loginRateLimiter, requestIp } from "@/lib/rate-limit";
import {
  articleFromPublishedVersion,
  articleStatuses,
  canPublish,
  publishChecklist,
  studioRobots,
  type ArticleRecord,
  type ArticleVersionSnapshot,
} from "@/lib/studio";

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

describe("public article versions", () => {
  const versionId = "11111111-1111-4111-8111-111111111111";

  function version(overrides: Partial<ArticleVersionSnapshot> = {}): ArticleVersionSnapshot {
    return {
      id: versionId,
      article_id: "1",
      approval_status: "approved",
      content_json: {
        title: "Approved title",
        h1: "Approved h1",
        excerpt: "Approved excerpt",
        author: "Keegan Goocin",
        category: "Strategy",
        tags: ["strategy"],
        body: "Approved body",
        hero_image: "/brand/mascot-reading.webp",
        hero_alt: "Buzz reading",
        seo_title: "Approved seo",
        meta_description: "Approved description",
        canonical: "https://www.buzzcraft.co.za/insights/what-is-a-growth-system/",
        og_title: "Approved og",
        og_description: "Approved og description",
        focus_phrase: "growth system",
        source_note: "BuzzCraft method note, 16 November 2026. No measured claim.",
        claims_checked: true,
      },
      ...overrides,
    };
  }

  it("keeps every non-published status private", () => {
    expect(articleStatuses).toEqual(["draft", "in_review", "approved", "scheduled", "published", "archived"]);
    for (const status of articleStatuses.filter((item) => item !== "published")) {
      const row = article({ status, published_version_id: versionId });
      expect(articleFromPublishedVersion(row, version())).toBeNull();
    }
  });

  it("serves the approved version and ignores a newer body on the row", () => {
    const row = article({
      status: "published",
      published_version_id: versionId,
      body: "Unapproved draft text that must stay private",
    });
    const published = articleFromPublishedVersion(row, version());
    expect(published?.body).toBe("Approved body");
    expect(published?.title).toBe("Approved title");
    expect(published?.status).toBe("published");
  });

  it("drops a published row with no approved version", () => {
    const row = article({ status: "published", published_version_id: versionId });
    expect(articleFromPublishedVersion(row, null)).toBeNull();
    expect(articleFromPublishedVersion(row, version({ approval_status: "draft" }))).toBeNull();
    expect(articleFromPublishedVersion(row, version({ article_id: "other" }))).toBeNull();
    expect(articleFromPublishedVersion(article({ status: "published" }), version())).toBeNull();
  });
});

describe("studio login rate limit", () => {
  it("blocks the sixth attempt inside the window and allows another address", () => {
    loginRateLimiter.reset();
    const now = Date.parse("2026-11-24T16:00:00.000Z");
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(loginRateLimiter.limited("203.0.113.10", now)).toBe(false);
    }
    expect(loginRateLimiter.limited("203.0.113.10", now)).toBe(true);
    expect(loginRateLimiter.limited("203.0.113.11", now)).toBe(false);
    expect(loginRateLimiter.limited("203.0.113.10", now + 10 * 60 * 1000 + 1)).toBe(false);
  });

  it("reads the first forwarded address", () => {
    const request = new Request("https://www.buzzcraft.co.za/api/studio/login/", {
      headers: { "x-forwarded-for": "203.0.113.10, 198.51.100.2" },
    });
    expect(requestIp(request)).toBe("203.0.113.10");
    expect(requestIp(request, { trustForwardedFor: false })).toBe("unknown");
    expect(requestIp(new Request("https://www.buzzcraft.co.za/api/studio/login/"))).toBe("unknown");
  });
});

describe("studio robots", () => {
  it("keeps Studio, including login and preview, out of the index", () => {
    expect(studioRobots).toEqual({ index: false, follow: false });
  });
});

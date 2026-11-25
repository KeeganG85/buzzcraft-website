import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { indexablePaths } from "@/lib/routes";
import {
  characterCounts,
  destinationAllowed,
  diagnose,
  diagnosticRubric,
  suggestInternalLinks,
} from "@/lib/studio-diagnostics";

const empty = {
  seoTitle: "",
  metaDescription: "",
  title: "",
  h1: "",
  slug: "",
  body: "",
  canonical: "",
  focusPhrase: "",
  heroImage: "",
  heroAlt: "",
  sourceNote: "",
  headings: [],
  hasInternalLink: false,
  otherSlugs: [],
};

describe("editing checklist", () => {
  it("states that the notes are not ranking factors or citation guarantees", () => {
    expect(diagnosticRubric).toContain("not a ranking factor");
    expect(diagnosticRubric).toContain("does not guarantee");
    expect(diagnosticRubric).toContain("Schema, FAQs, and llms.txt do not guarantee citations.");
    const checks = diagnose(empty);
    expect(checks.some((check) => "score" in check)).toBe(false);
    expect(checks.every((check) => check.state === "in place" || check.state === "worth a look")).toBe(true);
  });

  it("counts characters in the SEO title and meta description", () => {
    expect(characterCounts("Local pages for Johannesburg firms", "A practical note.")).toEqual({
      seoTitle: "Local pages for Johannesburg firms".length,
      metaDescription: "A practical note.".length,
    });
  });

  it("flags a skipped heading and a duplicate slug", () => {
    const checks = diagnose({
      ...empty,
      slug: "local-pages",
      h1: "Local pages",
      headings: [{ level: 3, text: "What next?" }],
      otherSlugs: ["local-pages"],
      body: "Johannesburg businesses can start with one clear page.\n\nThat is enough.",
      sourceNote: "Checked note.",
      hasInternalLink: true,
      seoTitle: "Local pages for Johannesburg firms today now",
      metaDescription: "A".repeat(130),
    });
    expect(checks.find((check) => check.id === "headings")?.state).toBe("worth a look");
    expect(checks.find((check) => check.id === "cannibalisation")?.detail).toContain("already uses this slug");
    expect(checks.find((check) => check.id === "question-heading")?.state).toBe("in place");
  });
});

describe("internal links", () => {
  it("offers the public destinations and published articles, not the current draft", () => {
    const links = suggestInternalLinks({
      text: "Search visibility for a Johannesburg firm",
      currentSlug: "current-draft",
      articles: [
        { slug: "current-draft", title: "Current" },
        { slug: "local-pages", title: "Local pages" },
      ],
      paths: indexablePaths,
    });
    const paths = links.map((item) => item.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/found/");
    expect(paths).toContain("/120promptos/");
    expect(paths).toContain("/scorecard/");
    expect(paths).toContain("/sprint/");
    expect(paths).toContain("/insights/local-pages/");
    expect(paths).not.toContain("/insights/current-draft/");
    expect(paths.some((path) => path.startsWith("/studio"))).toBe(false);
    expect(destinationAllowed("/found/", links)).toBe(true);
    expect(destinationAllowed("/studio/", links)).toBe(false);
    expect(links.some((item) => item.path === "/services/search-visibility/")).toBe(true);
  });
});

describe("july drafts", () => {
  it("still keeps the repository drafts unpublished", () => {
    expect(insights.every((item) => item.published === false)).toBe(true);
  });
});

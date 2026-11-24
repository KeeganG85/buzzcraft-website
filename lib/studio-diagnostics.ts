import { canonicalPath } from "@/lib/seo";
import { indexablePaths } from "@/lib/routes";
import type { ProseNode } from "@/lib/studio-doc";

export const diagnosticRubric = [
  "These notes are an editing checklist for this draft.",
  "A note is not a ranking factor and it does not guarantee a place in search results.",
  "Schema, FAQs, and llms.txt do not guarantee citations.",
  "SEO title: about 50 to 60 characters keeps the result specific.",
  "Meta description: about 120 to 160 characters is a readable snippet.",
  "Use one H1, then H2 and H3 without skipping a level.",
  "Open with the useful point in a short paragraph.",
  "A question heading helps a person scan. It does not guarantee an AI citation.",
  "Name a place when the piece is about a South African market. Do not force a place into every article.",
  "Internal links should point at real public pages. Edit the anchor, then accept or reject it, before it is inserted.",
].join(" ");

export type DiagnosticArea = "SEO" | "AEO" | "GEO";

export type DiagnosticCheck = {
  id: string;
  area: DiagnosticArea;
  state: "in place" | "worth a look";
  detail: string;
};

export type DiagnosticInput = {
  seoTitle: string;
  metaDescription: string;
  title: string;
  h1: string;
  slug: string;
  body: string;
  canonical: string;
  focusPhrase: string;
  heroImage: string;
  heroAlt: string;
  sourceNote: string;
  headings: { level: number; text: string }[];
  hasInternalLink: boolean;
  otherSlugs: string[];
};

const requiredDestinations = [
  { path: "/", label: "Home" },
  { path: "/found/", label: "FOUND prompt library" },
  { path: "/120promptos/", label: "The 120 Prompt OS" },
  { path: "/scorecard/", label: "Search Visibility Scorecard" },
  { path: "/sprint/", label: "Visibility and Lead Recovery Sprint" },
] as const;

export type LinkSuggestion = {
  path: string;
  label: string;
  reason: string;
};

export function characterCounts(seoTitle: string, metaDescription: string): { seoTitle: number; metaDescription: number } {
  return { seoTitle: seoTitle.length, metaDescription: metaDescription.length };
}

function firstParagraph(body: string): string {
  return body.split(/\n\s*\n/).map((part) => part.trim()).find(Boolean) ?? "";
}

export function diagnose(input: DiagnosticInput): DiagnosticCheck[] {
  const counts = characterCounts(input.seoTitle, input.metaDescription);
  const checks: DiagnosticCheck[] = [];
  const seoTitleInRange = counts.seoTitle >= 50 && counts.seoTitle <= 60;
  checks.push({
    id: "seo-title-length",
    area: "SEO",
    state: seoTitleInRange ? "in place" : "worth a look",
    detail: seoTitleInRange
      ? `SEO title is ${counts.seoTitle} characters.`
      : `SEO title is ${counts.seoTitle} characters. About 50 to 60 is easier to read in a result.`,
  });
  const metaInRange = counts.metaDescription >= 120 && counts.metaDescription <= 160;
  checks.push({
    id: "meta-length",
    area: "SEO",
    state: metaInRange ? "in place" : "worth a look",
    detail: metaInRange
      ? `Meta description is ${counts.metaDescription} characters.`
      : `Meta description is ${counts.metaDescription} characters. About 120 to 160 fits a snippet.`,
  });
  const slugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug);
  checks.push({
    id: "slug",
    area: "SEO",
    state: slugOk ? "in place" : "worth a look",
    detail: slugOk ? "Slug uses lowercase words and hyphens." : "Slug should be lowercase words separated by hyphens.",
  });
  checks.push({
    id: "h1",
    area: "SEO",
    state: input.h1.trim() ? "in place" : "worth a look",
    detail: input.h1.trim() ? "The page has one H1 field." : "Add a single H1.",
  });
  let previous = 1;
  let skipped = false;
  for (const heading of input.headings) {
    if (heading.level > previous + 1) skipped = true;
    previous = heading.level;
  }
  checks.push({
    id: "headings",
    area: "SEO",
    state: skipped ? "worth a look" : "in place",
    detail: skipped ? "A heading skips a level. Use H2 before H3." : "Heading levels follow H1, then H2 and H3.",
  });
  const canonicalOk = !input.canonical.trim() || input.canonical.startsWith("https://www.buzzcraft.co.za/");
  checks.push({
    id: "canonical",
    area: "SEO",
    state: canonicalOk ? "in place" : "worth a look",
    detail: canonicalOk
      ? "Canonical is empty or uses the www host."
      : "Canonical should use https://www.buzzcraft.co.za/.",
  });
  const altOk = !input.heroImage.trim() || Boolean(input.heroAlt.trim());
  checks.push({
    id: "alt",
    area: "SEO",
    state: altOk ? "in place" : "worth a look",
    detail: altOk ? "Hero image has alt text, or there is no hero image." : "Add alt text for the hero image.",
  });
  if (input.focusPhrase.trim()) {
    const phrase = input.focusPhrase.trim().toLowerCase();
    const haystack = `${input.seoTitle} ${input.h1} ${input.body}`.toLowerCase();
    const found = haystack.includes(phrase);
    checks.push({
      id: "focus",
      area: "SEO",
      state: found ? "in place" : "worth a look",
      detail: found
        ? "The focus phrase appears in the title, H1, or body. It is a writing hint, not a ranking factor."
        : "The focus phrase is missing from the title, H1, and body. It is a writing hint, not a ranking factor.",
    });
  }
  if (input.otherSlugs.includes(input.slug)) {
    checks.push({
      id: "cannibalisation",
      area: "SEO",
      state: "worth a look",
      detail: "Another stored article already uses this slug.",
    });
  }

  const opening = firstParagraph(input.body);
  const openingOk = opening.length >= 40 && opening.length <= 400;
  checks.push({
    id: "answer-first",
    area: "AEO",
    state: openingOk ? "in place" : "worth a look",
    detail: openingOk
      ? "The opening paragraph is short enough to state the point."
      : "Open with the useful point in one short paragraph, about 40 to 400 characters.",
  });
  const questionHeading = input.headings.some((heading) => heading.text.includes("?"));
  checks.push({
    id: "question-heading",
    area: "AEO",
    state: questionHeading ? "in place" : "worth a look",
    detail: questionHeading
      ? "A heading asks a question. That helps scanning. It does not guarantee a citation."
      : "A question heading can help scanning. It does not guarantee a citation.",
  });
  const longParagraph = input.body.split(/\n\s*\n/).some((part) => part.trim().length > 500);
  checks.push({
    id: "paragraphs",
    area: "AEO",
    state: longParagraph ? "worth a look" : "in place",
    detail: longParagraph ? "A paragraph is longer than 500 characters. Split it so each one stands alone." : "Paragraphs are short enough to stand alone.",
  });

  const place = /south africa|johannesburg|gauteng|soweto|cape town|durban|pretoria/i.test(`${input.title} ${input.body}`);
  checks.push({
    id: "place",
    area: "GEO",
    state: place ? "in place" : "worth a look",
    detail: place
      ? "The draft names a South African place."
      : "If this is about a local market, name the place. Do not add it only to satisfy a checklist.",
  });
  checks.push({
    id: "sources",
    area: "GEO",
    state: input.sourceNote.trim() ? "in place" : "worth a look",
    detail: input.sourceNote.trim()
      ? "A source note is present. A person still has to check every claim."
      : "Add a source note for claims a person has checked. Schema and FAQs do not replace that.",
  });
  checks.push({
    id: "internal-link",
    area: "GEO",
    state: input.hasInternalLink ? "in place" : "worth a look",
    detail: input.hasInternalLink
      ? "The draft already has a link."
      : "Add an internal link only where it helps the reader. Accept it before it is inserted.",
  });
  return checks;
}

function labelFromPath(path: string): string {
  if (path === "/") return "Home";
  const segment = path.split("/").filter(Boolean).pop() ?? "Page";
  return segment.replace(/-/g, " ");
}

function tokens(value: string): Set<string> {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
}

export function suggestInternalLinks(input: {
  text: string;
  currentSlug?: string;
  articles?: { slug: string; title: string }[];
  paths?: readonly string[];
}): LinkSuggestion[] {
  const paths = input.paths ?? indexablePaths;
  const allowed = new Set(paths.map((path) => canonicalPath(path)));
  const suggestions: LinkSuggestion[] = [];
  for (const item of requiredDestinations) {
    const path = canonicalPath(item.path);
    if (!allowed.has(path)) continue;
    suggestions.push({ path, label: item.label, reason: "Public page on this site" });
  }
  const words = tokens(input.text);
  const extras: { suggestion: LinkSuggestion; overlap: number }[] = [];
  for (const path of paths) {
    const canonical = canonicalPath(path);
    if (suggestions.some((item) => item.path === canonical)) continue;
    const pathWords = [...tokens(canonical)];
    const overlap = pathWords.filter((word) => words.has(word)).length;
    if (overlap === 0) continue;
    extras.push({
      overlap,
      suggestion: { path: canonical, label: labelFromPath(canonical), reason: "Shares a topic word with this draft" },
    });
  }
  extras.sort((left, right) => right.overlap - left.overlap);
  for (const extra of extras.slice(0, 4)) suggestions.push(extra.suggestion);
  for (const article of input.articles ?? []) {
    if (!article.slug || article.slug === input.currentSlug) continue;
    const path = canonicalPath(`/insights/${article.slug}`);
    if (suggestions.some((item) => item.path === path)) continue;
    suggestions.push({ path, label: article.title || article.slug, reason: "Published article" });
  }
  return suggestions;
}

export function destinationAllowed(path: string, suggestions: LinkSuggestion[]): boolean {
  return suggestions.some((item) => item.path === canonicalPath(path));
}

export function documentHasLink(node: ProseNode | null | undefined): boolean {
  if (!node) return false;
  if (node.marks?.some((mark) => mark.type === "link")) return true;
  return (node.content ?? []).some((child) => documentHasLink(child));
}

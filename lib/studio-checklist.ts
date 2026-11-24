import type { ArticleRecord } from "@/lib/studio";

export function publishChecklist(article: ArticleRecord, otherSlugs: string[]): string[] {
  const issues: string[] = [];
  if (!article.title.trim() || !article.h1.trim()) issues.push("Title and H1 are required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    issues.push("Slug must be lowercase words separated by hyphens.");
  }
  if (otherSlugs.includes(article.slug)) issues.push("Another article already uses this slug.");
  if (!article.excerpt.trim()) issues.push("Excerpt is missing.");
  if (!article.author.trim()) issues.push("Author is missing.");
  if (!article.body.trim()) issues.push("Body is empty.");
  if (article.hero_image.trim() && !article.hero_alt.trim()) issues.push("Hero image is missing alt text.");
  if (!article.seo_title.trim()) issues.push("SEO title is missing.");
  if (!article.meta_description.trim()) issues.push("Meta description is missing.");
  if (!article.canonical.trim()) issues.push("Canonical is empty.");
  if (!article.source_note.trim()) issues.push("Source note is missing. Add the title, URL, date and the claim it supports.");
  if (!article.claims_checked) issues.push("Tick the box once a person has checked every factual claim.");
  return issues;
}

import { readingMinutes, safeUrl, wordCount } from "@/lib/studio-doc";
import { absoluteUrl, canonicalPath } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import type { ArticleRecord } from "@/lib/studio";

export const insightsHeadline = "Insights for businesses that want to be found, trusted and chosen.";

export const insightsSupport =
  "Practical insights on search visibility, AI-powered growth, conversion-focused websites and smarter business systems. Built for South African businesses navigating an increasingly digital world.";

export const insightsEmpty =
  "No insights are published yet. Practical notes on search, websites and lead systems will appear here when they are ready to read.";

export const insightsNoMatch = "No published insights match that search.";

/** Repository drafts that must stay off the public site. */
export const withheldInsightSlugs = [
  "what-is-a-growth-system",
  "local-seo-johannesburg-guide",
  "whatsapp-lead-conversion-sme",
] as const;

const withheld = new Set<string>(withheldInsightSlugs);

export type PublicInsight = ArticleRecord & {
  content_html?: string;
  published_at?: string | null;
  updated_at?: string | null;
};

export function isWithheldInsightSlug(slug: string): boolean {
  return withheld.has(slug);
}

export function visibleInsights(articles: PublicInsight[]): PublicInsight[] {
  return articles.filter((article) => article.status === "published" && !isWithheldInsightSlug(article.slug));
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchesQuery(article: PublicInsight, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = `${article.title} ${article.h1} ${article.excerpt} ${article.category} ${article.body}`.toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function insightPath(slug: string): string {
  return canonicalPath(`/insights/${slug}`);
}

export function readingLabel(text: string): string {
  const minutes = readingMinutes(text);
  if (minutes === 0) return "";
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}

export function formatInsightDate(value: string | null | undefined): string {
  if (!value) return "";
  const iso = value.length === 10 ? `${value}T00:00:00.000Z` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(date);
}

export function publishedIso(article: PublicInsight): string {
  if (article.publish_date) return article.publish_date;
  if (article.published_at) return article.published_at.slice(0, 10);
  return "";
}

export function updatedIso(article: PublicInsight): string {
  const published = publishedIso(article);
  const updated = article.updated_at?.slice(0, 10) ?? "";
  if (!updated || updated === published) return "";
  return updated;
}

export function cardImage(article: PublicInsight): { src: string; alt: string } {
  if (article.hero_image.trim()) {
    return { src: article.hero_image, alt: article.hero_alt.trim() || article.title };
  }
  return { src: "/brand/mascot-reading.webp", alt: "Buzz, the BuzzCraft mascot" };
}

export function redirectSlug(requested: string, current: string | null | undefined): string | null {
  if (!current || current === requested) return null;
  if (isWithheldInsightSlug(requested) || isWithheldInsightSlug(current)) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) return null;
  return current;
}

const allowedTags = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "strong",
  "em",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "br",
  "hr",
  "s",
  "u",
]);

const voidTags = new Set(["br", "hr", "img"]);

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function decodeAttr(value: string): string {
  let current = value.replace(/[\u0000-\u001F\u007F]/g, "");
  for (let pass = 0; pass < 2; pass += 1) {
    current = current
      .replace(/&amp;/gi, "&")
      .replace(/&colon;/gi, ":")
      .replace(/&tab;/gi, "")
      .replace(/&newline;/gi, "")
      .replace(/&#x0*3a;/gi, ":")
      .replace(/&#0*58;/g, ":")
      .replace(/&quot;/gi, '"')
      .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex: string) => point(Number.parseInt(hex, 16)))
      .replace(/&#([0-9]{1,7});/g, (_, num: string) => point(Number(num)));
  }
  return current.trim();
}

function point(code: number): string {
  if (!Number.isFinite(code) || code <= 31 || code === 127 || code > 0x10ffff) return "";
  return String.fromCodePoint(code);
}

function safeHref(raw: string): string | null {
  const decoded = decodeAttr(raw).replace(/\s+/g, "");
  const href = safeUrl(decoded);
  if (!href || href.toLowerCase().startsWith("data:")) return null;
  return href;
}

function safeImageSrc(raw: string): string | null {
  const href = safeHref(raw);
  if (!href || href.startsWith("mailto:")) return null;
  return href;
}

function parseAttrs(source: string): Record<string, string> | null {
  const attrs: Record<string, string> = {};
  let index = 0;
  while (index < source.length) {
    while (index < source.length && /\s/.test(source[index] ?? "")) index += 1;
    if (index >= source.length) break;
    const nameMatch = /^[a-zA-Z_:][-a-zA-Z0-9_:.]*/.exec(source.slice(index));
    if (!nameMatch) return null;
    const name = nameMatch[0].toLowerCase();
    index += nameMatch[0].length;
    while (index < source.length && /\s/.test(source[index] ?? "")) index += 1;
    if (source[index] !== "=") return null;
    index += 1;
    while (index < source.length && /\s/.test(source[index] ?? "")) index += 1;
    let value = "";
    const quote = source[index];
    if (quote === '"' || quote === "'") {
      const end = source.indexOf(quote, index + 1);
      if (end === -1) return null;
      value = source.slice(index + 1, end);
      index = end + 1;
    } else {
      const start = index;
      while (index < source.length && !/\s/.test(source[index] ?? "")) index += 1;
      value = source.slice(start, index);
      if (!value) return null;
    }
    if (name.startsWith("on") || name === "style" || name === "srcdoc" || attrs[name] !== undefined) return null;
    attrs[name] = value;
  }
  return attrs;
}

function renderOpen(name: string, attrs: Record<string, string>): string | null {
  const keys = Object.keys(attrs);
  if (name === "a") {
    if (keys.length !== 1 || !attrs.href) return null;
    const href = safeHref(attrs.href);
    if (!href) return null;
    return `<a href="${escapeAttr(href)}">`;
  }
  if (name === "img") {
    if (!attrs.src || !attrs.alt?.trim()) return null;
    if (keys.some((key) => !["src", "alt", "width", "height"].includes(key))) return null;
    const src = safeImageSrc(attrs.src);
    if (!src) return null;
    let tag = `<img src="${escapeAttr(src)}" alt="${escapeAttr(decodeAttr(attrs.alt))}"`;
    for (const key of ["width", "height"] as const) {
      if (!attrs[key]) continue;
      if (!/^[1-9][0-9]{0,3}$/.test(attrs[key])) return null;
      tag += ` ${key}="${attrs[key]}"`;
    }
    return `${tag}>`;
  }
  if (name === "th" || name === "td") {
    if (keys.some((key) => key !== "colspan" && key !== "rowspan")) return null;
    let tag = `<${name}`;
    for (const key of ["colspan", "rowspan"] as const) {
      if (!attrs[key]) continue;
      if (!/^[1-9][0-9]{0,2}$/.test(attrs[key])) return null;
      tag += ` ${key}="${attrs[key]}"`;
    }
    return `${tag}>`;
  }
  if (keys.length > 0) return null;
  return `<${name}>`;
}

/** Rebuilds article HTML from an allowlist. Anything outside that list is dropped entirely. */
export function safeInsightHtml(html: string): string | null {
  const trimmed = html.trim();
  if (!trimmed.includes("<") || trimmed.includes("\0")) return null;
  let out = "";
  let index = 0;
  while (index < trimmed.length) {
    const start = trimmed.indexOf("<", index);
    if (start === -1) {
      out += trimmed.slice(index);
      break;
    }
    out += trimmed.slice(index, start);
    if (trimmed.startsWith("<!--", start) || trimmed.startsWith("<!", start) || trimmed.startsWith("<?", start)) {
      return null;
    }
    const end = trimmed.indexOf(">", start);
    if (end === -1) return null;
    const raw = trimmed.slice(start + 1, end).trim();
    const closing = raw.startsWith("/");
    const body = (closing ? raw.slice(1) : raw.replace(/\/\s*$/, "")).trim();
    const nameMatch = /^([a-zA-Z0-9]+)/.exec(body);
    if (!nameMatch) return null;
    const name = nameMatch[1].toLowerCase();
    if (!allowedTags.has(name)) return null;
    if (closing) {
      if (voidTags.has(name) || body.slice(nameMatch[1].length).trim()) return null;
      out += `</${name}>`;
    } else {
      const attrs = parseAttrs(body.slice(nameMatch[1].length));
      if (!attrs) return null;
      const open = renderOpen(name, attrs);
      if (!open) return null;
      out += open;
    }
    index = end + 1;
  }
  return out;
}

export function headingContents(html: string): { id: string; text: string; level: 2 | 3 }[] {
  const toc: { id: string; text: string; level: 2 | 3 }[] = [];
  const pattern = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(html))) {
    index += 1;
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    toc.push({ id: `section-${index}`, text, level: Number(match[1]) as 2 | 3 });
  }
  return toc;
}

export function htmlWithHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (full, level: string, attrs: string) => {
    index += 1;
    if (/\sid=/.test(attrs)) return full;
    return `<h${level}${attrs} id="section-${index}">`;
  });
}

export function showContents(article: PublicInsight, tocLength: number): boolean {
  return tocLength >= 2 || wordCount(article.body) >= 400;
}

export function relatedInsights(articles: PublicInsight[], current: PublicInsight): PublicInsight[] {
  const others = articles.filter((item) => item.slug !== current.slug);
  const same = others.filter((item) => item.category && item.category === current.category);
  const rest = others.filter((item) => item.category !== current.category);
  return [...same, ...rest].slice(0, 3);
}

export function blogPostingJsonLd(article: PublicInsight) {
  const headline = article.h1 || article.title;
  const description = article.excerpt || article.meta_description;
  const published = publishedIso(article);
  const updated = updatedIso(article);
  const image = cardImage(article);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished: published || undefined,
    dateModified: updated || published || undefined,
    author: {
      "@type": article.author.trim() ? "Person" : "Organization",
      name: article.author.trim() || siteConfig.name,
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    image: image.src.startsWith("http") ? image.src : absoluteUrl(image.src),
    mainEntityOfPage: article.canonical || absoluteUrl(insightPath(article.slug)),
  };
}

export function breadcrumbJsonLd(article: PublicInsight) {
  const items = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ];
  if (article.category.trim()) {
    items.push({
      name: article.category,
      path: `/insights/category/${categorySlug(article.category)}`,
    });
  }
  items.push({ name: article.h1 || article.title, path: insightPath(article.slug) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function insightCategories(articles: PublicInsight[]): { slug: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const article of articles) {
    const name = article.category.trim();
    if (!name) continue;
    const slug = categorySlug(name);
    if (slug && !seen.has(slug)) seen.set(slug, name);
  }
  return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
}

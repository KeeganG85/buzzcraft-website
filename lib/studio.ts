import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "studio_session";

export const articleStatuses = [
  "draft",
  "in_review",
  "approved",
  "scheduled",
  "published",
  "archived",
] as const;

export type ArticleStatus = (typeof articleStatuses)[number];

export const studioRobots = { index: false, follow: false } as const;

export type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  body: string;
  hero_image: string;
  hero_alt: string;
  publish_date: string;
  seo_title: string;
  meta_description: string;
  canonical: string;
  og_title: string;
  og_description: string;
  focus_phrase: string;
  source_note: string;
  claims_checked: boolean;
  status: ArticleStatus;
  subtitle?: string;
  published_version_id?: string | null;
  published_at?: string | null;
  scheduled_at?: string | null;
};

export type ArticleVersionSnapshot = {
  id: string;
  article_id: string;
  approval_status: "draft" | "approved";
  content_json: Record<string, unknown>;
};

const articleTextKeys = [
  "title",
  "h1",
  "excerpt",
  "author",
  "category",
  "body",
  "hero_image",
  "hero_alt",
  "seo_title",
  "meta_description",
  "canonical",
  "og_title",
  "og_description",
  "focus_phrase",
  "source_note",
] as const;

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function versionContentFromArticle(article: ArticleRecord): Record<string, unknown> {
  return {
    title: article.title,
    h1: article.h1,
    excerpt: article.excerpt,
    author: article.author,
    category: article.category,
    tags: article.tags,
    body: article.body,
    hero_image: article.hero_image,
    hero_alt: article.hero_alt,
    seo_title: article.seo_title,
    meta_description: article.meta_description,
    canonical: article.canonical,
    og_title: article.og_title,
    og_description: article.og_description,
    focus_phrase: article.focus_phrase,
    source_note: article.source_note,
    claims_checked: article.claims_checked,
  };
}

function textFromContent(content: Record<string, unknown>, key: (typeof articleTextKeys)[number]): string {
  const value = content[key];
  return typeof value === "string" ? value : "";
}

/**
 * Public Insights may receive a published article only when it points at the
 * approved version. Drafts and every other workflow state return null.
 * Copy comes from that version, so a newer unsaved body on the row stays private.
 */
export function articleFromPublishedVersion(
  row: ArticleRecord,
  version: ArticleVersionSnapshot | null,
): ArticleRecord | null {
  if (row.status !== "published") return null;
  if (!row.published_version_id || !version) return null;
  if (!isUuid(row.published_version_id) || version.id !== row.published_version_id) return null;
  if (version.article_id !== row.id) return null;
  if (version.approval_status !== "approved") return null;

  const content = version.content_json ?? {};
  const tags = Array.isArray(content.tags) ? content.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const published: ArticleRecord = {
    ...row,
    status: "published",
    tags,
    claims_checked: content.claims_checked === true,
  };
  for (const key of articleTextKeys) {
    published[key] = textFromContent(content, key);
  }
  return published;
}

export type CaseStudyRecord = {
  id: string;
  slug: string;
  client_name: string;
  url: string;
  location: string;
  summary: string;
  observed: string;
  status: "draft" | "published";
};

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

export function canPublish(article: ArticleRecord, otherSlugs: string[]): boolean {
  return publishChecklist(article, otherSlugs).length === 0;
}

export function hashStudioPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt$16384$8$1$${salt}$${hash}`;
}

export function verifyStudioPassword(password: string, stored: string): boolean {
  const [algo, n, r, p, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, 64, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  const expected = Buffer.from(hash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function secret(): string | null {
  return process.env.STUDIO_SESSION_SECRET || null;
}

export function studioConfigured(): boolean {
  return Boolean(process.env.STUDIO_EMAIL && process.env.STUDIO_PASSWORD_HASH && secret());
}

export function storageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function signStudioSession(email: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
  const sig = createHmac("sha256", key).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function readStudioToken(token: string | undefined): { email: string } | null {
  const key = secret();
  if (!token || !key) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", key).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email?: string; exp?: number };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    if (data.email !== process.env.STUDIO_EMAIL) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export async function studioSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  return readStudioToken(jar.get(COOKIE)?.value);
}

export const studioCookie = COOKIE;

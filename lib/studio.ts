import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "studio_session";

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
  status: "draft" | "published";
};

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

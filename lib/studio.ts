import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { publishChecklist } from "@/lib/studio-checklist";

export { publishChecklist };
export { slugifyTitle, uniqueSlugFromTitle } from "./studio-slug";

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
  publish_date: string | null;
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

export function canPublish(article: ArticleRecord, otherSlugs: string[]): boolean {
  return publishChecklist(article, otherSlugs).length === 0;
}

export type VersionPointer = {
  id: string;
  version_number: number;
  approval_status: "draft" | "approved";
};

export type SavePlan = {
  status: ArticleStatus;
  /** Published articles keep their live columns until a person publishes again. */
  updateRowContent: boolean;
  writeDraftVersion: boolean;
  version:
    | { action: "update"; id: string }
    | { action: "insert"; version_number: number; approval_status: "draft" | "approved" };
};

/**
 * A save writes or updates a draft version and does not change published_version_id.
 * Publishing is a separate step that records an approved version.
 */
export function articleSavePlan(
  existingStatus: ArticleStatus | null,
  intent: "save" | "publish",
  latest: VersionPointer | null,
): SavePlan {
  if (intent === "publish") {
    return {
      status: "published",
      updateRowContent: true,
      writeDraftVersion: false,
      version: {
        action: "insert",
        version_number: (latest?.version_number ?? 0) + 1,
        approval_status: "approved",
      },
    };
  }
  const version =
    latest?.approval_status === "draft"
      ? { action: "update" as const, id: latest.id }
      : {
          action: "insert" as const,
          version_number: (latest?.version_number ?? 0) + 1,
          approval_status: "draft" as const,
        };
  return {
    status: existingStatus ?? "draft",
    updateRowContent: existingStatus !== "published",
    writeDraftVersion: true,
    version,
  };
}

const draftTextKeys = [
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

/** Working copy for the editor. Status and the public version pointer stay on the row. */
export function articleWithDraftContent(
  row: ArticleRecord,
  content: Record<string, unknown> | null,
  metadata: Record<string, unknown> | null,
): ArticleRecord {
  const next: ArticleRecord = { ...row };
  if (content) {
    for (const key of draftTextKeys) {
      if (typeof content[key] === "string") next[key] = content[key];
    }
    if (Array.isArray(content.tags)) {
      next.tags = content.tags.filter((tag): tag is string => typeof tag === "string");
    }
    if (typeof content.claims_checked === "boolean") next.claims_checked = content.claims_checked;
  }
  if (metadata && typeof metadata.slug === "string" && metadata.slug.trim()) next.slug = metadata.slug;
  if (metadata && (typeof metadata.publish_date === "string" || metadata.publish_date === null)) next.publish_date = metadata.publish_date;
  next.id = row.id;
  next.status = row.status;
  next.published_version_id = row.published_version_id;
  return next;
}

export function articleCounts(articles: { status: string }[]): {
  stored: number;
  draft: number;
  review: number;
  scheduled: number;
  published: number;
} {
  return {
    stored: articles.length,
    draft: articles.filter((item) => item.status === "draft").length,
    review: articles.filter((item) => item.status === "in_review").length,
    scheduled: articles.filter((item) => item.status === "scheduled").length,
    published: articles.filter((item) => item.status === "published").length,
  };
}

export function articlesWithNewestDraftTitles<T extends { id: string; title: string }>(
  rows: T[],
  drafts: { article_id: string; version_number: number; content_json: Record<string, unknown> }[],
): T[] {
  const newest = new Map<string, { version: number; title: string }>();
  for (const draft of drafts) {
    const title = draft.content_json.title;
    if (typeof title !== "string" || !title.trim()) continue;
    const current = newest.get(draft.article_id);
    if (!current || draft.version_number > current.version) {
      newest.set(draft.article_id, { version: draft.version_number, title });
    }
  }
  return rows.map((row) => {
    const title = newest.get(row.id)?.title;
    return title ? { ...row, title } : row;
  });
}

const rowContentKeys = [
  "slug",
  "title",
  "h1",
  "excerpt",
  "author",
  "category",
  "tags",
  "body",
  "hero_image",
  "hero_alt",
  "publish_date",
  "seo_title",
  "meta_description",
  "canonical",
  "og_title",
  "og_description",
  "focus_phrase",
  "source_note",
  "claims_checked",
  "status",
] as const;

/** Row patch for a save. Never includes published_version_id. */
export function rowPatchForSave(article: ArticleRecord, updateRowContent: boolean): Partial<ArticleRecord> {
  if (!updateRowContent) return {};
  const patch: Partial<ArticleRecord> = {};
  for (const key of rowContentKeys) {
    patch[key] = article[key] as never;
  }
  return patch;
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

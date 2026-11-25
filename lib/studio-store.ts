import type { ArticleRecord, ArticleVersionSnapshot, CaseStudyRecord } from "@/lib/studio";
import { articleFromPublishedVersion, isUuid, storageConfigured, versionContentFromArticle } from "@/lib/studio";

function db() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T | null> {
  const client = db();
  if (!client) return null;
  const res = await fetch(`${client.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: client.key,
      Authorization: `Bearer ${client.key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  if (res.status === 204) return [] as T;
  return (await res.json()) as T;
}

export async function listArticles(): Promise<ArticleRecord[] | null> {
  if (!storageConfigured()) return null;
  return rest<ArticleRecord[]>("studio_articles?select=*&order=updated_at.desc");
}

const publishedArticleColumns = [
  "id",
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
].join(",");

export async function listPublishedArticles(): Promise<ArticleRecord[]> {
  const rows = await rest<ArticleRecord[]>(
    "studio_articles?status=eq.published&published_version_id=not.is.null&select=*&order=publish_date.desc",
  );
  if (!rows) {
    const legacy = await rest<ArticleRecord[]>(
      `studio_articles?status=eq.published&select=${publishedArticleColumns}&order=publish_date.desc`,
    );
    return (legacy ?? []).filter((row) => row.status === "published");
  }
  const ids = rows
    .map((row) => row.published_version_id)
    .filter((id): id is string => typeof id === "string" && isUuid(id));
  if (ids.length === 0) return [];
  const versions = await rest<ArticleVersionSnapshot[]>(
    `article_versions?id=in.(${ids.join(",")})&approval_status=eq.approved&select=id,article_id,approval_status,content_json`,
  );
  if (!versions) return [];
  const byId = new Map(versions.map((version) => [version.id, version]));
  return rows.flatMap((row) => {
    const version = row.published_version_id ? byId.get(row.published_version_id) ?? null : null;
    const published = articleFromPublishedVersion(row, version);
    return published ? [published] : [];
  });
}

export async function recordPublishedVersion(article: ArticleRecord): Promise<ArticleRecord | null> {
  if (!isUuid(article.id)) return null;
  const prior = await rest<{ version_number: number }[]>(
    `article_versions?article_id=eq.${article.id}&select=version_number&order=version_number.desc&limit=1`,
  );
  if (!prior) return null;
  const nextNumber = (prior[0]?.version_number ?? 0) + 1;
  const inserted = await rest<ArticleVersionSnapshot[]>("article_versions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      article_id: article.id,
      version_number: nextNumber,
      content_json: versionContentFromArticle(article),
      content_html: article.body,
      metadata_json: {
        slug: article.slug,
        publish_date: article.publish_date,
        status: "published",
      },
      created_by: article.author || "studio",
      revision_notes: "Published from Studio",
      approval_status: "approved",
      approved_by: article.author || "studio",
      approved_at: new Date().toISOString(),
    }),
  });
  const created = inserted?.[0];
  if (!created || !isUuid(created.id)) return null;
  return updateArticle(article.id, {
    status: "published",
    published_version_id: created.id,
    ...(article.published_at ? {} : { published_at: new Date().toISOString() }),
  });
}

export async function getArticle(id: string): Promise<ArticleRecord | null> {
  const rows = await rest<ArticleRecord[]>(`studio_articles?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  return rows?.[0] ?? null;
}

export async function saveArticle(article: Partial<ArticleRecord> & { slug: string }): Promise<ArticleRecord | null> {
  const rows = await rest<ArticleRecord[]>("studio_articles", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ ...article, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

export async function updateArticle(id: string, patch: Partial<ArticleRecord>): Promise<ArticleRecord | null> {
  const rows = await rest<ArticleRecord[]>(`studio_articles?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

export async function listPublishedCaseStudies(): Promise<CaseStudyRecord[]> {
  const rows = await rest<CaseStudyRecord[]>("case_studies?status=eq.published&select=*");
  return rows ?? [];
}

export async function listCaseStudies(): Promise<CaseStudyRecord[] | null> {
  if (!storageConfigured()) return null;
  return rest<CaseStudyRecord[]>("case_studies?select=*&order=updated_at.desc");
}

export async function saveCaseStudy(study: Omit<CaseStudyRecord, "id"> & { id?: string }): Promise<CaseStudyRecord | null> {
  const rows = await rest<CaseStudyRecord[]>("case_studies", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...study, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

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

export type PublishedArticleLookup =
  | { state: "error"; articles: [] }
  | { state: "no-version"; articles: [] }
  | { state: "version"; articles: ArticleRecord[] };

/**
 * Public content is available only through an approved version named by the
 * article row. Lookup errors and successful empty results are separate states,
 * and neither state falls back to flat legacy columns.
 */
export async function lookupPublishedArticles(): Promise<PublishedArticleLookup> {
  try {
    const rows = await rest<ArticleRecord[]>(
      "studio_articles?status=eq.published&select=*&order=publish_date.desc",
    );
    if (!rows) return { state: "error", articles: [] };
    const ids = rows
      .map((row) => row.published_version_id)
      .filter((id): id is string => typeof id === "string" && isUuid(id));
    if (ids.length === 0) return { state: "no-version", articles: [] };
    const versions = await rest<ArticleVersionSnapshot[]>(
      `article_versions?id=in.(${ids.join(",")})&approval_status=eq.approved&select=id,article_id,approval_status,content_json`,
    );
    if (!versions) return { state: "error", articles: [] };
    const byId = new Map(versions.map((version) => [version.id, version]));
    const articles = rows.flatMap((row) => {
      const version = row.published_version_id ? byId.get(row.published_version_id) ?? null : null;
      const published = articleFromPublishedVersion(row, version);
      return published ? [published] : [];
    });
    return articles.length > 0
      ? { state: "version", articles }
      : { state: "no-version", articles: [] };
  } catch {
    return { state: "error", articles: [] };
  }
}

export async function listPublishedArticles(): Promise<ArticleRecord[]> {
  const result = await lookupPublishedArticles();
  return result.state === "version" ? result.articles : [];
}

export async function recordPublishedVersion(article: ArticleRecord): Promise<ArticleRecord | null> {
  if (!isUuid(article.id)) return null;
  try {
    const published = await rest<ArticleRecord[]>("rpc/publish_studio_article_version", {
      method: "POST",
      body: JSON.stringify({
        p_article_id: article.id,
        p_content_json: versionContentFromArticle(article),
        p_content_html: article.body,
        p_metadata_json: {
          slug: article.slug,
          publish_date: article.publish_date || null,
          status: "published",
        },
        p_created_by: article.author || "studio",
        p_revision_notes: "Published from Studio",
        p_approved_by: article.author || "studio",
      }),
    });
    return published?.[0] ?? null;
  } catch {
    return null;
  }
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

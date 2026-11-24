import type { ArticleRecord, ArticleVersionSnapshot, CaseStudyRecord, VersionPointer } from "@/lib/studio";
import { countAssetUse } from "@/lib/studio-media";
import { articleFromPublishedVersion, articleWithDraftContent, articlesWithNewestDraftTitles, isUuid, storageConfigured, versionContentFromArticle } from "@/lib/studio";
import { docToHtml, docToText, isProseDoc, plainTextToDoc, type ProseNode } from "@/lib/studio-doc";
import type { GenerationLog } from "@/lib/studio-generate";

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

type DraftVersionRow = {
  id: string;
  article_id: string;
  version_number: number;
  approval_status: "draft" | "approved";
  content_json: Record<string, unknown>;
  metadata_json?: Record<string, unknown>;
};

async function latestVersion(articleId: string): Promise<DraftVersionRow | null> {
  if (!isUuid(articleId)) return null;
  const rows = await rest<DraftVersionRow[]>(
    `article_versions?article_id=eq.${articleId}&select=id,article_id,version_number,approval_status,content_json,metadata_json&order=version_number.desc&limit=1`,
  );
  return rows?.[0] ?? null;
}

export async function listArticles(): Promise<ArticleRecord[] | null> {
  if (!storageConfigured()) return null;
  const rows = await rest<ArticleRecord[]>("studio_articles?select=*&order=updated_at.desc");
  if (!rows) return null;
  const drafts = await rest<DraftVersionRow[]>(
    "article_versions?approval_status=eq.draft&select=article_id,version_number,content_json&order=version_number.desc",
  );
  if (!drafts) return rows;
  return articlesWithNewestDraftTitles(rows, drafts);
}

export type WorkingArticle = ArticleRecord & { doc: ProseNode };

export async function getWorkingArticle(id: string): Promise<WorkingArticle | null> {
  const row = await getArticle(id);
  if (!row) return null;
  const latest = await latestVersion(id);
  if (!latest || latest.approval_status !== "draft") {
    const doc = isProseDoc(latest?.content_json?.doc) ? (latest?.content_json.doc as ProseNode) : plainTextToDoc(row.body);
    return { ...row, doc };
  }
  const working = articleWithDraftContent(row, latest.content_json, latest.metadata_json ?? null);
  const doc = isProseDoc(latest.content_json.doc) ? latest.content_json.doc : plainTextToDoc(working.body);
  return { ...working, doc };
}

export type PublishedArticle = ArticleRecord & { content_html?: string };

export type PublishedArticleLookup =
  | { state: "error"; articles: [] }
  | { state: "no-version"; articles: [] }
  | { state: "version"; articles: PublishedArticle[] };

/** Public reads require the approved version named by the article row. */
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
      `article_versions?id=in.(${ids.join(",")})&approval_status=eq.approved&select=id,article_id,approval_status,content_json,content_html`,
    );
    if (!versions) return { state: "error", articles: [] };
    const byId = new Map(versions.map((version) => [version.id, version]));
    const articles = rows.flatMap((row) => {
      const version = row.published_version_id ? byId.get(row.published_version_id) ?? null : null;
      const published = articleFromPublishedVersion(row, version);
      return published ? [{ ...published, content_html: version?.content_html ?? "" }] : [];
    });
    return articles.length > 0
      ? { state: "version", articles }
      : { state: "no-version", articles: [] };
  } catch {
    return { state: "error", articles: [] };
  }
}

export async function listPublishedArticles(): Promise<PublishedArticle[]> {
  const result = await lookupPublishedArticles();
  return result.state === "version" ? result.articles : [];
}

export async function findPublishedSlugRedirect(slug: string): Promise<string | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const versions = await rest<{ article_id: string }[]>(
    `article_versions?approval_status=eq.approved&metadata_json->>slug=eq.${encodeURIComponent(slug)}&select=article_id&limit=5`,
  );
  if (!versions) return null;
  for (const version of versions) {
    if (!isUuid(version.article_id)) continue;
    const rows = await rest<{ slug: string; status: string }[]>(
      `studio_articles?id=eq.${version.article_id}&status=eq.published&select=slug,status&limit=1`,
    );
    const row = rows?.[0];
    if (row?.status === "published" && row.slug && row.slug !== slug) return row.slug;
  }
  return null;
}

export async function saveDraftVersion(article: ArticleRecord, doc: ProseNode): Promise<boolean> {
  if (!isUuid(article.id)) return false;
  const prior = await rest<VersionPointer[]>(
    `article_versions?article_id=eq.${article.id}&select=id,version_number,approval_status&order=version_number.desc&limit=1`,
  );
  if (!prior) return false;
  const latest = prior[0] ?? null;
  const content_json = { ...versionContentFromArticle({ ...article, body: docToText(doc) }), doc };
  const content_html = docToHtml(doc);
  const metadata_json = { slug: article.slug, publish_date: article.publish_date, status: article.status };
  if (latest?.approval_status === "draft") {
    const rows = await rest<DraftVersionRow[]>(`article_versions?id=eq.${latest.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        content_json,
        content_html,
        metadata_json,
        revision_notes: "Draft save",
      }),
    });
    return Boolean(rows?.[0]);
  }
  const inserted = await rest<DraftVersionRow[]>("article_versions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      article_id: article.id,
      version_number: (latest?.version_number ?? 0) + 1,
      content_json,
      content_html,
      metadata_json,
      created_by: article.author || "studio",
      revision_notes: "Draft save",
      approval_status: "draft",
    }),
  });
  return Boolean(inserted?.[0]);
}

export async function recordPublishedVersion(article: ArticleRecord, doc?: ProseNode | null): Promise<ArticleRecord | null> {
  if (!isUuid(article.id)) return null;
  try {
    const published = await rest<ArticleRecord[]>("rpc/publish_studio_article_version", {
      method: "POST",
      body: JSON.stringify({
        p_article_id: article.id,
        p_content_json: { ...versionContentFromArticle(article), ...(doc ? { doc } : {}) },
        p_content_html: doc ? docToHtml(doc) : article.body,
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

export type ArticleVersionSummary = {
  id: string;
  version_number: number;
  approval_status: string;
  created_at: string;
  revision_notes: string;
};

export async function listArticleVersions(articleId: string): Promise<ArticleVersionSummary[] | null> {
  if (!isUuid(articleId) || !storageConfigured()) return null;
  return rest<ArticleVersionSummary[]>(
    `article_versions?article_id=eq.${articleId}&select=id,version_number,approval_status,created_at,revision_notes&order=version_number.desc`,
  );
}

export async function listDueScheduledArticles(nowIso: string): Promise<ArticleRecord[] | null> {
  if (!storageConfigured()) return null;
  return rest<ArticleRecord[]>(
    `studio_articles?status=eq.scheduled&scheduled_at=lte.${encodeURIComponent(nowIso)}&select=*`,
  );
}

export type MediaAssetRecord = {
  id: string;
  storage_path: string;
  public_url: string;
  mime: string;
  byte_size: number;
  width: number | null;
  height: number | null;
  alt: string;
};

export async function listMediaAssets(): Promise<MediaAssetRecord[] | null> {
  if (!storageConfigured()) return null;
  return rest<MediaAssetRecord[]>("media_assets?select=*&order=created_at.desc");
}

export async function insertMediaAsset(asset: Omit<MediaAssetRecord, "id">): Promise<MediaAssetRecord | null> {
  const rows = await rest<MediaAssetRecord[]>("media_assets", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(asset),
  });
  return rows?.[0] ?? null;
}

export async function mediaUsageCount(publicUrl: string, storagePath: string): Promise<number | null> {
  const articles = await rest<{ hero_image: string | null }[]>("studio_articles?select=hero_image");
  const versions = await rest<{ content_html: string | null; content_json: unknown }[]>(
    "article_versions?select=content_html,content_json",
  );
  if (!articles || !versions) return null;
  return countAssetUse({ publicUrl, storagePath }, articles, versions);
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  if (!isUuid(id)) return false;
  const rows = await rest<{ id: string }[]>(`media_assets?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=representation" } });
  return Boolean(rows);
}

export async function insertGenerationLog(entry: GenerationLog): Promise<boolean> {
  const rows = await rest<{ id: string }[]>("ai_generation_logs", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(entry),
  });
  return Boolean(rows?.[0]);
}

export async function insertArticleSources(
  articleId: string,
  sources: { title: string; url: string; claim: string }[],
): Promise<boolean> {
  if (!isUuid(articleId) || sources.length === 0) return false;
  const rows = await rest<{ id: string }[]>("article_sources", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(
      sources.map((source) => ({
        article_id: articleId,
        title: source.title,
        url: source.url,
        claim: source.claim,
        verified: false,
      })),
    ),
  });
  return Boolean(rows && rows.length > 0);
}

export async function saveCaseStudy(study: Omit<CaseStudyRecord, "id"> & { id?: string }): Promise<CaseStudyRecord | null> {
  const rows = await rest<CaseStudyRecord[]>("case_studies", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...study, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

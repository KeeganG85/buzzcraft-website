import type { ArticleRecord, ArticleVersionSnapshot, CaseStudyRecord, VersionPointer } from "@/lib/studio";
import { articleFromPublishedVersion, articleWithDraftContent, isUuid, storageConfigured, versionContentFromArticle } from "@/lib/studio";
import { docToHtml, docToText, isProseDoc, plainTextToDoc, type ProseNode } from "@/lib/studio-doc";

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
  const newest = new Map<string, DraftVersionRow>();
  for (const draft of drafts) {
    if (!newest.has(draft.article_id)) newest.set(draft.article_id, draft);
  }
  return rows.map((row) => {
    const draft = newest.get(row.id);
    const title = draft?.content_json?.title;
    if (typeof title !== "string" || !title.trim()) return row;
    return { ...row, title };
  });
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

export type PublishedArticleLookup =
  | { state: "error"; articles: [] }
  | { state: "no-version"; articles: [] }
  | { state: "version"; articles: ArticleRecord[] };

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
      content_json: { ...versionContentFromArticle(article), ...(doc ? { doc } : {}) },
      content_html: doc ? docToHtml(doc) : article.body,
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

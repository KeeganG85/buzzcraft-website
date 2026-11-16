import type { ArticleRecord, CaseStudyRecord } from "@/lib/studio";
import { storageConfigured } from "@/lib/studio";

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

export async function listPublishedArticles(): Promise<ArticleRecord[]> {
  const rows = await rest<ArticleRecord[]>(
    "studio_articles?status=eq.published&select=*&order=publish_date.desc",
  );
  return rows ?? [];
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

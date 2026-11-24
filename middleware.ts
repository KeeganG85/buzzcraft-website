import { NextResponse, type NextRequest } from "next/server";
import { isWithheldInsightSlug, redirectSlug } from "@/lib/insights-public";

export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/insights\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  if (!match) return NextResponse.next();
  const slug = match[1];
  if (isWithheldInsightSlug(slug)) return NextResponse.next();
  const destination = await lookupPublishedSlug(slug);
  const next = redirectSlug(slug, destination);
  if (!next) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/insights/${next}/`;
  return NextResponse.redirect(url, 301);
}

async function lookupPublishedSlug(slug: string): Promise<string | null> {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return null;
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const versions = await fetch(
    `${base}/rest/v1/article_versions?approval_status=eq.approved&metadata_json->>slug=eq.${encodeURIComponent(slug)}&select=article_id&limit=5`,
    { headers, cache: "no-store" },
  );
  if (!versions.ok) return null;
  const rows = (await versions.json()) as { article_id?: string }[];
  for (const row of rows) {
    if (!row.article_id) continue;
    const article = await fetch(
      `${base}/rest/v1/studio_articles?id=eq.${encodeURIComponent(row.article_id)}&status=eq.published&select=slug,status&limit=1`,
      { headers, cache: "no-store" },
    );
    if (!article.ok) continue;
    const found = (await article.json()) as { slug?: string; status?: string }[];
    if (found[0]?.status === "published" && found[0].slug) return found[0].slug;
  }
  return null;
}

export const config = {
  matcher: ["/insights/:slug", "/insights/:slug/"],
};

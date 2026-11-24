import { NextResponse } from "next/server";
import { canPublish, publishChecklist, studioSession, type ArticleRecord } from "@/lib/studio";
import { listArticles, recordPublishedVersion, saveArticle, updateArticle } from "@/lib/studio-store";

export const runtime = "nodejs";

function asArticle(body: Record<string, unknown>, id = ""): ArticleRecord {
  const tags = Array.isArray(body.tags)
    ? body.tags.map(String)
    : String(body.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  return {
    id,
    slug: String(body.slug ?? "").trim(),
    title: String(body.title ?? "").trim(),
    h1: String(body.h1 ?? "").trim(),
    excerpt: String(body.excerpt ?? "").trim(),
    author: String(body.author ?? "").trim(),
    category: String(body.category ?? "").trim(),
    tags,
    body: String(body.body ?? ""),
    hero_image: String(body.hero_image ?? "").trim(),
    hero_alt: String(body.hero_alt ?? "").trim(),
    publish_date: String(body.publish_date ?? ""),
    seo_title: String(body.seo_title ?? "").trim(),
    meta_description: String(body.meta_description ?? "").trim(),
    canonical: String(body.canonical ?? "").trim(),
    og_title: String(body.og_title ?? "").trim(),
    og_description: String(body.og_description ?? "").trim(),
    focus_phrase: String(body.focus_phrase ?? "").trim(),
    source_note: String(body.source_note ?? "").trim(),
    claims_checked: body.claims_checked === true,
    status: "draft",
  };
}

export async function POST(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const article = asArticle(body, String(body.id ?? ""));
  const existing = (await listArticles()) ?? [];
  const otherSlugs = existing.filter((item) => item.id !== article.id).map((item) => item.slug);
  const publishing = body.intent === "publish";
  if (publishing) {
    const issues = publishChecklist(article, otherSlugs);
    if (!canPublish(article, otherSlugs)) {
      return NextResponse.json({ ok: false, issues }, { status: 422 });
    }
    article.status = "published";
    if (!article.publish_date) article.publish_date = new Date().toISOString().slice(0, 10);
  }
  const { id, ...fields } = article;
  const saved = id ? await updateArticle(id, fields) : await saveArticle(fields);
  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "Article storage is not configured, so nothing was published." },
      { status: 503 },
    );
  }
  if (!publishing) return NextResponse.json({ ok: true, article: saved });

  const published = await recordPublishedVersion(saved);
  if (!published) {
    if (!saved.published_version_id) await updateArticle(saved.id, { status: "draft" });
    return NextResponse.json(
      { ok: false, error: "The article was not published because the approved version could not be stored." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, article: published });
}

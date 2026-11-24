import { NextResponse } from "next/server";
import { isProseDoc, plainTextToDoc, docToText, type ProseNode } from "@/lib/studio-doc";
import {
  articleSavePlan,
  canPublish,
  publishChecklist,
  rowPatchForSave,
  uniqueSlugFromTitle,
  studioSession,
  type ArticleRecord,
  type ArticleStatus,
} from "@/lib/studio";
import { isWithheldInsightSlug } from "@/lib/insights-public";
import { johannesburgInputToUtc } from "@/lib/studio-time";
import { listArticles, recordPublishedVersion, saveArticle, saveDraftVersion, updateArticle } from "@/lib/studio-store";

export const runtime = "nodejs";

const statuses = new Set<ArticleStatus>(["draft", "in_review", "approved", "scheduled", "published", "archived"]);

function asArticle(body: Record<string, unknown>, id: string, doc: ProseNode): ArticleRecord {
  const tags = Array.isArray(body.tags)
    ? body.tags.map(String)
    : String(body.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const requestedStatus = String(body.status ?? "");
  return {
    id,
    slug: String(body.slug ?? "").trim(),
    title: String(body.title ?? "").trim(),
    h1: String(body.h1 ?? "").trim(),
    excerpt: String(body.excerpt ?? "").trim(),
    author: String(body.author ?? "").trim(),
    category: String(body.category ?? "").trim(),
    tags,
    body: docToText(doc),
    hero_image: String(body.hero_image ?? "").trim(),
    hero_alt: String(body.hero_alt ?? "").trim(),
    publish_date: body.publish_date == null ? null : String(body.publish_date).trim() || null,
    seo_title: String(body.seo_title ?? "").trim(),
    meta_description: String(body.meta_description ?? "").trim(),
    canonical: String(body.canonical ?? "").trim(),
    og_title: String(body.og_title ?? "").trim(),
    og_description: String(body.og_description ?? "").trim(),
    focus_phrase: String(body.focus_phrase ?? "").trim(),
    source_note: String(body.source_note ?? "").trim(),
    claims_checked: body.claims_checked === true,
    status: statuses.has(requestedStatus as ArticleStatus) ? (requestedStatus as ArticleStatus) : "draft",
  };
}

export async function POST(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const doc = isProseDoc(body.doc) ? body.doc : plainTextToDoc(String(body.body ?? ""));
  const article = asArticle(body, String(body.id ?? ""), doc);
  const existingRows = await listArticles();
  if (article.id && !existingRows) {
    return NextResponse.json(
      { ok: false, error: "Article storage is not configured, so nothing was saved." },
      { status: 503 },
    );
  }
  const rows = existingRows ?? [];
  const current = rows.find((item) => item.id === article.id) ?? null;
  const otherSlugs = rows.filter((item) => item.id !== article.id).map((item) => item.slug);
  if (!article.slug) article.slug = current?.slug || uniqueSlugFromTitle(article.title, otherSlugs);
  const publishing = body.intent === "publish";
  const scheduling = body.intent === "schedule";
  const scheduledAt = scheduling ? johannesburgInputToUtc(String(body.scheduled_local ?? "")) : null;
  if (scheduling && !scheduledAt) {
    return NextResponse.json({ ok: false, error: "Choose a date and time in Johannesburg." }, { status: 422 });
  }
  if (scheduling && (isWithheldInsightSlug(article.slug) || current?.status === "published")) {
    return NextResponse.json({ ok: false, error: "That article stays as it is." }, { status: 422 });
  }
  const plan = articleSavePlan(current?.status ?? null, publishing ? "publish" : "save", null);
  article.status = scheduling ? "scheduled" : plan.status;

  if (publishing) {
    const issues = publishChecklist(article, otherSlugs);
    if (!canPublish(article, otherSlugs)) {
      return NextResponse.json({ ok: false, issues }, { status: 422 });
    }
    if (!article.publish_date) article.publish_date = new Date().toISOString().slice(0, 10);
  }

  const patch = rowPatchForSave(article, plan.updateRowContent);
  // The RPC is the only operation that may advance publication state. Keep an
  // existing status (or a new article as draft) if the RPC fails.
  if (publishing) patch.status = current?.status ?? "draft";
  const saved = article.id
    ? await updateArticle(article.id, patch)
    : await saveArticle({ ...patch, slug: article.slug });
  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "Article storage is not configured, so nothing was saved." },
      { status: 503 },
    );
  }

  const stored: ArticleRecord = {
    ...article,
    id: saved.id,
    status: plan.updateRowContent ? saved.status : (current?.status ?? saved.status),
    published_version_id: saved.published_version_id,
  };

  if (plan.writeDraftVersion || scheduling) {
    const drafted = await saveDraftVersion({ ...stored, status: article.status }, doc);
    if (!drafted) {
      return NextResponse.json(
        { ok: false, article: { id: stored.id }, error: "The draft version could not be stored. The live article was left as it was." },
        { status: 503 },
      );
    }
    if (scheduling && scheduledAt) {
      const scheduled = await updateArticle(saved.id, { status: "scheduled", scheduled_at: scheduledAt });
      if (!scheduled) {
        return NextResponse.json({ ok: false, error: "The schedule was not stored." }, { status: 503 });
      }
      return NextResponse.json({
        ok: true,
        article: scheduled,
        scheduled_at: scheduledAt,
        cronConfigured: Boolean(process.env.CRON_SECRET?.trim()),
      });
    }
    return NextResponse.json({ ok: true, article: stored });
  }

  const published = await recordPublishedVersion(stored, doc);
  if (!published) {
    return NextResponse.json(
      { ok: false, article: { id: stored.id }, error: "The article was not published because the approved version could not be stored." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, article: published });
}

import { NextResponse } from "next/server";
import { publishChecklist, rowPatchForSave } from "@/lib/studio";
import { cronAuthorised, dueScheduled } from "@/lib/studio-schedule";
import { getWorkingArticle, listArticles, listDueScheduledArticles, lookupLatestVersion, recordPublishedVersion, updateArticle } from "@/lib/studio-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = cronAuthorised(request.headers.get("authorization"), process.env.CRON_SECRET);
  if (auth === "missing") {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not set, so scheduled publishing did not run." },
      { status: 503 },
    );
  }
  if (auth !== "ok") return NextResponse.json({ ok: false }, { status: 401 });

  const now = new Date();
  const nowIso = now.toISOString();
  const listed = await listDueScheduledArticles(nowIso);
  if (!listed) {
    return NextResponse.json(
      { ok: false, error: "Article storage is not configured, so scheduled publishing did not run." },
      { status: 503 },
    );
  }
  const due = dueScheduled(listed, nowIso);
  const rows = await listArticles();
  if (!rows) {
    return NextResponse.json(
      { ok: false, error: "Article storage is not configured, so scheduled publishing did not run." },
      { status: 503 },
    );
  }
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(now);
  let published = 0;
  const skipped: { id: string; slug: string; reason: string }[] = [];
  for (const article of due) {
    const version = await lookupLatestVersion(article.id);
    if (version.state === "error") {
      skipped.push({ id: article.id, slug: article.slug, reason: version.reason });
      continue;
    }
    if (version.state === "no-version") {
      skipped.push({ id: article.id, slug: article.slug, reason: "No article version exists yet; the scheduled item was left unchanged and can be retried." });
      continue;
    }
    const working = await getWorkingArticle(article.id);
    if (!working) {
      skipped.push({ id: article.id, slug: article.slug, reason: "The article working copy could not be read; the scheduled item was left unchanged." });
      continue;
    }
    const ready = {
      ...working,
      publish_date: working.publish_date || today,
      status: "scheduled" as const,
    };
    const otherSlugs = rows.filter((item) => item.id !== article.id).map((item) => item.slug);
    const issues = publishChecklist(ready, otherSlugs);
    if (issues.length > 0) {
      skipped.push({ id: article.id, slug: article.slug, reason: `Publish checklist: ${issues.join("; ")}` });
      continue;
    }
    const patched = await updateArticle(article.id, rowPatchForSave(ready, true));
    if (!patched) {
      skipped.push({ id: article.id, slug: article.slug, reason: "The scheduled article could not be updated; it remains eligible for retry." });
      continue;
    }
    const result = await recordPublishedVersion(ready, working.doc);
    if (result?.status === "published") published += 1;
    else skipped.push({ id: article.id, slug: article.slug, reason: "The published version could not be recorded; inspect the article state before retrying." });
  }
  return NextResponse.json({ ok: true, published, skipped });
}

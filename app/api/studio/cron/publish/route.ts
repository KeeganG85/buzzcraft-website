import { NextResponse } from "next/server";
import { canPublish, rowPatchForSave } from "@/lib/studio";
import { cronAuthorised, dueScheduled } from "@/lib/studio-schedule";
import { getWorkingArticle, listArticles, listDueScheduledArticles, recordPublishedVersion, updateArticle } from "@/lib/studio-store";

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
  for (const article of due) {
    const working = await getWorkingArticle(article.id);
    if (!working) continue;
    const ready = {
      ...working,
      publish_date: working.publish_date || today,
      status: "scheduled" as const,
    };
    const otherSlugs = rows.filter((item) => item.id !== article.id).map((item) => item.slug);
    if (!canPublish(ready, otherSlugs)) continue;
    const patched = await updateArticle(article.id, rowPatchForSave(ready, true));
    if (!patched) continue;
    const result = await recordPublishedVersion(ready, working.doc);
    if (result?.status === "published") published += 1;
  }
  return NextResponse.json({ ok: true, published });
}

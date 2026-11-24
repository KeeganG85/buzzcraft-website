import { NextResponse } from "next/server";
import { cronAuthorised, dueScheduled } from "@/lib/studio-schedule";
import { listDueScheduledArticles, recordPublishedVersion } from "@/lib/studio-store";

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

  const now = new Date().toISOString();
  const due = dueScheduled((await listDueScheduledArticles(now)) ?? [], now);
  let published = 0;
  for (const article of due) {
    const result = await recordPublishedVersion(article);
    if (result?.status === "published") published += 1;
  }
  return NextResponse.json({ ok: true, published });
}

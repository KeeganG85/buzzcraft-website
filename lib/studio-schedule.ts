import { timingSafeEqual } from "crypto";
import { isWithheldInsightSlug } from "@/lib/insights-public";
export { johannesburgInputToUtc, johannesburgLabel, utcToJohannesburgInput } from "@/lib/studio-time";

export function cronConfigured(secret: string | null | undefined): boolean {
  return Boolean(secret?.trim());
}

export function cronAuthorised(header: string | null, secret: string | null | undefined): "missing" | "ok" | "rejected" {
  const expected = secret?.trim() ?? "";
  if (!expected) return "missing";
  const token = header?.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length !== right.length || left.length === 0) return "rejected";
  return timingSafeEqual(left, right) ? "ok" : "rejected";
}

/** Status and time only. Scheduling must not rewrite the article body. */
export function scheduleRowPatch(scheduledAt: string): { status: "scheduled"; scheduled_at: string } {
  return { status: "scheduled", scheduled_at: scheduledAt };
}

export function dueScheduled<T extends { status: string; scheduled_at?: string | null; slug?: string }>(
  articles: T[],
  nowIso: string,
): T[] {
  const now = new Date(nowIso).getTime();
  return articles.filter((article) => {
    if (article.status !== "scheduled" || !article.scheduled_at) return false;
    if (article.slug && isWithheldInsightSlug(article.slug)) return false;
    return new Date(article.scheduled_at).getTime() <= now;
  });
}

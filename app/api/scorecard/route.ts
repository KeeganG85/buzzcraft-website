import { NextResponse } from "next/server";
import { insertScorecard, parseScorecard, scorecardWhatsAppMessage } from "@/lib/scorecard";
import { whatsAppHref } from "@/lib/whatsapp";

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, errors: { form: "Too many attempts. Please try again shortly." } },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = parseScorecard(body);
  if (!parsed.ok && "honeypot" in parsed) return NextResponse.json({ ok: true });
  if (!parsed.ok) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 422 });

  const storage = await insertScorecard(parsed.lead);
  if (storage !== "saved") {
    console.error(`Scorecard: storage result was ${storage}.`);
  }

  return NextResponse.json(
    {
      ok: true,
      saved: storage === "saved",
      whatsappUrl: whatsAppHref(scorecardWhatsAppMessage(parsed.lead)),
    },
    { status: storage === "saved" ? 201 : 200 },
  );
}

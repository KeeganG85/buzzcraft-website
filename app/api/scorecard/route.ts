import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

/**
 * Scorecard lead capture.
 *
 * - Validates and normalises server-side; the client is never trusted.
 * - Persists to Supabase via the REST API using the service-role key, which
 *   exists only in server environment variables (SUPABASE_URL and
 *   SUPABASE_SERVICE_ROLE_KEY). It is never exposed as NEXT_PUBLIC_*.
 * - Rejects honeypot submissions silently with a 200 so bots learn nothing.
 * - Applies a light in-memory rate limit per IP as a first line of defence.
 */

interface ScorecardPayload {
  full_name?: unknown;
  business_name?: unknown;
  website_url?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  privacy_consent?: unknown;
  marketing_opt_in?: unknown;
  company?: unknown; // honeypot
  source_path?: unknown;
  referrer?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
}

const RATE_LIMIT = 5; // submissions per window per IP
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

function str(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optStr(value: unknown, max = 300): string | null {
  const s = str(value, max);
  return s.length > 0 ? s : null;
}

/** Normalise a South African-friendly number to E.164 where possible. */
function normaliseWhatsapp(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+\d{9,15}$/.test(digits)) return digits;
  const bare = digits.replace(/\D/g, "");
  if (/^0\d{9}$/.test(bare)) return `+27${bare.slice(1)}`; // local SA format
  if (/^27\d{9}$/.test(bare)) return `+${bare}`;
  if (/^\d{9,15}$/.test(bare)) return `+${bare}`;
  return null;
}

function normaliseUrl(raw: string): string | null {
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: { form: "Too many attempts. Please try again shortly." } }, { status: 429 });
  }

  let body: ScorecardPayload;
  try {
    body = (await request.json()) as ScorecardPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled → almost certainly a bot. Pretend success, store nothing.
  if (str(body.company).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errors: Record<string, string> = {};
  const fullName = str(body.full_name, 120);
  const businessName = str(body.business_name, 160);
  const websiteUrl = normaliseUrl(str(body.website_url, 300));
  const whatsappE164 = normaliseWhatsapp(str(body.whatsapp, 30));
  const email = str(body.email, 200).toLowerCase();

  if (!fullName) errors.full_name = "Enter your full name.";
  if (!businessName) errors.business_name = "Enter your business name.";
  if (!websiteUrl) errors.website_url = "Enter a valid website address.";
  if (!whatsappE164) errors.whatsapp = "Enter a valid WhatsApp number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (body.privacy_consent !== true)
    errors.privacy_consent = "Consent is required so we can prepare and send your Scorecard.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead = {
    full_name: fullName,
    business_name: businessName,
    website_url: websiteUrl,
    whatsapp_e164: whatsappE164,
    email,
    privacy_consent: true,
    privacy_consent_at: new Date().toISOString(),
    privacy_policy_version: siteConfig.privacyPolicyVersion,
    marketing_opt_in: body.marketing_opt_in === true,
    source_path: optStr(body.source_path, 300),
    referrer: optStr(body.referrer, 500),
    utm_source: optStr(body.utm_source, 120),
    utm_medium: optStr(body.utm_medium, 120),
    utm_campaign: optStr(body.utm_campaign, 120),
    status: "new",
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Configuration gap: fail loudly server-side, gently client-side.
    console.error("Scorecard: Supabase server credentials are not configured.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/scorecard_leads`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    console.error(`Scorecard: Supabase insert failed with status ${res.status}.`);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

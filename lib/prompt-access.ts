import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

export const PROMPT_COOKIE = "prompt_os";

export type PromptRegistration = {
  first_name: string;
  email: string;
  business_name: string;
  business_does: string;
  privacy_consent: true;
  privacy_consent_at: string;
  marketing_opt_in: boolean;
  token_hash: string;
};

export function newPromptToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashPromptToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function supabase() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function parseRegistration(body: Record<string, unknown>, tokenHash: string, now = new Date()) {
  if (typeof body.company === "string" && body.company.trim()) return { ok: false as const, honeypot: true as const };
  const errors: Record<string, string> = {};
  const first = typeof body.first_name === "string" ? body.first_name.trim().slice(0, 80) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const business = typeof body.business_name === "string" ? body.business_name.trim().slice(0, 160) : "";
  const does = typeof body.business_does === "string" ? body.business_does.trim().slice(0, 240) : "";
  if (!first) errors.first_name = "Enter your first name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid work email.";
  if (!business) errors.business_name = "Enter the business name.";
  if (!does) errors.business_does = "Say what the business does.";
  if (body.privacy_consent !== true) errors.privacy_consent = "Consent is required to open the library.";
  if (Object.keys(errors).length) return { ok: false as const, errors };
  const registration: PromptRegistration = {
    first_name: first,
    email,
    business_name: business,
    business_does: does,
    privacy_consent: true,
    privacy_consent_at: now.toISOString(),
    marketing_opt_in: body.marketing_opt_in === true,
    token_hash: tokenHash,
  };
  return { ok: true as const, registration };
}

export async function saveRegistration(registration: PromptRegistration): Promise<"saved" | "unconfigured" | "failed"> {
  const db = supabase();
  if (!db) return "unconfigured";
  try {
    const res = await fetch(`${db.url}/rest/v1/prompt_os_registrations?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: db.key,
        Authorization: `Bearer ${db.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ ...registration, updated_at: new Date().toISOString() }),
    });
    return res.ok ? "saved" : "failed";
  } catch {
    return "failed";
  }
}

export async function readPromptSession(): Promise<{ firstName: string } | null> {
  const jar = await cookies();
  const token = jar.get(PROMPT_COOKIE)?.value;
  if (!token) return null;
  const db = supabase();
  if (!db) return null;
  const hash = hashPromptToken(token);
  try {
    const res = await fetch(
      `${db.url}/rest/v1/prompt_os_registrations?token_hash=eq.${hash}&select=first_name&limit=1`,
      {
        headers: { apikey: db.key, Authorization: `Bearer ${db.key}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { first_name?: string }[];
    const firstName = rows[0]?.first_name;
    return firstName ? { firstName } : null;
  } catch {
    return null;
  }
}

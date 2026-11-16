import { siteConfig } from "@/lib/site-config";

export type ScorecardLead = {
  full_name: string;
  email: string;
  business_name: string;
  website_url: string | null;
  headache: string | null;
  privacy_consent: true;
  privacy_consent_at: string;
  privacy_policy_version: string;
  marketing_opt_in: boolean;
  source_path: string | null;
  referrer: string | null;
};

export type ScorecardParse =
  | { ok: false; honeypot: true }
  | { ok: false; errors: Record<string, string> }
  | { ok: true; lead: ScorecardLead };

function str(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normaliseWebsite(raw: string): string | null {
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function parseScorecard(body: Record<string, unknown>, now = new Date()): ScorecardParse {
  if (str(body.company).length > 0) return { ok: false, honeypot: true };

  const errors: Record<string, string> = {};
  const fullName = str(body.full_name, 120);
  const businessName = str(body.business_name, 160);
  const email = str(body.email, 200).toLowerCase();
  const websiteRaw = str(body.website_url, 300);
  const headache = str(body.headache, 1000);
  const website = websiteRaw ? normaliseWebsite(websiteRaw) : null;

  if (!fullName) errors.full_name = "Enter your full name.";
  if (!businessName) errors.business_name = "Enter your business name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (websiteRaw && !website) errors.website_url = "Enter a valid website address, or leave it blank.";
  if (body.privacy_consent !== true) {
    errors.privacy_consent = "Consent is required so we can prepare and send your Scorecard.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      full_name: fullName,
      email,
      business_name: businessName,
      website_url: website,
      headache: headache || null,
      privacy_consent: true,
      privacy_consent_at: now.toISOString(),
      privacy_policy_version: siteConfig.privacyPolicyVersion,
      marketing_opt_in: body.marketing_opt_in === true,
      source_path: str(body.source_path, 300) || null,
      referrer: str(body.referrer, 500) || null,
    },
  };
}

export function scorecardWhatsAppMessage(lead: ScorecardLead): string {
  return [
    "Search Visibility Scorecard request",
    `Name: ${lead.full_name}`,
    `Email: ${lead.email}`,
    `Business: ${lead.business_name}`,
    `Website: ${lead.website_url ?? "Not supplied"}`,
    `Headache: ${lead.headache ?? "Not supplied"}`,
    "POPIA consent: yes",
    `Marketing emails: ${lead.marketing_opt_in ? "yes" : "no"}`,
  ].join("\n");
}

export async function insertScorecard(lead: ScorecardLead): Promise<"saved" | "unconfigured" | "failed"> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return "unconfigured";

  try {
    const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/scorecard_requests`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    });
    return res.ok ? "saved" : "failed";
  } catch {
    return "failed";
  }
}

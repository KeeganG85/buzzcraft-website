/**
 * BuzzCraft — central site configuration.
 *
 * Every business fact, URL, price and contact detail lives here and only here.
 * Values marked TODO_VERIFY must be confirmed by the owner before launch.
 * Never duplicate these values inside components.
 */

export const siteConfig = {
  name: "BuzzCraft",
  legalName: "BuzzCraft", // TODO_VERIFY registered entity name, e.g. BuzzCraft (Pty) Ltd
  url: "https://www.buzzcraft.co.za",
  tagline: "Crafting Buzz. Creating Impact.",
  corePromise: "Intelligent systems. Measurable impact.",
  description:
    "BuzzCraft is a Johannesburg growth systems agency. We connect strategy, visibility and conversion so ambitious South African businesses stop guessing and start building measurable momentum.",

  // ── Contact ────────────────────────────────────────────────────────────────
  // TODO_VERIFY: confirm the live business WhatsApp number in E.164 format.
  whatsappNumber: "27000000000", // TODO_VERIFY
  email: "hello@buzzcraft.co.za", // TODO_VERIFY
  bookingUrl: "https://calendly.com/TODO_VERIFY", // TODO_VERIFY booking link

  // ── Location ───────────────────────────────────────────────────────────────
  // Only city/region-level facts are published. Do not add a street address,
  // opening hours or map pin until verified by the owner.
  city: "Johannesburg",
  region: "Gauteng",
  country: "South Africa",
  countryCode: "ZA",
  serviceAreas: ["Johannesburg", "Gauteng", "South Africa"],

  // ── Social ─────────────────────────────────────────────────────────────────
  social: {
    linkedin: "https://www.linkedin.com/company/TODO_VERIFY",
    instagram: "https://www.instagram.com/TODO_VERIFY",
    facebook: "https://www.facebook.com/TODO_VERIFY",
  },

  // ── Sprint offer ───────────────────────────────────────────────────────────
  sprint: {
    name: "The BuzzCraft Sprint",
    // TODO_VERIFY: approved deposit amount in Rand. Displayed only when set.
    depositZAR: null as number | null, // e.g. 4500
    // TODO_VERIFY: live Yoco hosted payment link. The Sprint CTA falls back to
    // WhatsApp until this is a real, verified URL.
    yocoPaymentUrl: null as string | null, // e.g. "https://pay.yoco.com/..."
    durationBusinessDays: 10,
  },

  // ── Tools ──────────────────────────────────────────────────────────────────
  tools: {
    blueprintBuilderUrl: "https://TODO_VERIFY.buzzcraft.co.za/blueprint", // TODO_VERIFY
    promptOsUrl: "https://TODO_VERIFY.buzzcraft.co.za/prompts", // TODO_VERIFY
    scorecardPath: "/scorecard",
  },

  // ── Legal / compliance ─────────────────────────────────────────────────────
  privacyPolicyPath: "/privacy",
  privacyPolicyVersion: "2026-07-01",

  // ── Analytics ──────────────────────────────────────────────────────────────
  analytics: {
    // TODO_VERIFY: set the production analytics ID. Events no-op when null.
    plausibleDomain: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** True when a config value is still a placeholder awaiting owner sign-off. */
export function isVerified(value: string | null | undefined): boolean {
  return !!value && !value.includes("TODO_VERIFY");
}

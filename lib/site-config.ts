/**
 * Public facts confirmed for this rebuild.
 * The registered legal name, registration number and Information Officer
 * are not published on the live site. Do not invent them.
 */

export const siteConfig = {
  name: "BuzzCraft",
  url: "https://www.buzzcraft.co.za",
  tagline: "Crafting Buzz. Creating Impact.",
  description:
    "BuzzCraft builds search-visible, AI-ready websites and lead systems for South African businesses. Based in Johannesburg.",
  locale: "en-ZA",

  whatsappE164: "+27679521325",
  whatsappDisplay: "+27 67 952 1325",
  whatsappHref: "https://wa.me/27679521325",
  email: "info@buzzcraft.co.za",

  city: "Johannesburg",
  region: "Gauteng",
  country: "South Africa",
  countryCode: "ZA",

  /**
   * Owner input still required. The live privacy policy names "BuzzCraft"
   * and Johannesburg only. No company type or registration number is published.
   */
  legalEntity: {
    publishedName: "BuzzCraft",
    registeredName: null as string | null,
    registrationNumber: null as string | null,
    informationOfficer: null as string | null,
  },

  founders: [
    { name: "Keegan Goocin", role: "Co-founder" },
    { name: "Mokhachane Taoana", role: "Co-founding partner" },
  ],

  /**
   * Profiles linked from the live tools page.
   * The Facebook href on that page is a post share URL, not a page profile,
   * so it is not listed here and is not used as schema sameAs.
   */
  social: [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/buzzcraftza/",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/buzzcraftza/",
    },
    {
      id: "x",
      label: "X",
      href: "https://x.com/BuzzCraftZa",
    },
  ],

  blueprintUrl: "https://local-website-blueprint.vercel.app",
  privacyPath: "/privacy",
  privacyPolicyVersion: "2026-11-16",
} as const;

export type SocialId = (typeof siteConfig.social)[number]["id"];

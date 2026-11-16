export type BillingMode = "once" | "monthly";

export type PackageOffer = {
  id: "starter" | "growth" | "authority";
  name: string;
  promise: string;
  onceOff: number;
  monthly: number;
  /** Rand saving on an annual plan. Null means the owner has not confirmed the figure. */
  annualSaving: number | null;
  includes: string[];
};

export const packages: PackageOffer[] = [
  {
    id: "starter",
    name: "Starter Site",
    promise: "Get found online",
    onceOff: 3000,
    monthly: 300,
    annualSaving: 600,
    includes: [
      "Up to 4 core pages",
      "Mobile-first website",
      "SEO-ready foundation",
      "Google Business Profile link",
      "WhatsApp enquiry button",
      "Hosting and SSL included",
    ],
  },
  {
    id: "growth",
    name: "Growth Website",
    promise: "Turn visits into leads",
    onceOff: 6500,
    monthly: 650,
    annualSaving: 1300,
    includes: [
      "Up to 8 pages",
      "Conversion-first design",
      "Local SEO setup",
      "AI-ready page structure",
      "Lead form and WhatsApp flow",
      "Analytics setup",
      "Monthly support",
    ],
  },
  {
    id: "authority",
    name: "Authority + Automation",
    promise: "Build a lead system",
    onceOff: 12000,
    monthly: 1200,
    annualSaving: null,
    includes: [
      "Up to 15 pages plus a landing page",
      "Advanced SEO, AEO and GEO",
      "Google Business Profile optimisation",
      "WhatsApp follow-up automation",
      "Quote or booking flow",
      "Reporting dashboard",
      "Priority support",
    ],
  },
];

export const sprintOffer = {
  name: "Visibility and Lead Recovery Sprint",
  price: 18500,
  deposit: "50% deposit to book",
  workingDays: 10,
  href: "/sprint/",
};

export function packageAmount(offer: PackageOffer, mode: BillingMode): number {
  return mode === "once" ? offer.onceOff : offer.monthly;
}

export function billingLabel(mode: BillingMode): string {
  return mode === "once" ? "once-off" : "a month";
}

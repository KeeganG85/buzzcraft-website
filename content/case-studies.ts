/**
 * Wording copied from the public BuzzCraft work page.
 * Nativ Genetix Soweto and CZApay only. Nothing added.
 * Studio can add further studies later.
 */
export type CaseStudy = {
  slug: string;
  name: string;
  href: string;
  category: string;
  location: string;
  label?: string;
  situation: string;
  built: string[];
  changed: string;
  pillar: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "nativ-genetix-soweto",
    name: "Nativ Genetix Soweto",
    href: "https://www.nativgenetixsoweto.co.za/",
    category: "Cannabis wellness retail",
    location: "Soweto, Johannesburg",
    situation:
      "A neighbourhood wellness dispensary with a strong local reputation, a growing product range and no coherent digital storefront. Placeholder products in the catalogue, DNS issues keeping the domain unstable, and no content engine for local search.",
    built: [
      "Full e-commerce product architecture across 30+ SKUs and multiple categories",
      "CMS and featured-image workflows for The Chronicle, the brand's blog engine",
      "A distinctive, brand-true product photography system rooted in Soweto visual references",
      "DNS and database-layer fixes to stabilise the store's foundations",
      "A social media strategy dashboard for planning and publishing",
    ],
    changed:
      "The brand moved from an unstable placeholder store to a coherent, locally rooted digital storefront with a working content and publishing rhythm, owned in-house.",
    pillar: "Visibility & Content Systems",
  },
  {
    slug: "czapay",
    name: "CZApay",
    href: "https://www.czapay.com/",
    category: "Earned wage access fintech",
    location: "South Africa",
    label: "Brand and landing work, pre-launch",
    situation:
      "An earned-pay-access platform in a category most South African employers had not heard of, needing a brand system and a landing experience that could explain the model quickly and capture qualified interest.",
    built: [
      "A complete brand system: palette, typography and usage rules in a working style guide",
      "A conversion-led landing experience that explains earned wage access in plain language",
      "Message architecture built for both employers and employees",
      "Terminology governance to keep the brand clear of credit and loan language",
    ],
    changed:
      "The platform gained a consistent, credible brand presence and a landing experience that makes a new financial category understandable in one scroll.",
    pillar: "Strategy & Growth Direction",
  },
];

export type ServicePage = {
  slug: "websites" | "search-visibility" | "lead-systems";
  href: string;
  nav: string;
  title: string;
  description: string;
  eyebrow: string;
  lede: string;
  includes: string[];
  note: string;
};

export const services: ServicePage[] = [
  {
    slug: "websites",
    href: "/services/websites/",
    nav: "Websites",
    title: "Websites that ask for the next step",
    description:
      "Mobile-first websites and landing pages for South African service businesses, with one obvious enquiry path.",
    eyebrow: "Websites",
    lede: "A website earns its keep when a visitor on a phone can tell what you do and how to reach you. We design and build that path: fast pages, plain language, and one next step instead of a menu of dead ends.",
    includes: [
      "Conversion-focused websites and landing pages",
      "Mobile-first layout",
      "One obvious next step, usually WhatsApp",
      "Pages structured so a person can skim them",
    ],
    note: "The Sprint can ship one conversion landing page inside 10 working days. A fuller site is scoped as a package or a bespoke build.",
  },
  {
    slug: "search-visibility",
    href: "/services/search-visibility/",
    nav: "Search visibility",
    title: "Search, local search, and answer engines",
    description:
      "SEO, local SEO, Google Business Profile, and the structure that helps AI assistants describe a business accurately.",
    eyebrow: "Search visibility",
    lede: "Buyers still type into Google, some search the map, and a growing number ask an AI assistant. A business tuned for only one of those is invisible to the other two. We work on SEO, local SEO, and the answer-engine structure that makes the business legible.",
    includes: [
      "Technical and on-page SEO",
      "Local SEO and Google Business Profile optimisation",
      "Answer engine optimisation (AEO) and generative engine optimisation (GEO)",
      "Answer-first content a team can maintain",
    ],
    note: "We do not guarantee rankings or AI citations. We guarantee defined deliverables, built on Google's published guidance, with a measured baseline.",
  },
  {
    slug: "lead-systems",
    href: "/services/lead-systems/",
    nav: "Lead systems",
    title: "Lead systems that follow through",
    description:
      "WhatsApp enquiry paths, follow-up and the automation that stops a lead dying in a quiet inbox.",
    eyebrow: "Lead systems",
    lede: "Traffic you already earn is the cheapest growth you will buy. If enquiries arrive and then leak, through a slow reply, a dead-end page, or a quote that lives in someone's head, fixing the path usually beats buying more visitors.",
    includes: [
      "WhatsApp-led enquiry and booking journeys",
      "Lead qualification and follow-up",
      "Quoting and lead-response workflows",
      "Analytics and an honest read of what happened",
    ],
    note: "The Sprint sets up a WhatsApp lead flow and tests it. Ongoing automation sits in the Authority + Automation package, or in a scoped engagement.",
  },
];

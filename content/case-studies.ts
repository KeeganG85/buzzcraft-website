/**
 * Public case studies Keegan named.
 * Public copy uses only what those live sites show, with no results, metrics, quotes or numbers.
 * Studio can add further studies later.
 */
export type CaseStudy = {
  slug: string;
  name: string;
  href: string;
  location: string;
  summary: string;
  observed: string[];
  sourceNote: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "nativ-genetix-soweto",
    name: "Nativ Genetix Soweto",
    href: "https://www.nativgenetixsoweto.co.za/",
    location: "Jabavu, Soweto",
    summary:
      "The public site describes curated, patient-first medical cannabis access from Jabavu, Soweto: a showroom of approved products, a patient-verification path, and The Chronicle.",
    observed: [
      "The homepage says patient verification is required.",
      "Product requests are described as a private WhatsApp conversation with the Nativ team.",
      "The Chronicle publishes Soweto-rooted education, including a piece on why Kadebe Street matters to the story.",
    ],
    sourceNote: "Taken from the public website. No results or metrics are stated here.",
  },
  {
    slug: "czapay",
    name: "CZApay",
    href: "https://www.czapay.com/",
    location: "South Africa",
    summary:
      "The public site describes CZApay as South Africa's Everyday Pay platform: access to part of an earned salary before payday, framed as control over money already earned.",
    observed: [
      "The site presents the business as an Everyday Pay platform.",
      "It describes access to earned salary before payday, and greater control over money already earned.",
      "The enquiry form asks for a South African mobile number and consent before a message is sent.",
    ],
    sourceNote: "Taken from the public website. No results or metrics are stated here.",
  },
];

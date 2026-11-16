/**
 * Public case studies Keegan approved.
 * Copy is limited to what those live sites stated on 16 November 2026.
 * No delivery metrics are invented. Studio can add further studies later.
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
      "The homepage says access is 18+ and that patient verification is required.",
      "Product requests are described as a private WhatsApp conversation with the Nativ team.",
      "The Chronicle publishes Soweto-rooted education, including a piece on why Kadebe Street matters to the story.",
    ],
    sourceNote:
      "Checked https://www.nativgenetixsoweto.co.za/ on 16 November 2026. The apex hostname did not resolve from this environment. The site HTML did not include a BuzzCraft credit or performance figures.",
  },
  {
    slug: "czapay",
    name: "CZApay",
    href: "https://www.czapay.com/",
    location: "South Africa",
    summary:
      "The public site describes CZApay as South Africa's Everyday Pay platform: access to part of an earned salary before payday, framed as control over money already earned.",
    observed: [
      "The page title is \"CZApay | Your money. When you've earned it.\"",
      "The description calls it an Everyday Pay platform and says access should be quick, secure and responsible.",
      "The enquiry form on the site asks for a South African mobile number and consent before a message is sent.",
    ],
    sourceNote:
      "Checked https://www.czapay.com/ on 16 November 2026. The apex https://czapay.com/ did not complete a TLS handshake from this environment. No performance figures were published in the HTML we could read.",
  },
];

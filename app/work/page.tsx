import { Section, SectionHeading, Eyebrow, Faq } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { BookingLink } from "@/components/marketing/BookingLink";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Work — Growth Systems Built for South African Brands",
  description:
    "Selected BuzzCraft work: e-commerce and content systems, fintech brand and conversion builds, and aesthetics-sector tooling. Real systems, defensible claims, no invented numbers.",
  path: "/work",
});

/**
 * Case studies describe real delivered work in qualitative terms only.
 * TODO_VERIFY: obtain written client approval to name each brand publicly, and
 * add approved outcome metrics + screenshots only once signed off.
 */
const caseStudies = [
  {
    sector: "Cannabis wellness retail — Soweto, Johannesburg",
    client: "Nativ Genetix Soweto", // TODO_VERIFY client approval to publish name
    situation:
      "A neighbourhood wellness dispensary with a strong local reputation, a growing product range and no coherent digital storefront: placeholder products in the catalogue, DNS issues keeping the domain unstable and no content engine for local search.",
    system: [
      "Full e-commerce product architecture across 30+ SKUs and multiple categories",
      "CMS and featured-image workflows for The Chronicle, the brand's blog engine",
      "A distinctive, brand-true product photography system rooted in Soweto visual references",
      "DNS and database-layer fixes to stabilise the store's foundations",
      "A social media strategy dashboard for planning and publishing",
    ],
    changed:
      "The brand moved from an unstable placeholder store to a coherent, locally rooted digital storefront with a working content and publishing rhythm, owned in-house.",
    related: { label: "Visibility and Content Systems", href: "/services#visibility" },
  },
  {
    sector: "Fintech — earned wage access, South Africa",
    client: "CZApay", // TODO_VERIFY client approval to publish name
    situation:
      "An earned-pay-access platform in a category most South African employers hadn't heard of, needing a brand system and a landing experience that could explain the model quickly and capture qualified interest.",
    system: [
      "A complete brand system: palette, typography and usage rules in a working style guide",
      "A conversion-led landing page that explains earned wage access in plain language",
      "Message architecture built for both employers and employees",
    ],
    changed:
      "The platform gained a consistent, credible brand presence and a landing experience that makes a new financial category understandable in one scroll.",
    related: { label: "Conversion Systems and Automation", href: "/services#conversion" },
  },
  {
    sector: "Aesthetics and skincare — London, UK",
    client: "SKNN CARE LNDN", // TODO_VERIFY client approval to publish name
    situation:
      "A London aesthetics brand needing premium, consistent visual assets and a compliant way to show prospective clients realistic treatment previews without risking personal data.",
    system: [
      "A complete interactive brand style guide with embedded, dependency-free assets",
      "Custom image-composition tooling for consistent campaign visuals",
      "A GDPR-conscious treatment preview studio design with strict cost controls",
    ],
    changed:
      "The brand's visual output became consistent and repeatable, and treatment previews moved from ad-hoc edits to a governed, privacy-aware workflow.",
    related: { label: "Strategy and Growth Direction", href: "/services#strategy" },
  },
  {
    sector: "SaaS — invoicing, South Africa",
    client: "QuickBill", // TODO_VERIFY client approval to publish name
    situation:
      "A South African invoicing platform preparing to talk to two very different audiences at once: customers who need clarity and investors who need conviction.",
    system: [
      "A comprehensive marketing strategy package",
      "A client-facing strategy document built for operational use",
      "An investor-facing presentation deck aligned to the same strategic core",
    ],
    changed:
      "One coherent strategic story now serves both the growth team and the investor conversation, instead of two decks quietly contradicting each other.",
    related: { label: "Strategy and Growth Direction", href: "/services#strategy" },
  },
];

const workFaq = [
  {
    question: "Why don't you show revenue numbers on this page?",
    answer:
      "Because we only publish outcomes clients have approved and we can defend. Where results are commercially sensitive or unverified, we describe the problem solved and the system delivered instead of inventing a percentage.",
  },
  {
    question: "Can we speak to a past client?",
    answer:
      "Where a client has agreed to references, yes. Ask on WhatsApp or in a booked call and we'll connect you where appropriate.",
  },
];

export default function WorkPage() {
  return (
    <>
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Work</Eyebrow>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Systems we've built, told straight.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mid">
            Real engagements across e-commerce, fintech, aesthetics and SaaS. Every claim below is
            defensible; where numbers are sensitive or unapproved, we show you the problem and the
            system instead of a made-up metric.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <BookingLink />
            <WhatsAppLink context="work" variant="secondary">
              WhatsApp about a similar project
            </WhatsAppLink>
          </div>
        </div>
      </Section>

      {caseStudies.map((cs, i) => (
        <section key={cs.client} className={`py-section ${i % 2 === 0 ? "bg-surface" : ""}`}>
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <article className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{cs.sector}</p>
                <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{cs.client}</h2>
                <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-mid">Situation</h3>
                <p className="mt-2 leading-relaxed text-mid">{cs.situation}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-mid">System built</h3>
                  <ul className="mt-3 space-y-2.5">
                    {cs.system.map((s) => (
                      <li key={s} className="flex gap-2.5 text-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-mid">What changed</h3>
                  <p className="mt-2 leading-relaxed text-mid">{cs.changed}</p>
                </div>
                <Link
                  href={cs.related.href}
                  className="inline-flex min-h-12 items-center gap-1.5 font-semibold text-gold hover:text-gold-soft"
                >
                  Related service: {cs.related.label} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </section>
      ))}

      <Section>
        <SectionHeading eyebrow="Questions" title="About this page" />
        <Faq items={workFaq} />
      </Section>

      <ContactFold context="work" heading="Have a similar problem?" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
            ]),
          ),
        }}
      />
    </>
  );
}

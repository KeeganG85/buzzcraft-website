import { Section, Eyebrow } from "@/components/ui/primitives";
import { ScorecardForm } from "@/components/marketing/ScorecardForm";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Search Visibility Scorecard — Free, Scored out of 100",
  description:
    "Find out where your business is losing visibility and leads. A free, practical review of your search, local and AI-assistant visibility plus conversion readiness, delivered within 48 hours.",
  path: "/scorecard",
});

const whatYouGet = [
  {
    title: "Your visibility score out of 100",
    copy: "Across Google search, local search and how legible your business is to AI assistants.",
  },
  {
    title: "Your three biggest leaks",
    copy: "The specific places where attention you've already earned fails to become an enquiry.",
  },
  {
    title: "Clear next steps",
    copy: "What to fix first, in plain language, whether you fix it with us or without us.",
  },
];

export default function ScorecardPage() {
  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow>Search Visibility Scorecard</Eyebrow>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Find out where you&apos;re losing visibility and leads.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-mid">
              A practical, human-reviewed score of how findable and convertible your business is
              right now. Free, scored out of <span className="tnum">100</span>, delivered within{" "}
              <span className="tnum">48</span> hours. No sales ambush attached.
            </p>

            <ul className="mt-8 space-y-5">
              {whatYouGet.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <div>
                    <h2 className="font-bold text-soft">{item.title}</h2>
                    <p className="mt-1 leading-relaxed text-mid">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-l-2 border-gold pl-4 text-sm leading-relaxed text-mid">
              Prefer to just chat first? No problem.{" "}
              <span className="block pt-3">
                <WhatsAppLink context="scorecard" variant="ghost">
                  WhatsApp us instead <span aria-hidden="true">→</span>
                </WhatsAppLink>
              </span>
            </p>
          </div>

          <div className="rounded-lg border border-line bg-surface p-7 sm:p-8">
            <h2 className="text-xl font-bold">Request your Scorecard</h2>
            <p className="mb-6 mt-2 text-sm text-mid">
              Five quick fields. We review your site manually, no automated PDF spam.
            </p>
            <ScorecardForm />
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Search Visibility Scorecard", path: "/scorecard" },
            ]),
          ),
        }}
      />
    </>
  );
}

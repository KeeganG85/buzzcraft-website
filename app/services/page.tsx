import { Section, SectionHeading, Eyebrow, LinkButton, Faq, Container } from "@/components/ui/primitives";
import { InfoCard } from "@/components/marketing/cards";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { serviceJsonLd, faqPageJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Growth Services: Strategy, Visibility and Conversion",
  description:
    "BuzzCraft's three service pillars for South African SMEs: Strategy and Growth Direction, Visibility and Content Systems, and Conversion Systems and Automation. Start with the Sprint.",
  path: "/services",
});

const pillars = [
  {
    id: "strategy",
    index: "01",
    name: "Strategy and Growth Direction",
    statement: "Clear direction before expensive activity.",
    copy:
      "Every rand you spend on marketing multiplies whatever direction you point it at, including the wrong one. This pillar makes sure the direction is right first.",
    activities: [
      "Positioning and offer clarity",
      "Audience and ideal-client insight",
      "Go-to-market planning",
      "Growth roadmaps and practical prioritisation",
      "Pricing and packaging logic",
    ],
    bestFor:
      "Best for founders and operators who are busy but unsure which activity actually deserves the budget, or whose offer has evolved past their messaging.",
  },
  {
    id: "visibility",
    index: "02",
    name: "Visibility and Content Systems",
    statement: "Be findable where your buyers actually look.",
    copy:
      "Search, local search, AI assistants and social feeds are where South African buying decisions start. We build durable visibility across all of them, not a spike that dies when the ad budget does.",
    activities: [
      "Technical and on-page SEO",
      "Local search and Google Business Profile optimisation",
      "Generative engine optimisation (GEO) and answer engine optimisation (AEO)",
      "Authority content and content systems",
      "Social content systems and campaign creative",
    ],
    bestFor:
      "Best for businesses that are good at what they do but invisible when someone searches for it, or reliant on referrals alone.",
  },
  {
    id: "conversion",
    index: "03",
    name: "Conversion Systems and Automation",
    statement: "Turn the attention you already earn into revenue.",
    copy:
      "Traffic you paid for that goes nowhere is the most expensive kind. This pillar builds everything between the click and the payment, and makes it repeatable.",
    activities: [
      "Websites, landing pages and funnels",
      "Lead qualification design",
      "WhatsApp journeys and response systems",
      "Analytics, measurement and reporting",
      "Practical automation that removes bottlenecks",
    ],
    bestFor:
      "Best for businesses getting enquiries that leak: slow follow-ups, chats that go quiet, or a website that looks fine but doesn't sell.",
  },
];

const servicesFaq = [
  {
    question: "Which pillar should we start with?",
    answer:
      "Usually none of them directly. If direction, positioning or priorities are unclear, start with the BuzzCraft Sprint: it diagnoses which pillar will move revenue first, so implementation budget lands where it counts.",
  },
  {
    question: "Do you publish package prices?",
    answer:
      "We publish approved pricing where it's fixed, such as the Sprint deposit. Implementation and retainer work is scoped to your situation, because a pre-packaged price for unscoped work is a guess dressed as a discount.",
  },
  {
    question: "Do you do events and activations?",
    answer:
      "Selectively, as a campaign capability when it's strategically useful, not as a core service. If an activation is genuinely the right move for your growth system, we'll say so; if it's an expensive party, we'll say that too.",
  },
  {
    question: "Can you work alongside our internal team?",
    answer:
      "Yes. Many engagements strengthen an internal team rather than replace it: we set the strategy and systems, your team runs the day-to-day, and we review performance together.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Services</Eyebrow>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Three pillars. One connected growth system.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mid">
            We don't sell channels. We build the connections between strategy, visibility and
            conversion, because that's where compounding growth actually lives.
          </p>
          <div className="mt-8">
            <WhatsAppLink context="services" variant="primary">
              WhatsApp BuzzCraft
            </WhatsAppLink>
          </div>
        </div>
      </Section>

      {/* Pillars in depth */}
      {pillars.map((pillar, i) => (
        <section key={pillar.id} id={pillar.id} className={`py-section ${i % 2 === 0 ? "bg-surface" : ""}`}>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="tnum mb-4 text-sm font-bold text-gold" aria-hidden="true">
                  {pillar.index}
                </p>
                <h2 className="text-3xl font-bold leading-tight tracking-tight">{pillar.name}</h2>
                <p className="mt-3 text-xl font-semibold text-gold">{pillar.statement}</p>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-mid">{pillar.copy}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    Representative work
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {pillar.activities.map((a) => (
                      <li key={a} className="flex gap-2.5 text-soft">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="border-l-2 border-gold pl-4 leading-relaxed text-mid">{pillar.bestFor}</p>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Engagement logic */}
      <Section id="engagement">
        <SectionHeading
          eyebrow="How engagements work"
          title="Sprint first. Then build what the diagnosis demands."
          lede="A deliberately simple engagement path, so you always know what you're buying and why."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <InfoCard title="1. Start with the Sprint" accent>
            When direction, positioning or priorities are unclear, the Sprint produces a diagnosis
            and prioritised roadmap in {siteConfig.sprint.durationBusinessDays} business days. Fixed
            scope, no open-ended discovery bill.
          </InfoCard>
          <InfoCard title="2. Scoped implementation">
            Where the roadmap calls for building, we scope it precisely: a landing page, a local SEO
            programme, a WhatsApp journey. You approve the scope and price before anything starts.
          </InfoCard>
          <InfoCard title="3. Retained growth work">
            Where there's a genuine operational fit, we run the growth system with you month to
            month: execution, reporting and strategic reviews on one rhythm.
          </InfoCard>
        </div>
        <p className="mt-8 max-w-2xl text-mid">
          Campaigns, activations and specialist work are available when strategically useful, always
          in service of the three pillars, never as a substitute for them.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <LinkButton href="/sprint" variant="primary">
            Explore the Sprint
          </LinkButton>
          <LinkButton href="/scorecard" variant="secondary">
            Get My Scorecard
          </LinkButton>
        </div>
      </Section>

      <Section id="faq" tone="raised">
        <SectionHeading eyebrow="Questions" title="Services, plainly answered" />
        <Faq items={servicesFaq} />
      </Section>

      <ContactFold context="services" />

      {pillars.map((p) => (
        <script
          key={p.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              serviceJsonLd({ name: p.name, description: p.copy, path: `/services#${p.id}` }),
            ),
          }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageJsonLd(servicesFaq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
      />
    </>
  );
}

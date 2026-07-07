import Link from "next/link";
import Image from "next/image";
import { HeroSystem } from "@/components/marketing/HeroSystem";
import { PillarCard, BlueprintTimeline, InfoCard } from "@/components/marketing/cards";
import { ToolCard } from "@/components/marketing/ToolCard";
import { ContactFold } from "@/components/layout/ContactFold";
import { Section, SectionHeading, Eyebrow, LinkButton, Faq } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { faqPageJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "BuzzCraft — Johannesburg Growth Systems Agency",
  description:
    "We build growth systems, not marketing noise. BuzzCraft connects strategy, visibility and conversion for ambitious South African SMEs. Get your free Search Visibility Scorecard.",
  path: "/",
});

const pillars = [
  {
    index: "01",
    title: "Strategy and Growth Direction",
    copy: "Clear direction before expensive activity. We define who you serve, why you win and what to do first.",
    items: ["Positioning and offer clarity", "Audience insight", "Go-to-market planning", "Practical growth roadmaps"],
    href: "/services#strategy",
  },
  {
    index: "02",
    title: "Visibility and Content Systems",
    copy: "Durable visibility where your buyers actually look: search, local search, AI assistants and social.",
    items: ["SEO and local search", "GEO and AEO", "Authority content", "Social content systems"],
    href: "/services#visibility",
  },
  {
    index: "03",
    title: "Conversion Systems and Automation",
    copy: "Everything between the click and the payment, built to work the same way every time.",
    items: ["Websites and landing pages", "Lead qualification", "WhatsApp journeys", "Analytics and automation"],
    href: "/services#conversion",
  },
];

const blueprint = [
  { title: "ICP definition", copy: "Pin down exactly who your ideal client is, so every rand of effort points at people who can actually buy." },
  { title: "Lead qualification", copy: "Design the questions and signals that separate serious buyers from tyre-kickers before they cost you time." },
  { title: "Client onboarding", copy: "Turn a yes into momentum with a repeatable onboarding path that sets expectations and gathers what delivery needs." },
  { title: "Strategy execution", copy: "Ship the prioritised work: visibility, content and conversion assets, in the order that moves revenue first." },
  { title: "Project management", copy: "One operating rhythm, clear owners and visible progress, so nothing lives in someone's head or a lost voice note." },
  { title: "Performance reporting", copy: "One honest set of numbers, reviewed on the same day every month. No vanity metrics." },
  { title: "Strategic reviews", copy: "Regular checkpoints that redirect budget from what's stalling to what's compounding." },
];

const homeFaq = [
  {
    question: "What exactly is the Search Visibility Scorecard?",
    answer:
      "A practical review of how visible your business is where buyers look: Google search, local search, AI assistants and your own website's conversion readiness. You get a score out of 100 and clear next steps, free, within 48 hours.",
  },
  {
    question: "What does a growth system cost?",
    answer:
      "It depends on the scope, which is exactly why we start with the Sprint: a fixed-scope engagement that produces a diagnosis and prioritised roadmap before you commit to bigger implementation work. Approved pricing is shared on the Sprint page and in conversation; we don't do mystery 'from' figures.",
  },
  {
    question: "Do you only work with Johannesburg businesses?",
    answer:
      "We're based in Johannesburg and know the Gauteng market well, but we work with ambitious businesses across South Africa. Most of our collaboration happens over WhatsApp, video calls and shared workspaces anyway.",
  },
  {
    question: "We already have a marketing person or agency. Can you still help?",
    answer:
      "Often, yes. A growth system makes existing marketing work harder by connecting it: clearer strategy, better landing pages, tighter lead follow-up. The Sprint is a low-risk way to find out whether the gap is direction, visibility or conversion.",
  },
  {
    question: "How is BuzzCraft different from a normal digital marketing agency?",
    answer:
      "We don't sell channels; we build the connections between them. Instead of 'more posts' or 'more ads', we start from strategy, make you visible where your buyers actually look, and fix the conversion path so the traffic you already earn turns into revenue.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── 1. Scroll-linked hero ──────────────────────────────────────── */}
      <HeroSystem>
        <div className="max-w-2xl">
          <Eyebrow>Johannesburg Growth Systems Agency</Eyebrow>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            We build growth systems, not marketing noise.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mid">
            BuzzCraft connects strategy, visibility and conversion so ambitious businesses stop
            guessing and start building measurable momentum.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <LinkButton href="/scorecard" variant="primary">
              Get My Scorecard
            </LinkButton>
            <LinkButton href="/#method" variant="secondary">
              See How We Work
            </LinkButton>
          </div>
          <p className="mt-4 text-sm text-mid">A practical visibility score and clear next steps.</p>

          {/* Phase 55–80% affirmation line */}
          <p className="hero-affirm mt-10 hidden text-base font-semibold text-gold md:block" aria-hidden="true">
            Strategy, visibility and conversion — working as one system.
          </p>
        </div>
      </HeroSystem>

      {/* ── 2. Problem / reframe ───────────────────────────────────────── */}
      <Section id="reframe">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Activity is not a system.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-mid">
            <p>
              Most businesses aren't short of marketing. There's a website, some posts, the odd
              boosted ad, a WhatsApp number that rings. Each piece exists. None of them talk to each
              other, and the budget quietly leaks out of the gaps in between.
            </p>
            <p>
              Disconnected tactics feel busy and stay expensive. A connected system compounds: the
              strategy sharpens the content, the content earns the visibility, the visibility feeds
              a conversion path that works the same way every time. That's what we build.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 3. Three growth system pillars ─────────────────────────────── */}
      <Section id="pillars" tone="raised">
        <SectionHeading
          eyebrow="What we build"
          title="Three pillars. One connected system."
          lede="Every engagement strengthens one or more of these, and the connections between them are where the growth lives."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <PillarCard key={p.index} {...p} />
          ))}
        </div>
      </Section>

      {/* ── 4. The BuzzCraft Blueprint ─────────────────────────────────── */}
      <Section id="method">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="How we work"
              title="The BuzzCraft Blueprint"
              lede="Seven steps that run as an operating sequence, not a slide in a pitch deck. This is how work moves from idea to measurable result."
            />
            <div className="relative mx-auto hidden aspect-[2/3] max-w-xs overflow-hidden rounded-lg border border-line lg:block">
              <Image
                src="/brand/buzz-editorial.webp"
                alt="Buzz, the BuzzCraft mascot, in a tailored suit adjusting his glasses"
                fill
                sizes="(min-width: 1024px) 320px, 0px"
                className="object-cover"
              />
            </div>
          </div>
          <BlueprintTimeline steps={blueprint} />
        </div>
      </Section>

      {/* ── 5. The Sprint ──────────────────────────────────────────────── */}
      <Section id="sprint-teaser" tone="raised">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="The cleanest place to start"
              title="The BuzzCraft Sprint"
              lede={`A fixed-scope, ${siteConfig.sprint.durationBusinessDays}-business-day engagement that diagnoses your visibility and conversion, then hands you a prioritised roadmap. Direction first. Expensive activity second.`}
            />
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton href="/sprint" variant="primary">
                Explore the Sprint
              </LinkButton>
              <LinkButton href="/scorecard" variant="secondary">
                Start with the free Scorecard
              </LinkButton>
            </div>
          </div>
          <InfoCard title="What you walk away with" accent>
            <ul className="space-y-2.5">
              {[
                "A practical growth direction",
                "A search and visibility diagnosis",
                "Your top conversion priorities",
                "A prioritised roadmap",
                "A clear implementation recommendation",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-soft">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </Section>

      {/* ── 6. Proof ───────────────────────────────────────────────────── */}
      <Section id="proof">
        <SectionHeading
          eyebrow="Proof"
          title="Systems we've built"
          lede="Real work for real South African and UK-facing brands: e-commerce, fintech, wellness and professional services. No invented numbers, no borrowed logos."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <InfoCard title="Wellness e-commerce, Soweto">
            A full digital storefront and content system: product architecture, CMS workflows,
            brand-true product imagery and a blog engine built for local search.
          </InfoCard>
          <InfoCard title="Earned-pay fintech">
            Brand system and conversion-led landing page for a South African earned wage access
            platform, built to explain a new category clearly and capture qualified interest.
          </InfoCard>
        </div>
        <div className="mt-8">
          <LinkButton href="/work" variant="ghost">
            See the work <span aria-hidden="true">→</span>
          </LinkButton>
        </div>
      </Section>

      {/* ── 7. Free tools strip ────────────────────────────────────────── */}
      <Section id="tools-strip" tone="raised">
        <SectionHeading
          eyebrow="Free tools"
          title="Free tools we actually use"
          lede="We build practical tools for our own work and our clients' growth. Use them free. If they help, imagine what the paid work does."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <ToolCard
            name="Local Website Blueprint Builder"
            copy="Answer a few questions about your business and get a practical website blueprint built for local search and conversion."
            cta="Build My Blueprint"
            href={siteConfig.tools.blueprintBuilderUrl}
            external
          />
          <ToolCard
            name="BuzzCraft Prompt OS"
            copy="A working library of AI prompts we use for marketing, content and client delivery. Steal them."
            cta="Open the Library"
            href={siteConfig.tools.promptOsUrl}
            external
          />
          <ToolCard
            name="Search Visibility Scorecard"
            copy="Find out where you're losing visibility and leads, scored out of 100, free in 48 hours."
            cta="Get My Scorecard"
            href={siteConfig.tools.scorecardPath}
            external={false}
          />
        </div>
      </Section>

      {/* ── 8. FAQ ─────────────────────────────────────────────────────── */}
      <Section id="faq">
        <SectionHeading eyebrow="Questions" title="Straight answers" />
        <Faq items={homeFaq} />
      </Section>

      {/* ── 9. WhatsApp-first contact fold ─────────────────────────────── */}
      <ContactFold context="default" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageJsonLd(homeFaq)) }}
      />
    </>
  );
}

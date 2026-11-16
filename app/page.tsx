import Link from "next/link";
import { Mascot } from "@/components/brand/Mascot";
import { ClearPathStory } from "@/components/marketing/ClearPathStory";
import { FaqList } from "@/components/marketing/FaqList";
import { PriceCards } from "@/components/marketing/PriceCards";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { caseStudies } from "@/content/case-studies";
import { sprintOffer } from "@/content/pricing";
import { services } from "@/content/services";
import { formatZar } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "BuzzCraft: growth systems agency, Johannesburg",
  description:
    "BuzzCraft builds search-visible, AI-ready websites and lead systems for South African businesses. Based in Johannesburg.",
  path: "/",
});

const faqs = [
  {
    question: "What exactly does BuzzCraft do?",
    answer:
      "BuzzCraft is a Johannesburg growth systems agency. We build search-visible, AI-ready websites and lead systems for South African businesses: SEO and local search, AI answer visibility, conversion-focused websites, WhatsApp lead journeys and the automation that connects them.",
  },
  {
    question: "What is the Search Visibility Scorecard?",
    answer:
      "A free 15-point review of how visible your business is where buyers actually look: Google search, local search, AI assistants and your own website's conversion readiness. You get clear findings and next steps within 48 hours, with POPIA-compliant consent and no spam.",
  },
  {
    question: "What does working with BuzzCraft cost?",
    answer: `Website packages start from ${formatZar(3000)} once-off or ${formatZar(300)} a month. The Visibility and Lead Recovery Sprint stays available at ${formatZar(sprintOffer.price)}, with a 50% deposit and 10 working days. Prices are from figures. VAT, contract length and cancellation are awaiting owner confirmation.`,
  },
  {
    question: "Do you guarantee rankings or AI citations?",
    answer:
      "No, and you should be suspicious of anyone who does. We guarantee the defined deliverables, built on Google's published best practice, with a measured baseline so progress is visible.",
  },
  {
    question: "Do you only work with Johannesburg businesses?",
    answer:
      "We're based in Johannesburg and know the Gauteng market well, and we work with ambitious businesses across South Africa. Most collaboration happens over WhatsApp and video calls.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="eyebrow">Johannesburg</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Built to be found, trusted and chosen.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mid">
              BuzzCraft builds search-visible, AI-ready websites and lead systems for South African
              businesses. We connect strategy, visibility and conversion into one system, so when a
              customer searches on Google, asks an AI assistant or opens WhatsApp, your business is
              the one that shows up and follows through.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppLink className={buttonClass("primary")}>WhatsApp a person</WhatsAppLink>
              <Link href="/scorecard/" className={buttonClass("secondary")}>
                Get my free Scorecard
              </Link>
            </div>
            <p className="mt-4 text-sm text-mid">15-point visibility check. Free. Delivered in 48 hours.</p>
          </div>
          <div className="mascot-settle mx-auto w-full max-w-sm">
            <Mascot pose="welcome" priority />
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20" aria-labelledby="pillars-title">
        <Container>
          <p className="eyebrow">What we build</p>
          <h2 id="pillars-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            Three pillars. One connected system.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            Websites, search visibility and lead systems. The growth sits in the connections between
            them, not in a pile of disconnected posts.
          </p>
          <ol className="mt-12 divide-y divide-white/10">
            {services.map((service, index) => (
              <li key={service.slug} className="grid gap-4 py-8 md:grid-cols-[6rem_1fr_auto] md:items-end">
                <p className="tnum text-3xl text-gold">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-semibold">{service.nav}</h3>
                  <p className="mt-2 max-w-xl leading-7 text-mid">{service.lede}</p>
                </div>
                <Link href={service.href} className="min-h-11 text-sm font-semibold text-gold">
                  Explore {service.nav}
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ClearPathStory />

      <section className="py-20" aria-labelledby="proof-title">
        <Container>
          <p className="eyebrow">Proof</p>
          <h2 id="proof-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            Two businesses you can open yourself.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            No invented percentages. These notes say only what the public sites stated when we read
            them. A fuller write-up can be added in Studio when Keegan wants it published.
          </p>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {caseStudies.map((study) => (
              <article key={study.slug}>
                <p className="text-sm text-mid">{study.location}</p>
                <h3 className="mt-2 text-2xl font-semibold">{study.name}</h3>
                <p className="mt-3 leading-7 text-mid">{study.summary}</p>
                <a href={study.href} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-gold">
                  Visit the live site
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-surface py-20" aria-labelledby="tools-title">
        <Container>
          <p className="eyebrow">Tools</p>
          <h2 id="tools-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight">
            Two prompt libraries, and they are not the same product.
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <article>
              <h3 className="text-xl font-semibold">FOUND</h3>
              <p className="mt-3 leading-7 text-mid">
                An open library of 35 prompts for South African owner-run service businesses. No email
                gate.
              </p>
              <Link href="/found/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold">
                Open the FOUND library
              </Link>
            </article>
            <article>
              <h3 className="text-xl font-semibold">The 120 Prompt OS</h3>
              <p className="mt-3 leading-7 text-mid">
                Titles and purposes are public. Registration unlocks the full prompt bodies. They stay
                on the server.
              </p>
              <Link href="/120promptos/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold">
                See the 120 Prompt OS
              </Link>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-20" aria-labelledby="pricing-title">
        <Container>
          <p className="eyebrow">Packages</p>
          <h2 id="pricing-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            From prices, side by side with the Sprint.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            All package figures are from. VAT, contract length and cancellation are awaiting owner
            confirmation. No card is marked recommended.
          </p>
          <div className="mt-12">
            <PriceCards />
          </div>
          <p className="mt-10 max-w-2xl leading-7 text-mid">
            The {sprintOffer.name} remains a separate offer at {formatZar(sprintOffer.price)},{" "}
            {sprintOffer.deposit.toLowerCase()}, over {sprintOffer.workingDays} working days.
          </p>
        </Container>
      </section>

      <section className="bg-ink py-20" aria-labelledby="faq-title">
        <Container>
          <h2 id="faq-title" className="text-3xl font-semibold tracking-tight">
            Straight answers.
          </h2>
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid items-center gap-10 md:grid-cols-[1fr_16rem]">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
              Talk to a person, not a pipeline.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-mid">
              The fastest way to reach BuzzCraft is WhatsApp. Tell us where growth feels stuck and
              we will give you a straight answer, even if the answer is that you do not need us yet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppLink className={buttonClass("primary")}>WhatsApp BuzzCraft</WhatsAppLink>
              <Link href="/scorecard/" className={buttonClass("secondary")}>
                Get my free Scorecard
              </Link>
            </div>
          </div>
          <Mascot pose="arms-crossed" className="mx-auto w-full max-w-xs" />
        </Container>
      </section>
    </>
  );
}
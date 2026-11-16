import { Mascot } from "@/components/brand/Mascot";
import { FaqList } from "@/components/marketing/FaqList";
import { ScorecardForm } from "@/components/marketing/ScorecardForm";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Search Visibility Scorecard",
  description:
    "A free 15-point review of how findable your business is on Google, local search and AI assistants, with findings within 48 working hours.",
  path: "/scorecard",
});

const groups = [
  {
    name: "Findable",
    points: ["Google index health", "Ranking for your money keywords", "Technical SEO basics"],
  },
  {
    name: "On the map",
    points: ["Google Business Profile completeness", "Review signals", "Local landing coverage"],
  },
  {
    name: "Understood by AI",
    points: ["Structured data in place", "Answer-first content", "What AI assistants currently say about you"],
  },
  {
    name: "Nudged to act",
    points: ["One clear next step per page", "Mobile experience and speed", "Dead ends and friction points"],
  },
  {
    name: "Done by systems",
    points: ["Lead capture and routing", "Follow-up automation", "Where enquiries currently leak"],
  },
];

const faqs = [
  {
    question: "What is the Search Visibility Scorecard?",
    answer:
      "A free 15-point review of how findable your business is across Google search, local \"near me\" results and AI assistants, plus where your website loses enquiries. You get a plain-language report with the top fixes ranked by impact, delivered within 48 working hours.",
  },
  {
    question: "Is it really free? What's the catch?",
    answer:
      "It's genuinely free and there's no obligation. The honest commercial logic: some businesses who receive a scorecard go on to book our Sprint, and that's how the free work pays for itself. If yours doesn't need us, the scorecard will say so.",
  },
  {
    question: "What do you do with my information?",
    answer:
      "We use your details to produce and send your scorecard, as covered in our privacy policy and required by POPIA. We only email you marketing if you tick the separate optional box, and we never sell your data.",
  },
  {
    question: "Who actually reviews my business?",
    answer:
      "A person at BuzzCraft, using the same 15-point framework that opens every paid Sprint. We use good tools to gather evidence, but the judgement and the recommendations are human.",
  },
];

export default function ScorecardPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Free · 15 points · 48 hours</p>
      <div className="mt-4 grid items-end gap-8 md:grid-cols-[1fr_14rem]">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Find out where you&apos;re invisible
        </h1>
        <Mascot pose="laptop-thinking" className="mx-auto w-full max-w-[14rem]" />
      </div>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        The Search Visibility Scorecard is a free 15-point review of how findable your business is
        on Google, local search and AI assistants, and where your website quietly loses enquiries.
        You get the findings in plain language, ranked by impact, within 48 working hours.
      </p>

      <h2 className="mt-14 text-2xl font-semibold">The 15 points</h2>
      <p className="mt-2 text-mid">Three checks in each of the five FOUND stages.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {groups.map((group) => (
          <section key={group.name}>
            <h3 className="font-semibold">{group.name}</h3>
            <ul className="mt-3 space-y-1 text-sm leading-6 text-mid">
              {group.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Request your free scorecard</h2>
      <div className="mt-6">
        <ScorecardForm />
      </div>

      <div className="mt-16">
        <FaqList items={faqs} />
      </div>
    </Container>
  );
}

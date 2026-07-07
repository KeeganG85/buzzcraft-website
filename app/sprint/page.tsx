import { Section, SectionHeading, Eyebrow, LinkButton, Faq } from "@/components/ui/primitives";
import { InfoCard, BlueprintTimeline } from "@/components/marketing/cards";
import { SprintCta } from "@/components/marketing/SprintCta";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { faqPageJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "The BuzzCraft Sprint — Growth Diagnosis and Roadmap in 10 Days",
  description:
    "A fixed-scope, 10-business-day engagement: growth direction, search and visibility diagnosis, conversion priorities and a prioritised roadmap for your South African business.",
  path: "/sprint",
});

const stages = [
  { title: "Day 1–2: Deep intake", copy: "A structured working session plus access gathering: your numbers, your channels, your current site and your honest frustrations." },
  { title: "Day 3–5: Diagnosis", copy: "We audit your search visibility, local presence, AI-assistant legibility and conversion path, and map where budget currently leaks." },
  { title: "Day 6–8: Direction", copy: "Positioning sharpened, priorities ranked, quick wins separated from structural work. Everything scored against effort and revenue impact." },
  { title: "Day 9–10: Roadmap handover", copy: "A working session where we walk you through the roadmap, the reasoning and the implementation recommendation. You keep everything." },
];

const sprintFaq = [
  {
    question: "Is the Sprint just a consultation?",
    answer:
      "No. A consultation is a conversation; the Sprint is a fixed-scope diagnostic engagement with defined deliverables: a visibility diagnosis, conversion priorities and a prioritised roadmap you keep, whether or not you ever hire us again.",
  },
  {
    question: "What do you need from us during the Sprint?",
    answer:
      "Roughly three hours of your time across two working sessions, plus access to your website, analytics and business profiles. If some access doesn't exist yet, that's a finding, not a blocker.",
  },
  {
    question: "Do you guarantee rankings or revenue?",
    answer:
      "No, and you should be suspicious of anyone who does. We guarantee the defined deliverables and a defensible, prioritised direction. What we build afterwards is measured openly, month by month.",
  },
  {
    question: "What happens after the Sprint?",
    answer:
      "Three honest options: you implement the roadmap yourself, you hire us for scoped implementation of the top priorities, or we run the growth system together on retainer. The roadmap is written so all three are possible.",
  },
  {
    question: "Why is there a deposit?",
    answer:
      "The deposit secures your Sprint slot and covers the diagnostic work. It's paid through a secure Yoco hosted payment page; we never handle card details on this website.",
  },
];

export default function SprintPage() {
  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <Eyebrow>The BuzzCraft Sprint</Eyebrow>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Ten business days to a clear, prioritised growth direction.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-mid">
              The Sprint is a fixed-scope engagement that diagnoses where your business is losing
              visibility and leads, then hands you a roadmap ranked by revenue impact. It's how
              every serious BuzzCraft engagement starts, because direction should come before
              expensive activity.
            </p>
            <ul className="mt-8 space-y-2.5">
              {[
                "A practical growth direction",
                "A search and visibility diagnosis",
                "Your conversion priorities, ranked",
                "A prioritised roadmap you keep",
                "A clear implementation recommendation",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-soft">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Deposit card — amount and Yoco link read from central config */}
          <aside className="rounded-lg border border-gold/40 bg-surface p-7" aria-labelledby="deposit-heading">
            <h2 id="deposit-heading" className="text-xl font-bold">
              Secure your Sprint
            </h2>
            <p className="mt-2 text-mid">
              {siteConfig.sprint.durationBusinessDays} business days, fixed scope, defined
              deliverables.
            </p>
            <div className="mt-6">
              <SprintCta
                yocoPaymentUrl={siteConfig.sprint.yocoPaymentUrl}
                depositZAR={siteConfig.sprint.depositZAR}
              />
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard title="The Sprint is for you if" accent>
            <ul className="space-y-2.5">
              {[
                "You're spending on marketing without a clear picture of what's working",
                "Your offer has evolved but your positioning and website haven't",
                "Enquiries arrive but leak: slow follow-ups, quiet chats, no system",
                "You're planning a bigger build and want the direction right first",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard title="The Sprint is not for you if">
            <ul className="space-y-2.5">
              {[
                "You want someone to guarantee rankings or revenue in writing",
                "You need a logo by Friday, not a growth direction",
                "You're not able to give roughly three hours across two weeks",
                "You've already got a clear, current, prioritised roadmap you trust",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mid" />
                  {i}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Timeline"
          title="How the ten days run"
          lede="Fixed stages, clear owners, no open-ended discovery that quietly becomes a retainer."
        />
        <BlueprintTimeline steps={stages} />
        <p className="mt-8 max-w-2xl text-mid">
          After handover, you choose: implement it yourself, hire us for the top priorities, or run
          the system together. The roadmap is written to make all three genuinely possible.
        </p>
      </Section>

      <Section tone="raised">
        <SectionHeading eyebrow="Questions" title="Sprint questions, answered before you pay" />
        <Faq items={sprintFaq} />
        <div className="mt-10">
          <LinkButton href="/scorecard" variant="secondary">
            Not ready? Start with the free Scorecard
          </LinkButton>
        </div>
      </Section>

      <ContactFold context="sprint" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageJsonLd(sprintFaq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Sprint", path: "/sprint" },
            ]),
          ),
        }}
      />
    </>
  );
}

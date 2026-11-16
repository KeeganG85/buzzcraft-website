import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { sprint, sprintFaqs } from "@/content/sprint";
import { formatZar } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Visibility and Lead Recovery Sprint",
  description:
    "The Visibility and Lead Recovery Sprint is R18,500 excl. VAT, with a 50% deposit and six deliverables over 10 working days.",
  path: "/sprint",
});

export default function SprintPage() {
  return (
    <>
      <Container className="py-16 md:py-24">
        <p className="eyebrow">Fixed scope, fixed price</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          The Visibility and Lead Recovery Sprint
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
          Ten working days. One team. The highest-impact fixes to how your business gets found,
          trusted and chosen, shipped and handed over. Not a proposal. Not a retainer. A result you
          can point at.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppLink
            className={buttonClass("primary")}
            message="Hi BuzzCraft, I would like to talk about the Sprint."
          >
            Book my Sprint on WhatsApp
          </WhatsAppLink>
          <Link href="/scorecard/" className={buttonClass("secondary")}>
            Not sure yet? Start with the free Scorecard
          </Link>
        </div>
        <dl className="mt-12 grid gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-mid">Price</dt>
            <dd className="tnum mt-1 text-3xl font-semibold">{formatZar(sprint.price)}</dd>
            <dd className="text-sm text-mid">excl. VAT. 50% deposit to book</dd>
          </div>
          <div>
            <dt className="text-sm text-mid">Timeline</dt>
            <dd className="tnum mt-1 text-3xl font-semibold">{sprint.workingDays} days</dd>
            <dd className="text-sm text-mid">working days, kick-off to handover</dd>
          </div>
          <div>
            <dt className="text-sm text-mid">Scope</dt>
            <dd className="tnum mt-1 text-3xl font-semibold">{sprint.deliverables.length}</dd>
            <dd className="text-sm text-mid">deliverables, listed in full</dd>
          </div>
        </dl>
      </Container>

      <section className="bg-surface py-16">
        <Container>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">
            Because a diagnosis without a fix is just expensive bad news.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            Most small businesses do not need a year of retainers to fix their visibility. They need
            a short block of work on the handful of problems causing most of the damage: an unloved
            Google Business Profile, pages that search engines cannot read properly, and enquiries
            that leak because nobody follows up.
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            The Sprint packages diagnosis and repair together. By day ten the fixes are live, the
            baseline is measured, and you own every asset we built.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold">Six deliverables. No padding.</h2>
        <ol className="mt-8 space-y-8">
          {sprint.deliverables.map((item, index) => (
            <li key={item.title} className="grid gap-3 border-t border-white/10 pt-6 md:grid-cols-[4rem_1fr]">
              <p className="tnum text-gold">0{index + 1}</p>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 max-w-2xl leading-7 text-mid">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-ink py-16">
        <Container>
          <h2 className="text-3xl font-semibold">How the ten days run</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-2">
            {sprint.phases.map((phase) => (
              <li key={phase.title}>
                <p className="eyebrow">{phase.days}</p>
                <h3 className="mt-2 text-xl font-semibold">{phase.title}</h3>
                <p className="mt-2 leading-7 text-mid">{phase.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl leading-7 text-mid">
            We guarantee the deliverables, built on Google&apos;s published best practice, with a
            measured baseline before and after. We never guarantee rankings, traffic volumes or AI
            citations.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold">The Sprint is not for everyone</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">It is built for you if</h3>
            <ul className="mt-4 space-y-3 leading-7 text-mid">
              {sprint.fit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">It is the wrong buy if</h3>
            <ul className="mt-4 space-y-3 leading-7 text-mid">
              {sprint.unfit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-3xl leading-7 text-mid">
          The website packages are a separate starting point, and they do not require a Sprint first.{" "}
          <Link href="/pricing/" className="text-gold">
            See the packages
          </Link>
          .
        </p>
        <div className="mt-12">
          <FaqList items={sprintFaqs} />
        </div>
      </Container>

      <section className="border-t border-white/10 py-16">
        <Container>
          <h2 className="text-3xl font-semibold">Ready to stop leaking leads?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-mid">
            Message us on WhatsApp with the word Sprint and a link to your website. We will confirm
            fit within one working day, and if the Sprint is not the right buy we will say so.
          </p>
          <WhatsAppLink
            className={`${buttonClass("primary")} mt-6`}
            message="Sprint. Here is my website: "
          >
            WhatsApp BuzzCraft
          </WhatsAppLink>
        </Container>
      </section>
    </>
  );
}
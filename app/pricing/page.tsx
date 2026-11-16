import Link from "next/link";
import { PriceCards } from "@/components/marketing/PriceCards";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { sprint } from "@/content/sprint";
import { formatZar } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Starter Site, Growth Website and Authority + Automation, from prices, beside the R18,500 Visibility and Lead Recovery Sprint.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Pricing</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        Three website packages, and the Sprint still stands.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        Every package price is a from figure. Pick once-off or monthly on the card. Nothing here
        promises rankings, leads or revenue.
      </p>
      <div className="mt-12">
        <PriceCards />
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-6 text-mid">
        Owner review: VAT, contract length and cancellation terms are not confirmed, so they are not
        written as policy. The annual rand saving on Authority + Automation (R1,200 a month) is also
        unconfirmed and is not calculated on this page. Starter shows a R600 annual saving and Growth
        shows R1,300, which Keegan approved printing. No package is marked recommended.
      </p>

      <article className="mt-16 grid gap-8 border border-white/10 bg-surface p-6 md:grid-cols-[1.4fr_0.8fr] md:p-10">
        <div>
          <p className="eyebrow">Fixed scope</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{sprint.name}</h2>
          <p className="mt-4 leading-7 text-mid">
            Ten working days. Six deliverables. A 50% deposit books the slot and the balance is due
            at handover. This is not one of the three website packages. It sits beside them.
          </p>
          <ul className="mt-6 space-y-2 text-sm leading-6">
            {sprint.deliverables.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
          <Link href="/sprint/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-gold">
            Read the Sprint
          </Link>
        </div>
        <div>
          <p className="tnum text-4xl font-semibold">{formatZar(sprint.price)}</p>
          <p className="mt-2 text-sm text-mid">{sprint.deposit}</p>
          <p className="mt-1 text-sm text-mid">{sprint.workingDays} working days</p>
          <WhatsAppLink
            className={`${buttonClass("primary")} mt-6`}
            message="Hi BuzzCraft, I would like to talk about the Sprint."
          >
            Book my Sprint on WhatsApp
          </WhatsAppLink>
        </div>
      </article>

      <p className="mt-8 max-w-3xl text-sm leading-6 text-mid">
        The live Sprint page also says bespoke projects are taken on selectively from R25,000. That
        figure is repeated on the Sprint page because it is already public. It is not a fourth
        package.
      </p>
    </Container>
  );
}
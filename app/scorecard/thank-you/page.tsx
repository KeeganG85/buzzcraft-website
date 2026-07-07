import { Section, Eyebrow, LinkButton } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Scorecard Requested — What Happens Next",
  description: "Your Search Visibility Scorecard request has been received.",
  path: "/scorecard/thank-you",
  noindex: true,
});

export default function ScorecardThankYouPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Request received</Eyebrow>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your Scorecard is in the queue.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mid">
          A real person will review your website and visibility, score it out of{" "}
          <span className="tnum">100</span> and send it to your WhatsApp and email within{" "}
          <span className="tnum">48</span> hours. If anything needs clarifying, we&apos;ll message
          you first.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <WhatsAppLink context="scorecard" variant="primary">
            Jump the queue on WhatsApp
          </WhatsAppLink>
          <LinkButton href="/insights" variant="secondary">
            Read the Insights while you wait
          </LinkButton>
        </div>
        <p className="mt-8 text-sm text-mid">
          Curious how we&apos;d act on the findings?{" "}
          <Link href="/sprint" className="font-semibold text-gold underline underline-offset-4 hover:text-gold-soft">
            See how the Sprint works
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

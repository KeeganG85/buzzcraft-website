import Link from "next/link";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "WhatsApp +27 67 952 1325 or email info@buzzcraft.co.za. BuzzCraft is based in Johannesburg. Meetings by arrangement.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">No long forms</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        Talk to a person, not a pipeline.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        We are a WhatsApp-first business, because so are our clients. Message us with where growth
        feels stuck and you will get a straight answer from a human, usually within one working day.
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        <section>
          <h2 className="text-xl font-semibold">WhatsApp</h2>
          <p className="mt-3 text-sm leading-6 text-mid">
            One tap, a real reply. This is how most of our client relationships start.
          </p>
          <WhatsAppLink className={`${buttonClass("primary")} mt-4`}>
            {siteConfig.whatsappDisplay}
          </WhatsAppLink>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="mt-3 text-sm leading-6 text-mid">
            Prefer everything in writing, or sending a brief with attachments? Email works too.
          </p>
          <a className="mt-4 inline-flex min-h-11 items-center text-gold" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Johannesburg</h2>
          <p className="mt-3 text-sm leading-6 text-mid">
            {siteConfig.city}, {siteConfig.region}, {siteConfig.country}. We work remotely with
            businesses across South Africa. Meetings by arrangement.
          </p>
        </section>
      </div>
      <p className="mt-14 max-w-2xl leading-7 text-mid">
        If you would rather show than tell, request the free Search Visibility Scorecard and we will
        come back with where you are invisible, where leads leak, and what to fix first.
      </p>
      <Link href="/scorecard/" className={`${buttonClass("secondary")} mt-6`}>
        Get my free Scorecard
      </Link>
    </Container>
  );
}

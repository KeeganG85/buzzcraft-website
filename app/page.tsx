import { Mascot } from "@/components/brand/Mascot";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";

export default function HomePage() {
  return (
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
            customer searches on Google, asks an AI assistant or opens WhatsApp, your business is the
            one that shows up and follows through.
          </p>
          <div className="mt-8">
            <WhatsAppLink className={buttonClass("primary")}>WhatsApp a person</WhatsAppLink>
          </div>
        </div>
        <div className="mascot-settle mx-auto w-full max-w-sm">
          <Mascot pose="welcome" priority />
        </div>
      </Container>
    </section>
  );
}

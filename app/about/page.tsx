import { Mascot } from "@/components/brand/Mascot";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "BuzzCraft was co-founded in Johannesburg by Keegan Goocin and Mokhachane Taoana. We build growth systems for South African businesses.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">
        {siteConfig.city}, {siteConfig.country}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        We do not do marketing. We build growth systems.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        BuzzCraft exists because too many good South African businesses are invisible online while
        louder competitors get the enquiries. We fix that with the work, not with adjectives.
      </p>

      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_18rem]">
        <div className="max-w-2xl space-y-4 leading-7 text-mid">
          <h2 className="text-2xl font-semibold text-soft">Where we come from</h2>
          <h3 className="text-xl font-semibold text-soft">
            <a href="https://za.linkedin.com/in/keegan-goocin-monk" className="text-gold">
              Keegan Goocin
            </a>
            , Co-Founder
          </h3>
          <p>
            Keegan Goocin is co-founder of BuzzCraft. He helps South African businesses get found
            by the right customers on Google, in local search and in AI search, turning visibility
            into enquiries that actually convert. At BuzzCraft, Keegan focuses on the front end of
            growth: search visibility, conversion-led websites and WhatsApp follow-up that keeps
            every lead moving, so owners spend less time chasing enquiries and more time winning
            work.
          </p>
          <h3 className="text-xl font-semibold text-soft">
            <a href="https://www.linkedin.com/in/motaoana" className="text-gold">
              Mokhachane (Mo) Taoana
            </a>
            , Co-Founder
          </h3>
          <p>
            Mokhachane (Mo) Taoana is co-founder of BuzzCraft. He helps business owners turn
            disconnected marketing into one connected system, optimising workflows and digital
            presence so the right customers can find, trust and choose them. At BuzzCraft, Mo
            focuses on the practical side of growth: clear visibility, clean lead journeys and
            automation that stops enquiries leaking, so owners spend less time chasing admin and
            more time doing the work.
          </p>
          <p>
            That shapes the work. A website is a system with a job: get found by the right people,
            earn their trust, and turn attention into enquiries. Design matters, in service of that job.
          </p>
          <p>
            We are a deliberately small team. You talk to the people doing the work. We work
            WhatsApp-first, and we hand over what we build.
          </p>
        </div>
        <Mascot
          pose="johannesburg"
          alt="Buzz, the BuzzCraft mascot, in a suit with the Johannesburg skyline at sunset behind him."
          className="mx-auto w-full max-w-xs"
        />
      </div>

      <h2 className="mt-16 text-2xl font-semibold">How we work</h2>
      <ol className="mt-4 max-w-2xl list-decimal space-y-2 pl-5 leading-7 text-mid">
        <li>The free Search Visibility Scorecard shows where you are invisible.</li>
        <li>The Sprint fixes the highest-impact problems in ten working days, or a package covers a new site.</li>
        <li>Bigger builds come after that, scoped on what we found rather than on optimism.</li>
      </ol>

      <h2 className="mt-16 text-2xl font-semibold">What we will not do</h2>
      <ul className="mt-4 max-w-2xl space-y-3 leading-7 text-mid">
        <li>We never guarantee rankings. Nobody controls Google or ChatGPT.</li>
        <li>We never invent proof. No fake testimonials and no fabricated growth graphs.</li>
        <li>We never trap you with countdown timers, forced newsletter gates or auto-renewing retainers you did not ask for.</li>
        <li>We will tell you when you do not need us. Some businesses only need a profile fix and a WhatsApp button.</li>
      </ul>

      <p className="mt-10 max-w-2xl border border-gold/40 bg-surface p-4 text-sm leading-6">
        The registered name is {siteConfig.legalEntity.registeredName}, registration number{" "}
        {siteConfig.legalEntity.registrationNumber}. VAT number and Information Officer remain
        owner input. The public name is BuzzCraft, based in Johannesburg. There is no street
        address on this site.
      </p>
      <WhatsAppLink className={`${buttonClass("primary")} mt-8`}>WhatsApp BuzzCraft</WhatsAppLink>
    </Container>
  );
}

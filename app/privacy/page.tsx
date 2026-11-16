import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How BuzzCraft handles personal information under POPIA, including Scorecard requests and optional marketing consent.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="text-sm text-mid">Last updated: 16 November 2026</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Privacy policy</h1>
      <div className="mt-8 max-w-3xl border border-gold/40 bg-surface p-5 text-sm leading-6">
        <p className="font-semibold text-gold">Owner input still required</p>
        <p className="mt-2 text-mid">
          The legal name is {siteConfig.legalEntity.registeredName}, which is SA VAT registered.
          VAT number: {siteConfig.legalEntity.vatNumber ?? "[owner input]"}. Company registration
          number: {siteConfig.legalEntity.registrationNumber ?? "[owner input]"}. Information
          Officer: {siteConfig.legalEntity.informationOfficer ?? "[owner input]"}. Privacy requests
          go to {siteConfig.email}.
        </p>
      </div>
      <div className="mt-10 max-w-3xl space-y-8 leading-7 text-mid">
        <section>
          <h2 className="text-xl font-semibold text-soft">Who this describes</h2>
          <p className="mt-3">
            This policy explains how {siteConfig.legalEntity.registeredName}, based in Johannesburg,
            South Africa, handles personal information under the Protection of Personal Information
            Act (POPIA).
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">What we collect</h2>
          <p className="mt-3">
            When you request a Search Visibility Scorecard or contact us, we collect what you give
            us: your name, email address, business name, website URL if you provide one, and anything
            you tell us about your growth challenge. When you message us on WhatsApp, we see your
            number and message, handled under WhatsApp&apos;s own terms. This website does not run
            invasive third-party advertising trackers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">Why we collect it</h2>
          <p className="mt-3">
            We use your information to do the thing you asked for: produce and deliver your
            scorecard, respond to your enquiry, or run your project. If you tick the separate,
            optional marketing box, we may also send occasional practical growth advice by email.
            That consent is never bundled into the operational one, and you can withdraw it at any
            time.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">Where a Scorecard request is stored</h2>
          <p className="mt-3">
            Sending the form opens WhatsApp with your details. A database copy is not stored yet.
            The SQL for a future scorecard_requests table is in this repository and has not been
            applied. Storage stays off until Keegan approves that migration and the server env vars
            after pull request review. This site does not create or change a Supabase project.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">What we never do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>We never sell or rent your personal information.</li>
            <li>We never add you to a marketing list you did not explicitly opt into.</li>
            <li>We never send bulk WhatsApp broadcasts to people who have not asked.</li>
            <li>We never collect more than we need to answer the request.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">How long we keep it</h2>
          <p className="mt-3">
            We keep scorecard and enquiry information for as long as it is needed to serve you, plus
            a reasonable period for record-keeping. If you never become a client, we periodically
            clear old enquiry data rather than hoarding it. A numbered retention schedule is not
            published yet.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-soft">Your rights under POPIA</h2>
          <p className="mt-3">
            You may ask what personal information we hold about you, ask us to correct it, or ask us
            to delete it. Email {siteConfig.email} with the subject line &quot;POPIA request&quot;.
            You also have the right to complain to the Information Regulator of South Africa.
          </p>
        </section>
      </div>
    </Container>
  );
}

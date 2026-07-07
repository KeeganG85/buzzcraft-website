import { Section, Eyebrow } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Privacy Policy (POPIA)",
  description:
    "How BuzzCraft collects, uses and protects personal information under the Protection of Personal Information Act (POPIA).",
  path: "/privacy",
});

/**
 * TODO_VERIFY: this policy is a working draft structured for POPIA. Before
 * launch, confirm with the owner (and ideally a legal adviser): the registered
 * legal entity name, the Information Officer's name and contact details, data
 * retention periods, and the full list of third-party processors in use.
 */

const sections: { heading: string; paragraphs: string[]; list?: string[] }[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${siteConfig.legalName} ("BuzzCraft", "we", "us") is a growth systems agency based in ${siteConfig.city}, ${siteConfig.region}, ${siteConfig.country}. This policy explains how we handle personal information in line with the Protection of Personal Information Act, 4 of 2013 (POPIA).`,
      `You can contact us about anything in this policy at ${siteConfig.email}.`,
    ],
  },
  {
    heading: "What we collect and why",
    paragraphs: [
      "We only collect personal information you choose to give us, and only for purposes we state at the point of collection.",
    ],
    list: [
      "Scorecard requests: your full name, business name, website URL, WhatsApp number and email address, used to prepare and deliver your Search Visibility Scorecard and respond to your request.",
      "Marketing communications: only if you tick the separate, optional opt-in. You can unsubscribe at any time and it never affects your Scorecard.",
      "WhatsApp and email conversations: the content you send us when you contact us, used to respond and provide our services.",
      "Website analytics: aggregated, non-identifying usage data used to improve the website. Our analytics events never contain names, emails, phone numbers or form contents.",
    ],
  },
  {
    heading: "Consent and your choices",
    paragraphs: [
      "Consent on this website is explicit and unbundled. The Scorecard consent checkbox is never pre-ticked, and marketing opt-in is a separate, optional choice. We record when you consented and which version of this policy applied.",
      "You may withdraw consent at any time by emailing us or replying to any message we send you. Withdrawal doesn't affect processing that happened lawfully before it.",
    ],
  },
  {
    heading: "How we store and protect information",
    paragraphs: [
      "Lead information is stored in a secured database with access restricted to authorised BuzzCraft personnel. Server credentials are never exposed to your browser, and form submissions are validated and rate-limited to resist abuse.",
      "We keep personal information only as long as needed for the purpose it was collected, or as required by law, after which it is deleted or anonymised.", // TODO_VERIFY retention periods
    ],
  },
  {
    heading: "Third parties we rely on",
    paragraphs: [
      "We use a small number of service providers to operate this website and our services, such as website hosting, database infrastructure and, where you choose to pay a deposit, Yoco's hosted payment pages. We never see or store your card details.",
      "We do not sell personal information. Ever. Not even for a very nice lunch.",
    ],
  },
  {
    heading: "Your rights under POPIA",
    paragraphs: [
      "You have the right to request access to the personal information we hold about you, to ask for it to be corrected or deleted, to object to processing, and to lodge a complaint with the Information Regulator of South Africa (inforeg.org.za).",
      `To exercise any of these rights, email ${siteConfig.email} and we will respond within a reasonable time.`,
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      `This is version ${siteConfig.privacyPolicyVersion} of our privacy policy. If we make material changes, we will update the version date here and, where appropriate, notify you directly.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="tnum mt-3 text-sm text-mid">Version {siteConfig.privacyPolicyVersion}</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold leading-snug">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-mid">
                  {p}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-2.5 text-soft">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}

import { Section, Eyebrow, LinkButton } from "@/components/ui/primitives";
import { ToolCard } from "@/components/marketing/ToolCard";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Free Growth Tools for South African Businesses",
  description:
    "Free tools we actually use: the Local Website Blueprint Builder, the BuzzCraft Prompt OS and the Search Visibility Scorecard. Practical, free and built for SA businesses.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Free tools</Eyebrow>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Free tools we actually use
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mid">
            We build practical tools for our own work and our clients&apos; growth. Use them free.
            If they help, imagine what the paid work does.
          </p>
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid gap-6 md:grid-cols-3">
          <ToolCard
            name="Local Website Blueprint Builder"
            copy="Answer a few questions about your business and get a practical website blueprint built for local search and conversion."
            cta="Build My Blueprint"
            href={siteConfig.tools.blueprintBuilderUrl}
            external
          />
          <ToolCard
            name="BuzzCraft Prompt OS"
            copy="A working library of AI prompts we use for marketing, content and client delivery. Steal them."
            cta="Open the Library"
            href={siteConfig.tools.promptOsUrl}
            external
          />
          <ToolCard
            name="Search Visibility Scorecard"
            copy="Find out where you're losing visibility and leads, scored out of 100, free in 48 hours."
            cta="Get My Scorecard"
            href={siteConfig.tools.scorecardPath}
            external={false}
          />
        </div>
        <p className="mt-10 max-w-2xl text-mid">
          Used a tool and want help acting on what it told you? That&apos;s exactly the gap between
          insight and implementation that BuzzCraft exists to close.
        </p>
        <div className="mt-6">
          <LinkButton href="/sprint" variant="secondary">
            See how the Sprint turns findings into a roadmap
          </LinkButton>
        </div>
      </Section>

      <ContactFold context="tools" heading="Tool told you something uncomfortable?" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
            ]),
          ),
        }}
      />
    </>
  );
}

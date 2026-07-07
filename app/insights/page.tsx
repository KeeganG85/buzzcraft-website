import Link from "next/link";
import { Section, Eyebrow, LinkButton } from "@/components/ui/primitives";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { getPublishedInsights } from "@/content/insights";

export const metadata = pageMetadata({
  title: "Insights — Practical Growth Thinking for South African Businesses",
  description:
    "Plain-English guides on growth systems, local SEO, AI search visibility and WhatsApp conversion, written for South African SMEs and founders. No fluff, no jargon.",
  path: "/insights",
});

const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default function InsightsPage() {
  const articles = getPublishedInsights();

  return (
    <>
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Practical growth thinking, written for South African businesses.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mid">
            The questions we actually get asked, answered directly. Each article starts with the
            answer, then earns your time with the detail.
          </p>
          <div className="mt-8">
            <LinkButton href="/scorecard" variant="primary">
              Get My Scorecard
            </LinkButton>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-charcoal p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{article.category}</p>
                <h2 className="mt-3 text-xl font-bold leading-snug">
                  <Link href={`/insights/${article.slug}`} className="hover:text-gold">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-relaxed text-mid">{article.description}</p>
                <p className="tnum mt-auto pt-5 text-sm text-mid">
                  <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <ContactFold context="insights" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
            ]),
          ),
        }}
      />
    </>
  );
}

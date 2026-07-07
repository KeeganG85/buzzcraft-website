import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Faq } from "@/components/ui/primitives";
import { InsightCta } from "@/components/marketing/InsightCta";
import { ContactFold } from "@/components/layout/ContactFold";
import { pageMetadata } from "@/lib/seo";
import { blogPostingJsonLd, breadcrumbJsonLd, faqPageJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { getInsight, getPublishedInsights } from "@/content/insights";

export function generateStaticParams() {
  return getPublishedInsights().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/insights/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    authors: [article.author],
  });
}

const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const related = getPublishedInsights().filter((i) => i.slug !== article.slug).slice(0, 2);

  return (
    <>
      <article className="py-section">
        <Container className="max-w-3xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-mid">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-gold">Home</Link>
                <span aria-hidden="true" className="ml-2">/</span>
              </li>
              <li>
                <Link href="/insights" className="hover:text-gold">Insights</Link>
                <span aria-hidden="true" className="ml-2">/</span>
              </li>
              <li aria-current="page" className="text-soft">{article.category}</li>
            </ol>
          </nav>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{article.category}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{article.title}</h1>

          {/* Byline and dates */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mid">
            <span className="font-semibold text-soft">{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>{article.authorRole}</span>
            <span aria-hidden="true">·</span>
            <span className="tnum">
              Published <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time>
            </span>
            {article.modifiedAt !== article.publishedAt && (
              <span className="tnum">
                · Updated <time dateTime={article.modifiedAt}>{dateFormat.format(new Date(article.modifiedAt))}</time>
              </span>
            )}
          </div>

          {/* Direct answer block — AEO: answer first, then depth */}
          <div className="mt-8 rounded-lg border-l-4 border-gold bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">The short answer</h2>
            <p className="mt-3 text-lg leading-relaxed text-soft">{article.directAnswer}</p>
          </div>

          {/* Body */}
          <div className="mt-10 space-y-10">
            {article.sections.map((section) => (
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

          {/* Related-service CTA */}
          <InsightCta relatedServices={article.relatedServices} slug={article.slug} />

          {/* FAQ */}
          {article.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Common questions</h2>
              <Faq items={article.faq} />
            </section>
          )}

          {/* Author */}
          <p className="mt-12 border-t border-line pt-6 text-sm leading-relaxed text-mid">
            <span className="font-semibold text-soft">{article.author}</span> — {article.authorBio}
          </p>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-bold">Keep reading</h2>
              <ul className="grid gap-6 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug} className="rounded-lg border border-line bg-surface p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{r.category}</p>
                    <Link href={`/insights/${r.slug}`} className="mt-2 block font-bold leading-snug hover:text-gold">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </article>

      <ContactFold context="insights" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageJsonLd(article.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
              { name: article.title, path: `/insights/${article.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}

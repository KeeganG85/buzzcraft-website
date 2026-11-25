import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { serializeJsonLd } from "@/lib/jsonld";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  cardImage,
  categorySlug,
  formatInsightDate,
  headingContents,
  htmlWithHeadingIds,
  insightPath,
  publishedIso,
  readingLabel,
  safeInsightHtml,
  showContents,
  updatedIso,
  type PublicInsight,
} from "@/lib/insights-public";

export function InsightArticle({ article, related }: { article: PublicInsight; related: PublicInsight[] }) {
  const headline = article.h1 || article.title;
  const image = cardImage(article);
  const html = safeInsightHtml(article.content_html ?? "");
  const formatted = html ? htmlWithHeadingIds(html) : "";
  const toc = formatted ? headingContents(formatted) : [];
  const contents = showContents(article, toc.length);
  const published = formatInsightDate(publishedIso(article));
  const updated = formatInsightDate(updatedIso(article));
  const reading = readingLabel(article.body);
  const author = article.author.trim() || "BuzzCraft";
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights/" },
    ...(article.category.trim()
      ? [{ name: article.category, href: `/insights/category/${categorySlug(article.category)}/` }]
      : []),
    { name: headline, href: insightPath(article.slug) },
  ];
  const paragraphs = article.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

  return (
    <Container className="py-16">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 text-sm text-mid">
          {crumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === crumbs.length - 1 ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <Link className="underline" href={crumb.href}>
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {article.category ? <p className="mt-6 text-sm text-gold">{article.category}</p> : null}
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">{headline}</h1>
      {article.excerpt ? <p className="mt-4 max-w-2xl text-lg text-mid">{article.excerpt}</p> : null}
      <p className="mt-4 text-sm text-mid">
        {author}
        {published ? ` · ${published}` : ""}
        {updated ? ` · Updated ${updated}` : ""}
        {reading ? ` · ${reading}` : ""}
      </p>
      {article.hero_image.trim() ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} className="mt-8 max-h-[28rem] w-full rounded-2xl object-cover" />
      ) : null}
      {article.excerpt ? (
        <section className="mt-8 max-w-2xl">
          <h2 className="text-xl font-semibold">In short</h2>
          <p className="mt-3 leading-7">{article.excerpt}</p>
        </section>
      ) : null}
      {contents && toc.length > 0 ? (
        <nav aria-label="Contents" className="mt-8 max-w-2xl">
          <h2 className="text-xl font-semibold">Contents</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                <a className="underline" href={`#${item.id}`}>
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      {formatted ? (
        <div className="insight-body mt-8 max-w-2xl space-y-4 leading-7" dangerouslySetInnerHTML={{ __html: formatted }} />
      ) : (
        <div className="mt-8 max-w-2xl space-y-4 leading-7">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      )}
      {article.source_note.trim() ? (
        <section className="mt-10 max-w-2xl">
          <h2 className="text-xl font-semibold">Sources</h2>
          <p className="mt-3 leading-7 text-mid">{article.source_note}</p>
        </section>
      ) : null}
      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Related</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link className="text-gold underline" href={insightPath(item.slug)}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <aside className="mt-12 max-w-2xl rounded-2xl border border-gold/40 bg-surface p-5">
        <h2 className="text-xl font-semibold">Search Visibility Scorecard</h2>
        <p className="mt-3 leading-7 text-mid">See how easy your business is to find, then decide what to fix first.</p>
        <Link className="mt-4 inline-flex min-h-11 items-center text-gold underline" href="/scorecard/">
          Open the Scorecard
        </Link>
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingJsonLd(article)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(article)) }} />
    </Container>
  );
}

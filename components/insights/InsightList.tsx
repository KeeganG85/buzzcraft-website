import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import {
  cardImage,
  categorySlug,
  formatInsightDate,
  insightCategories,
  insightPath,
  insightsEmpty,
  insightsHeadline,
  insightsNoMatch,
  insightsSupport,
  publishedIso,
  readingLabel,
  type PublicInsight,
} from "@/lib/insights-public";

export function InsightList({
  articles,
  catalogue,
  query = "",
  category = "",
}: {
  articles: PublicInsight[];
  catalogue?: PublicInsight[];
  query?: string;
  category?: string;
}) {
  const categories = insightCategories(catalogue ?? articles);
  const filtered = articles.filter((article) => {
    if (category && categorySlug(article.category) !== category) return false;
    return true;
  });
  const featured = !query && !category ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Insights</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">{insightsHeadline}</h1>
      <p className="mt-6 max-w-2xl leading-7 text-mid">{insightsSupport}</p>
      <form action={category ? `/insights/category/${category}/` : "/insights/"} method="get" className="mt-8 flex flex-wrap gap-3" role="search">
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <label className="min-w-0 flex-1 text-sm font-semibold">
          Search insights
          <input
            name="q"
            defaultValue={query}
            className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3"
          />
        </label>
        <button type="submit" className="mt-7 min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold">
          Search
        </button>
      </form>
      <nav aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
        <Link
          href={query ? `/insights/?q=${encodeURIComponent(query)}` : "/insights/"}
          className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${category ? "border-white/15" : "border-gold text-gold"}`}
          aria-current={category ? undefined : "page"}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/insights/category/${item.slug}/`}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${category === item.slug ? "border-gold text-gold" : "border-white/15"}`}
            aria-current={category === item.slug ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      {filtered.length === 0 ? (
        <p className="mt-10 max-w-2xl leading-7 text-mid">{query || category ? insightsNoMatch : insightsEmpty}</p>
      ) : null}
      {featured ? <InsightCard article={featured} featured /> : null}
      {rest.length > 0 ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {rest.map((article) => (
            <li key={article.id}>
              <InsightCard article={article} />
            </li>
          ))}
        </ul>
      ) : null}
    </Container>
  );
}

function InsightCard({ article, featured = false }: { article: PublicInsight; featured?: boolean }) {
  const image = cardImage(article);
  const date = formatInsightDate(publishedIso(article));
  const reading = readingLabel(article.body);
  return (
    <article className={`overflow-hidden rounded-2xl border border-white/10 bg-surface ${featured ? "mt-8" : "h-full"}`}>
      <Link href={insightPath(article.slug)} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className={`w-full object-cover ${featured ? "max-h-80" : "h-48"}`} />
        <div className="p-5">
          {article.category ? <p className="text-sm text-gold">{article.category}</p> : null}
          <h2 className={`mt-2 font-semibold tracking-tight ${featured ? "text-3xl" : "text-xl"}`}>{article.title}</h2>
          {article.excerpt ? <p className="mt-3 text-sm leading-6 text-mid">{article.excerpt}</p> : null}
          <p className="mt-4 text-sm text-mid">
            {[date, reading].filter(Boolean).join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}

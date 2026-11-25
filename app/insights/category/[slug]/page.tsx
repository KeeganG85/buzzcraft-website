import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightList } from "@/components/insights/InsightList";
import { categorySlug, matchesQuery, visibleInsights, type PublicInsight } from "@/lib/insights-public";
import { pageMetadata } from "@/lib/seo";
import { listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articles = visibleInsights((await listPublishedArticles()) as PublicInsight[]);
  const match = articles.find((article) => categorySlug(article.category) === slug);
  if (!match) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: match.category,
    description: `Published insights in ${match.category}.`,
    path: `/insights/category/${slug}`,
  });
}

export default async function InsightCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const catalogue = visibleInsights((await listPublishedArticles()) as PublicInsight[]);
  const named = catalogue.find((article) => categorySlug(article.category) === slug);
  if (!named) notFound();
  const filtered = catalogue.filter(
    (article) => categorySlug(article.category) === slug && matchesQuery(article, q),
  );
  return <InsightList articles={filtered} catalogue={catalogue} query={q} category={slug} />;
}

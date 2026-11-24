import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import {
  isWithheldInsightSlug,
  redirectSlug,
  relatedInsights,
  visibleInsights,
  type PublicInsight,
} from "@/lib/insights-public";
import { pageMetadata } from "@/lib/seo";
import { findPublishedSlugRedirect, listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (isWithheldInsightSlug(slug)) return { robots: { index: false, follow: false } };
  const article = visibleInsights((await listPublishedArticles()) as PublicInsight[]).find((item) => item.slug === slug);
  if (!article) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: article.seo_title || article.h1 || article.title,
    description: article.meta_description || article.excerpt,
    path: `/insights/${slug}`,
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isWithheldInsightSlug(slug)) notFound();
  const articles = visibleInsights((await listPublishedArticles()) as PublicInsight[]);
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    const current = redirectSlug(slug, await findPublishedSlugRedirect(slug));
    if (current) permanentRedirect(`/insights/${current}/`);
    notFound();
  }
  return <InsightArticle article={article} related={relatedInsights(articles, article)} />;
}

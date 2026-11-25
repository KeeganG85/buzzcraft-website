import type { Metadata } from "next";
import { InsightList } from "@/components/insights/InsightList";
import { insightsSupport, matchesQuery, visibleInsights, type PublicInsight } from "@/lib/insights-public";
import { pageMetadata } from "@/lib/seo";
import { listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description: insightsSupport,
  path: "/insights",
});

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const catalogue = visibleInsights((await listPublishedArticles()) as PublicInsight[]);
  const articles = catalogue.filter((article) => matchesQuery(article, q));
  return <InsightList articles={articles} catalogue={catalogue} query={q} />;
}

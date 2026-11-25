import type { MetadataRoute } from "next";
import { insightPath, publishedIso, visibleInsights, type PublicInsight } from "@/lib/insights-public";
import { indexablePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = indexablePaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: "2026-11-16",
  }));
  const articles = visibleInsights((await listPublishedArticles()) as PublicInsight[]).map((article) => ({
    url: absoluteUrl(insightPath(article.slug)),
    lastModified: publishedIso(article) || undefined,
  }));
  return [...pages, ...articles];
}

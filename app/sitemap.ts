import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPublishedInsights } from "@/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sprint`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/scorecard`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const articles: MetadataRoute.Sitemap = getPublishedInsights().map((article) => ({
    url: `${base}/insights/${article.slug}`,
    lastModified: new Date(article.modifiedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articles];
}

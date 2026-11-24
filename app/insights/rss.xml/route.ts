import { insightPath, publishedIso, visibleInsights, type PublicInsight } from "@/lib/insights-public";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = visibleInsights((await listPublishedArticles()) as PublicInsight[]);
  const items = articles
    .map((article) => {
      const link = absoluteUrl(insightPath(article.slug));
      const date = publishedIso(article);
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(link)}</link><guid>${escapeXml(link)}</guid>${date ? `<pubDate>${escapeXml(new Date(`${date}T00:00:00.000Z`).toUTCString())}</pubDate>` : ""}<description>${escapeXml(article.excerpt || article.meta_description)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)} Insights</title><link>${escapeXml(absoluteUrl("/insights"))}</link><description>${escapeXml("Practical insights for South African businesses.")}</description>${items}</channel></rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

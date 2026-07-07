import type { Metadata } from "next";
import { siteConfig } from "./site-config";

interface PageSeo {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/** Build consistent per-route metadata with canonical URLs and social cards. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImage = "/brand/buzz-editorial.webp",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: PageSeo): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_ZA",
      type,
      images: [{ url: ogImage, width: 900, height: 1351, alt: `${siteConfig.name} — ${siteConfig.tagline}` }],
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

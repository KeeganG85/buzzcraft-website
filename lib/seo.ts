import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Preferred host is https://www.buzzcraft.co.za.
 * One trailing-slash policy: directory routes end with a slash, matching the
 * live sitemap. File URLs such as /sitemap.xml do not gain a slash.
 * next.config sets trailingSlash: true so Next.js redirects the other form.
 */
export function canonicalPath(path: string): string {
  if (path === "/" || path === "") return "/";
  const withLead = path.startsWith("/") ? path : `/${path}`;
  if (/\.[a-z0-9]+$/i.test(withLead)) return withLead;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(canonicalPath(path), siteConfig.url).toString();
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_ZA",
      type: "website",
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "BuzzCraft" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/og.png"],
    },
  };
}

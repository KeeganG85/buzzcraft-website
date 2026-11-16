import type { MetadataRoute } from "next";
import { blockedPaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...blockedPaths],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: "https://www.buzzcraft.co.za",
  };
}

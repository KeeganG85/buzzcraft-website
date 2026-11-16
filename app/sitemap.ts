import type { MetadataRoute } from "next";
import { indexablePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: "2026-11-16",
  }));
}

"use client";

import dynamic from "next/dynamic";
import type { ArticleRecord } from "@/lib/studio";
import type { ProseNode } from "@/lib/studio-doc";

const ArticleEditor = dynamic(
  () => import("@/components/studio/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
    loading: () => <p className="text-sm text-mid">Loading editor</p>,
  },
);

export function EditorLoader({
  initial,
  publishedArticles = [],
  otherSlugs = [],
  revisions = [],
  cronConfigured = false,
}: {
  initial?: Partial<ArticleRecord> & { doc?: ProseNode };
  publishedArticles?: { slug: string; title: string }[];
  otherSlugs?: string[];
  revisions?: { version_number: number; approval_status: string; created_at: string; revision_notes: string }[];
  cronConfigured?: boolean;
}) {
  return (
    <ArticleEditor
      initial={initial}
      publishedArticles={publishedArticles}
      otherSlugs={otherSlugs}
      revisions={revisions}
      cronConfigured={cronConfigured}
    />
  );
}

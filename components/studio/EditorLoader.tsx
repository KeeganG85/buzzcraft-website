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

export function EditorLoader({ initial }: { initial?: Partial<ArticleRecord> & { doc?: ProseNode } }) {
  return <ArticleEditor initial={initial} />;
}

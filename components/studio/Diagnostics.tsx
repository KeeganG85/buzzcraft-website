"use client";

import { useState } from "react";
import { absoluteUrl } from "@/lib/seo";
import {
  characterCounts,
  destinationAllowed,
  diagnose,
  diagnosticRubric,
  suggestInternalLinks,
  type LinkSuggestion,
} from "@/lib/studio-diagnostics";
import { buttonClass } from "@/components/ui/primitives";

export function Diagnostics({
  seoTitle,
  metaDescription,
  title,
  h1,
  slug,
  excerpt,
  body,
  canonical,
  focusPhrase,
  heroImage,
  heroAlt,
  sourceNote,
  headings,
  hasInternalLink,
  otherSlugs,
  publishedArticles,
  onInsertLink,
}: {
  seoTitle: string;
  metaDescription: string;
  title: string;
  h1: string;
  slug: string;
  excerpt: string;
  body: string;
  canonical: string;
  focusPhrase: string;
  heroImage: string;
  heroAlt: string;
  sourceNote: string;
  headings: { level: number; text: string }[];
  hasInternalLink: boolean;
  otherSlugs: string[];
  publishedArticles: { slug: string; title: string }[];
  onInsertLink: (href: string, anchor: string) => void;
}) {
  const counts = characterCounts(seoTitle, metaDescription);
  const checks = diagnose({
    seoTitle,
    metaDescription,
    title,
    h1,
    slug,
    body,
    canonical,
    focusPhrase,
    heroImage,
    heroAlt,
    sourceNote,
    headings,
    hasInternalLink,
    otherSlugs,
  });
  const suggestions = suggestInternalLinks({
    text: `${title} ${h1} ${body} ${focusPhrase}`,
    currentSlug: slug,
    articles: publishedArticles,
  });
  const [anchors, setAnchors] = useState<Record<string, string>>({});
  const [hidden, setHidden] = useState<Record<string, "accepted" | "rejected">>({});
  const previewTitle = seoTitle || title || "Untitled draft";
  const previewUrl = absoluteUrl(slug ? `/insights/${slug}` : "/insights/");
  const previewText = metaDescription || excerpt || "Meta description";

  function anchorFor(item: LinkSuggestion): string {
    return anchors[item.path] ?? item.label;
  }

  return (
    <section className="space-y-4 border-t border-white/10 pt-4" aria-label="Editing checklist">
      <h3 className="text-sm font-semibold">Editing checklist</h3>
      <p className="text-sm leading-6 text-mid">{diagnosticRubric}</p>
      <div className="rounded-lg border border-white/15 bg-ink p-3">
        <p className="text-xs text-mid">Search result preview. This is a reading aid, not a ranking.</p>
        <p className="mt-2 text-base text-soft">{previewTitle}</p>
        <p className="text-sm text-gold">{previewUrl}</p>
        <p className="mt-1 text-sm text-mid">{previewText}</p>
        <p className="mt-2 text-xs text-mid">
          SEO title: {counts.seoTitle} characters. Meta description: {counts.metaDescription} characters.
        </p>
      </div>
      <ul className="space-y-2">
        {checks.map((check) => (
          <li key={check.id} className="text-sm leading-6">
            <span className="font-semibold">{check.area}.</span> {check.state === "in place" ? "In place." : "Worth a look."} {check.detail}
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Internal links</h3>
        <p className="text-sm leading-6 text-mid">Edit the anchor, then accept or reject. Nothing is inserted until you accept.</p>
        <ul className="space-y-3">
          {suggestions.map((item) => {
            const state = hidden[item.path];
            if (state === "rejected" || state === "accepted") {
              return (
                <li key={item.path} className="text-sm text-mid">
                  {item.label}: {state}.
                </li>
              );
            }
            const anchor = anchorFor(item);
            return (
              <li key={item.path} className="space-y-2 rounded-lg border border-white/10 p-3">
                <p className="text-sm">
                  <span className="font-semibold">{item.path}</span> {item.reason}
                </p>
                <label className="block text-sm">
                  Anchor text
                  <input
                    className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3"
                    value={anchor}
                    onChange={(event) => setAnchors((current) => ({ ...current, [item.path]: event.target.value }))}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={buttonClass("primary")}
                    disabled={!anchor.trim() || !destinationAllowed(item.path, suggestions)}
                    onClick={() => {
                      if (!destinationAllowed(item.path, suggestions) || !anchor.trim()) return;
                      onInsertLink(item.path, anchor.trim());
                      setHidden((current) => ({ ...current, [item.path]: "accepted" }));
                    }}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className={buttonClass("secondary")}
                    onClick={() => setHidden((current) => ({ ...current, [item.path]: "rejected" }))}
                  >
                    Reject
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

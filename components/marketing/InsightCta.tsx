"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Related-service CTA block inside Insights articles. Bridges the authority
 * content back into the growth system: relevant service links plus the
 * Scorecard as the low-friction next step.
 */
export function InsightCta({
  relatedServices,
  slug,
}: {
  relatedServices: { label: string; href: string }[];
  slug: string;
}) {
  const onClick = (target: string) => track("insight_cta_click", { article: slug, target });

  return (
    <aside className="mt-12 rounded-lg border border-gold/40 bg-surface p-7" aria-labelledby={`cta-${slug}`}>
      <h2 id={`cta-${slug}`} className="text-xl font-bold">
        Want this working in your business?
      </h2>
      <p className="mt-2 leading-relaxed text-mid">
        Reading is free. So is finding out exactly where your visibility and conversion leak, the
        Scorecard takes two minutes to request.
      </p>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          href="/scorecard"
          onClick={() => onClick("scorecard")}
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-6 font-semibold text-ink transition-colors hover:bg-gold-soft"
        >
          Get My Scorecard
        </Link>
        <div className="flex flex-col gap-1">
          {relatedServices.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => onClick(s.href)}
              className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-gold hover:text-gold-soft"
            >
              {s.label} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

/* ── Pillar card ─────────────────────────────────────────────────────────── */

export function PillarCard({
  index,
  title,
  copy,
  items,
  href = "/services",
}: {
  index: string;
  title: string;
  copy: string;
  items: string[];
  href?: string;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-surface p-7">
      <p className="tnum mb-5 text-sm font-bold text-gold" aria-hidden="true">
        {index}
      </p>
      <h3 className="text-xl font-bold leading-snug">{title}</h3>
      <p className="mt-3 leading-relaxed text-mid">{copy}</p>
      <ul className="mt-5 space-y-2 text-sm text-soft">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-auto inline-flex min-h-12 items-center gap-1.5 pt-5 font-semibold text-gold hover:text-gold-soft">
        Explore this pillar <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

/* ── Blueprint timeline ──────────────────────────────────────────────────── */

export function BlueprintTimeline({ steps }: { steps: { title: string; copy: string }[] }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-8">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden="true"
            className="tnum absolute -left-8 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-gold bg-charcoal text-sm font-bold text-gold"
          >
            {i + 1}
          </span>
          <h3 className="pt-0.5 text-lg font-bold">{step.title}</h3>
          <p className="mt-1.5 max-w-xl leading-relaxed text-mid">{step.copy}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── Generic content card ────────────────────────────────────────────────── */

export function InfoCard({
  title,
  children,
  accent = false,
}: {
  title: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-7 ${accent ? "border-gold/40 bg-surface" : "border-line bg-surface"}`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-3 leading-relaxed text-mid">{children}</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export function ToolCard({
  name,
  copy,
  cta,
  href,
  external,
}: {
  name: string;
  copy: string;
  cta: string;
  href: string;
  external: boolean;
}) {
  const onClick = () => track("tool_click", { tool: name });
  const cardClass = "flex h-full flex-col rounded-lg border border-line bg-surface p-7";
  const ctaClass =
    "mt-auto inline-flex min-h-12 items-center gap-1.5 pt-5 font-semibold text-gold hover:text-gold-soft";

  return (
    <article className={cardClass}>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mt-3 leading-relaxed text-mid">{copy}</p>
      {external ? (
        <a href={href} rel="noopener noreferrer" target="_blank" className={ctaClass} onClick={onClick}>
          {cta} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <Link href={href} className={ctaClass} onClick={onClick}>
          {cta} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/* ── Buttons ─────────────────────────────────────────────────────────────── */

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-gold min-h-12 px-6 text-base";

const variants = {
  primary: `${base} bg-gold text-ink hover:bg-gold-soft`,
  secondary: `${base} border border-line bg-transparent text-soft hover:border-gold hover:text-gold`,
  ghost: "inline-flex items-center gap-1.5 font-semibold text-gold hover:text-gold-soft min-h-12",
} as const;

type Variant = keyof typeof variants;

export function LinkButton({
  href,
  variant = "primary",
  children,
  external = false,
  ...rest
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  external?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (external) {
    return (
      <a href={href} className={variants[variant]} rel="noopener noreferrer" target="_blank" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={variants[variant]} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  ...rest
}: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={variants[variant]} {...rest}>
      {children}
    </button>
  );
}

/* ── Layout primitives ───────────────────────────────────────────────────── */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  id,
  className = "",
  tone = "dark",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: "dark" | "raised";
}) {
  return (
    <section id={id} className={`py-section ${tone === "raised" ? "bg-surface" : ""} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-mid">{lede}</p> : null}
    </div>
  );
}

/* ── Accessible FAQ accordion (native details/summary) ───────────────────── */

export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-soft [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-gold transition-transform group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed text-mid">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

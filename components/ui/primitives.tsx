import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>;
}

export function buttonClass(variant: "primary" | "secondary" = "primary"): string {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0";
  if (variant === "secondary") {
    return `${base} border border-white/20 text-soft hover:border-gold`;
  }
  return `${base} bg-gold text-ink`;
}

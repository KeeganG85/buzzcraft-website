"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { whatsappUrl, whatsappMessages, type WhatsAppContext } from "@/lib/whatsapp";

const styles = {
  primary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-6 text-base font-semibold text-ink transition-colors hover:bg-gold-soft",
  secondary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line px-6 text-base font-semibold text-soft transition-colors hover:border-gold hover:text-gold",
  ghost: "inline-flex min-h-12 items-center gap-1.5 font-semibold text-gold hover:text-gold-soft",
} as const;

export function WhatsAppLink({
  context = "default",
  variant = "secondary",
  children,
}: {
  context?: WhatsAppContext;
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  return (
    <a
      href={whatsappUrl(whatsappMessages[context])}
      className={styles[variant]}
      rel="noopener noreferrer"
      target="_blank"
      onClick={() => track("whatsapp_click", { context })}
    >
      {children}
    </a>
  );
}

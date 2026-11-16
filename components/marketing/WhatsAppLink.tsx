import type { ReactNode } from "react";
import { whatsAppHref } from "@/lib/whatsapp";

export function WhatsAppLink({
  children,
  message,
  className,
}: {
  children: ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <a href={whatsAppHref(message)} className={className}>
      {children}
    </a>
  );
}

import { siteConfig } from "@/lib/site-config";

export const defaultWhatsAppMessage =
  "Hi BuzzCraft, I would like to talk about growing my business.";

export function whatsAppHref(message: string = defaultWhatsAppMessage): string {
  return `${siteConfig.whatsappHref}?text=${encodeURIComponent(message)}`;
}

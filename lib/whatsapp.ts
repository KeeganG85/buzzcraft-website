import { siteConfig } from "./site-config";

/** Build a wa.me deep link with a URL-encoded prefilled message. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Page-aware opening messages. Keyed by route family. */
export const whatsappMessages = {
  default: "Hi BuzzCraft, I would like to talk about growing my business.",
  services: "Hi BuzzCraft, I would like to discuss your growth-system services.",
  sprint: "Hi BuzzCraft, I have a question about the BuzzCraft Sprint.",
  work: "Hi BuzzCraft, I would like to discuss a project similar to your work.",
  insights: "Hi BuzzCraft, I would like help applying this growth insight to my business.",
  tools: "Hi BuzzCraft, I used one of your tools and would like practical next steps.",
  scorecard: "Hi BuzzCraft, I have a question about the Search Visibility Scorecard.",
} as const;

export type WhatsAppContext = keyof typeof whatsappMessages;

"use client";

import { track } from "@/lib/analytics";
import { siteConfig, isVerified } from "@/lib/site-config";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";

/**
 * "Book a Call" CTA. Routes to the configured booking URL when verified;
 * falls back to WhatsApp so the page never links to a placeholder.
 */
export function BookingLink() {
  if (!isVerified(siteConfig.bookingUrl)) {
    return (
      <WhatsAppLink context="work" variant="primary">
        Book a Call on WhatsApp
      </WhatsAppLink>
    );
  }
  return (
    <a
      href={siteConfig.bookingUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={() => track("booking_click")}
      className="inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-6 font-semibold text-ink transition-colors hover:bg-gold-soft"
    >
      Book a Call
    </a>
  );
}

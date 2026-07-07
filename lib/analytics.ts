"use client";

/**
 * Consent-aware analytics helper.
 *
 * Events carry only non-personal context (page path, CTA id). Never pass
 * names, emails, phone numbers or form payloads into `props`.
 */

export type AnalyticsEvent =
  | "scorecard_view"
  | "scorecard_start"
  | "scorecard_submit"
  | "scorecard_error"
  | "whatsapp_click"
  | "sprint_view"
  | "sprint_payment_click"
  | "tool_click"
  | "case_study_open"
  | "insight_cta_click"
  | "booking_click";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    // Plausible is cookieless and respects consent by design; if a different
    // provider is wired in, gate this call on stored consent state first.
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page.
  }
}

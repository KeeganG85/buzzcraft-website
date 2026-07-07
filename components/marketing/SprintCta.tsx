"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";

/**
 * Sprint deposit CTA. When a verified Yoco hosted payment link is configured,
 * the primary action routes there; until then, WhatsApp is the primary path so
 * the page never sends anyone to a dead or unverified payment URL.
 */
export function SprintCta({
  yocoPaymentUrl,
  depositZAR,
}: {
  yocoPaymentUrl: string | null;
  depositZAR: number | null;
}) {
  useEffect(() => {
    track("sprint_view");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {yocoPaymentUrl ? (
        <>
          <a
            href={yocoPaymentUrl}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => track("sprint_payment_click")}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-6 font-semibold text-ink transition-colors hover:bg-gold-soft"
          >
            Pay Sprint Deposit{depositZAR ? <span className="tnum">&nbsp;· R{depositZAR.toLocaleString("en-ZA")}</span> : null}
          </a>
          <p className="text-sm text-mid">
            Secure payment hosted by Yoco. Your booking is confirmed once payment is verified on our
            side, and we'll message you the onboarding details on WhatsApp.
          </p>
          <WhatsAppLink context="sprint" variant="secondary">
            Ask a question first on WhatsApp
          </WhatsAppLink>
        </>
      ) : (
        <>
          <WhatsAppLink context="sprint" variant="primary">
            Book the Sprint on WhatsApp
          </WhatsAppLink>
          <p className="text-sm text-mid">
            We'll confirm scope, timing and the deposit with you directly, then send a secure Yoco
            payment link.
          </p>
        </>
      )}
    </div>
  );
}

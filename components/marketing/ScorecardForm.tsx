"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

type FieldErrors = Partial<Record<string, string>>;

const inputClass =
  "mt-1.5 block w-full rounded-md border border-line bg-charcoal px-4 py-3 text-base text-soft placeholder:text-dim focus-visible:outline-2 focus-visible:outline-gold aria-[invalid=true]:border-red-400";

export function ScorecardForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("scorecard_view");
  }, []);

  const onFirstInput = () => {
    if (!started.current) {
      started.current = true;
      track("scorecard_start");
    }
  };

  function validate(data: FormData): FieldErrors {
    const e: FieldErrors = {};
    if (!String(data.get("full_name") || "").trim()) e.full_name = "Enter your full name.";
    if (!String(data.get("business_name") || "").trim()) e.business_name = "Enter your business name.";
    const url = String(data.get("website_url") || "").trim();
    if (!url) e.website_url = "Enter your website address.";
    const wa = String(data.get("whatsapp") || "").replace(/[^\d+]/g, "");
    if (wa.replace(/\D/g, "").length < 9) e.whatsapp = "Enter a valid WhatsApp number.";
    const email = String(data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (data.get("privacy_consent") !== "on")
      e.privacy_consent = "Consent is required so we can prepare and send your Scorecard.";
    return e;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const fieldErrors = validate(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      errorSummaryRef.current?.focus();
      return;
    }

    setStatus("submitting");
    const params = new URLSearchParams(window.location.search);
    const payload = {
      full_name: String(data.get("full_name")),
      business_name: String(data.get("business_name")),
      website_url: String(data.get("website_url")),
      whatsapp: String(data.get("whatsapp")),
      email: String(data.get("email")),
      privacy_consent: true,
      marketing_opt_in: data.get("marketing_opt_in") === "on",
      company: String(data.get("company") || ""), // honeypot
      source_path: window.location.pathname,
      referrer: document.referrer || null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };

    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { errors?: FieldErrors } | null;
        if (body?.errors) setErrors(body.errors);
        throw new Error("Request failed");
      }
      track("scorecard_submit");
      router.push("/scorecard/thank-you");
    } catch {
      track("scorecard_error");
      setStatus("error");
      setServerError(
        "Something went wrong sending your details. Please try again, or WhatsApp us and we'll sort it out directly.",
      );
    } finally {
      setStatus((s) => (s === "submitting" ? "idle" : s));
    }
  }

  const errorList = Object.entries(errors);

  return (
    <form onSubmit={onSubmit} onInput={onFirstInput} noValidate className="space-y-5">
      {(errorList.length > 0 || serverError) && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-red-400/50 bg-red-950/40 p-4 text-sm"
        >
          <p className="font-semibold text-red-200">Please fix the following before submitting:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-red-200/90">
            {serverError ? <li>{serverError}</li> : null}
            {errorList.map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="block text-sm font-semibold">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!errors.full_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="business_name" className="block text-sm font-semibold">
          Business name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          autoComplete="organization"
          required
          aria-invalid={!!errors.business_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="website_url" className="block text-sm font-semibold">
          Website URL
        </label>
        <input
          id="website_url"
          name="website_url"
          type="url"
          inputMode="url"
          placeholder="https://yourbusiness.co.za"
          autoComplete="url"
          required
          aria-invalid={!!errors.website_url}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-semibold">
          WhatsApp number
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          placeholder="+27 82 000 0000"
          autoComplete="tel"
          required
          aria-invalid={!!errors.whatsapp}
          aria-describedby="whatsapp-hint"
          className={inputClass}
        />
        <p id="whatsapp-hint" className="mt-1.5 text-sm text-mid">
          We send your Scorecard link and one follow-up here. No spam.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          className={inputClass}
        />
      </div>

      {/* Honeypot — hidden from real people, tempting for bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <div className="flex items-start gap-3">
          <input
            id="privacy_consent"
            name="privacy_consent"
            type="checkbox"
            required
            aria-invalid={!!errors.privacy_consent}
            className="mt-1 h-5 w-5 shrink-0 accent-[#FFB300]"
          />
          <label htmlFor="privacy_consent" className="text-sm leading-relaxed text-soft">
            I consent to BuzzCraft using these details to prepare and contact me about my Search
            Visibility Scorecard, in line with the{" "}
            <Link href={siteConfig.privacyPolicyPath} className="underline underline-offset-4 hover:text-gold">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input
            id="marketing_opt_in"
            name="marketing_opt_in"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-[#FFB300]"
          />
          <label htmlFor="marketing_opt_in" className="text-sm leading-relaxed text-mid">
            Optional: send me occasional practical growth insights from BuzzCraft. I can unsubscribe
            at any time.
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gold px-6 font-semibold text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Get My Scorecard"}
      </button>
      <p className="text-sm text-mid">Scored out of 100. Free. Delivered within 48 hours.</p>
    </form>
  );
}

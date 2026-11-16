"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/primitives";

type Errors = Record<string, string>;

const fields = [
  { name: "full_name", label: "Your name", required: true, type: "text" },
  { name: "email", label: "Email", required: true, type: "email" },
  { name: "business_name", label: "Business name", required: true, type: "text" },
  { name: "website_url", label: "Website URL", required: false, type: "url", hint: "if you have one" },
] as const;

export function ScorecardForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    setErrors({});
    const form = new FormData(event.currentTarget);
    const payload = {
      full_name: form.get("full_name"),
      email: form.get("email"),
      business_name: form.get("business_name"),
      website_url: form.get("website_url"),
      headache: form.get("headache"),
      privacy_consent: form.get("privacy_consent") === "on",
      marketing_opt_in: form.get("marketing_opt_in") === "on",
      company: form.get("company"),
      source_path: "/scorecard/",
      referrer: document.referrer,
    };

    try {
      const res = await fetch("/api/scorecard/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        saved?: boolean;
        whatsappUrl?: string;
        errors?: Errors;
      };
      if (!res.ok || data.errors) {
        setErrors(data.errors ?? { form: "Something went wrong. Please try again." });
        setPending(false);
        return;
      }
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      const saved = data.saved ? "1" : "0";
      window.location.assign(`/scorecard/thank-you/?saved=${saved}`);
    } catch {
      setErrors({ form: "Something went wrong. Please try again, or WhatsApp us directly." });
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5" noValidate>
      <div className="absolute -left-[9999px] h-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-semibold">
            {field.label}
            {field.required ? <span className="text-gold"> *</span> : null}
            {"hint" in field ? <span className="font-normal text-mid"> ({field.hint})</span> : null}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            aria-invalid={errors[field.name] ? true : undefined}
            aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3 text-soft"
          />
          {errors[field.name] ? (
            <p id={`${field.name}-error`} className="mt-1 text-sm text-gold">
              {errors[field.name]}
            </p>
          ) : null}
        </div>
      ))}
      <div>
        <label htmlFor="headache" className="block text-sm font-semibold">
          What&apos;s your biggest growth headache right now?{" "}
          <span className="font-normal text-mid">(optional)</span>
        </label>
        <textarea
          id="headache"
          name="headache"
          rows={4}
          className="mt-2 w-full rounded-lg border border-white/15 bg-ink px-3 py-2 text-soft"
        />
      </div>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Consent (POPIA)</legend>
        <label className="flex min-h-11 items-start gap-3 text-sm leading-6">
          <input name="privacy_consent" type="checkbox" required className="mt-1" />
          <span>
            Required: I consent to BuzzCraft processing the details above to produce and send my
            Search Visibility Scorecard, in line with the <a className="text-gold" href="/privacy/">privacy policy</a> and
            POPIA.
          </span>
        </label>
        {errors.privacy_consent ? <p className="text-sm text-gold">{errors.privacy_consent}</p> : null}
        <label className="flex min-h-11 items-start gap-3 text-sm leading-6">
          <input name="marketing_opt_in" type="checkbox" className="mt-1" />
          <span>Optional: BuzzCraft may email me occasional practical growth advice. Unsubscribe any time.</span>
        </label>
      </fieldset>
      {errors.form ? <p className="text-sm text-gold">{errors.form}</p> : null}
      {notice ? <p className="text-sm text-mid">{notice}</p> : null}
      <button type="submit" className={buttonClass("primary")} disabled={pending}>
        {pending ? "Sending" : "Send my details via WhatsApp"}
      </button>
      <p className="text-sm leading-6 text-mid">
        Free means free. No card details, no obligation, no automated upsell sequence. Submitting
        opens WhatsApp with your details ready to send. A database copy is not stored yet.
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/primitives";

export function RegisterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [blocked, setBlocked] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setBlocked("");
    setErrors({});
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/prompt-os/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: form.get("first_name"),
        email: form.get("email"),
        business_name: form.get("business_name"),
        business_does: form.get("business_does"),
        privacy_consent: form.get("privacy_consent") === "on",
        marketing_opt_in: form.get("marketing_opt_in") === "on",
        company: form.get("company"),
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; errors?: Record<string, string> };
    if (data.errors) {
      setErrors(data.errors);
      setPending(false);
      return;
    }
    if (!res.ok || !data.ok) {
      setBlocked(data.error || "Registration could not be completed.");
      setPending(false);
      return;
    }
    window.location.assign("/120promptos/library/");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {(
        [
          ["first_name", "First name"],
          ["business_name", "Business name"],
          ["business_does", "What the business does"],
          ["email", "Work email"],
        ] as const
      ).map(([name, label]) => (
        <div key={name}>
          <label htmlFor={name} className="text-sm font-semibold">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={name === "email" ? "email" : "text"}
            required
            className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3"
          />
          {errors[name] ? <p className="mt-1 text-sm text-gold">{errors[name]}</p> : null}
        </div>
      ))}
      <label className="flex items-start gap-3 text-sm leading-6">
        <input name="privacy_consent" type="checkbox" className="mt-1" required />
        <span>
          Required: I consent to BuzzCraft storing these details to open The 120 Prompt OS, as described in the{" "}
          <a className="text-gold" href="/120promptos/privacy/">
            Prompt OS privacy notice
          </a>
          .
        </span>
      </label>
      {errors.privacy_consent ? <p className="text-sm text-gold">{errors.privacy_consent}</p> : null}
      <label className="flex items-start gap-3 text-sm leading-6">
        <input name="marketing_opt_in" type="checkbox" className="mt-1" />
        <span>Optional: BuzzCraft may email me about Prompt OS. This is separate from access.</span>
      </label>
      {blocked ? <p className="text-sm leading-6 text-gold">{blocked}</p> : null}
      <button className={buttonClass("primary")} type="submit" disabled={pending}>
        {pending ? "Opening" : "Get the Prompt OS free"}
      </button>
    </form>
  );
}

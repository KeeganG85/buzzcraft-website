"use client";

import { useState } from "react";
import {
  billingLabel,
  packageAmount,
  packages,
  type BillingMode,
  type PackageOffer,
} from "@/content/pricing";
import { formatZar } from "@/lib/money";

function PriceCard({ offer }: { offer: PackageOffer }) {
  const [mode, setMode] = useState<BillingMode>("once");
  const amount = packageAmount(offer, mode);
  const name = `${offer.id}-billing`;

  return (
    <article className="flex flex-col border-t-2 border-gold/70 pt-6">
      <p className="eyebrow">{offer.name}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{offer.promise}</h3>
      <fieldset className="mt-6">
        <legend className="sr-only">Billing for {offer.name}</legend>
        <div className="flex gap-2">
          {(
            [
              ["once", "Once-off"],
              ["monthly", "Monthly"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm ${
                mode === value ? "border-gold bg-gold text-ink" : "border-white/20 text-soft"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="tnum mt-6 min-h-24 text-4xl font-semibold tracking-tight">
        From {formatZar(amount)}
        <span className="mt-1 block text-base font-normal text-mid">
          {billingLabel(mode)}, excl. VAT
        </span>
      </p>
      <p className="sr-only" aria-live="polite">
        {offer.name}: from {formatZar(amount)} {billingLabel(mode)}, excl. VAT
      </p>
      {mode === "monthly" && offer.annualSaving != null ? (
        <p className="min-h-16 text-sm leading-6 text-mid">
          Annual plan: 2 months free, a saving of {formatZar(offer.annualSaving)}.
        </p>
      ) : (
        <p className="min-h-16 text-sm leading-6 text-mid">
          {mode === "once" ? "Once-off, from the figure above." : ""}
        </p>
      )}
      <ul className="mt-6 space-y-2 text-sm leading-6 text-soft">
        {offer.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function PriceCards() {
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {packages.map((offer) => (
        <PriceCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

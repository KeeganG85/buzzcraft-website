"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/primitives";

export function CaseStudyForm() {
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/studio/case-studies/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.get("slug"),
        client_name: form.get("client_name"),
        url: form.get("url"),
        location: form.get("location"),
        summary: form.get("summary"),
        observed: form.get("observed"),
        intent: "publish",
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setMessage(data.ok ? "Case study published." : data.error || "Not saved.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {(
        [
          ["client_name", "Client name"],
          ["slug", "Slug"],
          ["url", "Live site URL"],
          ["location", "Location"],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="block text-sm">
          <span className="font-semibold">{label}</span>
          <input name={name} required={name !== "location"} className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" />
        </label>
      ))}
      <label className="block text-sm">
        <span className="font-semibold">Summary, only what you can verify</span>
        <textarea name="summary" rows={3} className="mt-1 w-full rounded-lg border border-white/15 bg-ink px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">What the public site shows</span>
        <textarea name="observed" rows={4} className="mt-1 w-full rounded-lg border border-white/15 bg-ink px-3 py-2" />
      </label>
      {message ? <p className="text-sm text-mid">{message}</p> : null}
      <button className={buttonClass("primary")} type="submit">
        Publish case study
      </button>
    </form>
  );
}

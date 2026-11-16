"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/primitives";

export default function StudioLoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/studio/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setError(data.error || "Login failed.");
      setPending(false);
      return;
    }
    window.location.assign("/studio/");
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="text-3xl font-semibold">Studio</h1>
      <p className="mt-3 text-sm leading-6 text-mid">
        Private article builder. Publishing is a human action. There is no external writer on this page.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input name="email" type="email" required autoComplete="username" className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input name="password" type="password" required autoComplete="current-password" className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" />
        </label>
        {error ? <p className="text-sm text-gold">{error}</p> : null}
        <button className={buttonClass("primary")} type="submit" disabled={pending}>
          {pending ? "Checking" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

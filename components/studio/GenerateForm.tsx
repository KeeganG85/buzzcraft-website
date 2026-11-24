"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/primitives";

const actions = [
  ["ideas", "Ideas"],
  ["brief", "Brief"],
  ["outline", "Outline"],
  ["draft", "Full draft"],
] as const;

type Result = {
  ok?: boolean;
  error?: string;
  retry?: boolean;
  saved?: boolean;
  articleId?: string;
  status?: string;
  knowledge?: string;
  suggestion?: string;
  sources?: { title: string; url: string; claim: string; verified: boolean }[];
  result?: unknown;
};

export function GenerateForm() {
  const [topic, setTopic] = useState("");
  const [headline, setHeadline] = useState("");
  const [audience, setAudience] = useState("South African businesses");
  const [notes, setNotes] = useState("");
  const [urls, setUrls] = useState("");
  const [pending, setPending] = useState(false);
  const [payload, setPayload] = useState<Result | null>(null);
  const [lastAction, setLastAction] = useState<(typeof actions)[number][0] | null>(null);

  async function run(action: (typeof actions)[number][0]) {
    setPending(true);
    setLastAction(action);
    const res = await fetch("/api/studio/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        topic,
        headline,
        audience,
        notes,
        urls: urls.split(/\s+/).map((url) => url.trim()).filter(Boolean),
      }),
    });
    const body = (await res.json()) as Result;
    setPayload(body);
    setPending(false);
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-semibold">Topic</span>
        <input className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" value={topic} onChange={(event) => setTopic(event.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Working headline</span>
        <input className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" value={headline} onChange={(event) => setHeadline(event.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Audience</span>
        <input className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" value={audience} onChange={(event) => setAudience(event.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Notes</span>
        <textarea className="mt-2 w-full rounded-lg border border-white/15 bg-ink px-3 py-2" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Reference URLs, one per line</span>
        <textarea className="mt-2 w-full rounded-lg border border-white/15 bg-ink px-3 py-2" rows={3} value={urls} onChange={(event) => setUrls(event.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2">
        {actions.map(([action, label]) => (
          <button key={action} type="button" className={buttonClass(action === "draft" ? "primary" : "secondary")} disabled={pending} onClick={() => void run(action)}>
            {label}
          </button>
        ))}
      </div>
      {payload ? (
        <div className="space-y-3 border-t border-white/10 pt-4" aria-live="polite">
          {payload.error ? <p className="text-sm text-gold">{payload.error}</p> : null}
          {payload.retry && lastAction ? (
            <button type="button" className={buttonClass("secondary")} disabled={pending} onClick={() => void run(lastAction)}>
              Try again
            </button>
          ) : null}
          {payload.knowledge ? <p className="text-sm text-mid">{payload.knowledge}</p> : null}
          {payload.saved && payload.articleId ? (
            <p className="text-sm">
              Saved as a draft.{" "}
              <Link className="text-gold" href={`/studio/articles/${payload.articleId}/`}>
                Open the editor
              </Link>
            </p>
          ) : null}
          {payload.sources && payload.sources.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {payload.sources.map((source) => (
                <li key={source.url}>
                  {source.title}: {source.url}. {source.claim} {source.verified ? "" : "Unverified."}
                </li>
              ))}
            </ul>
          ) : null}
          {payload.result ? (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-white/15 bg-ink p-3 text-sm">
              {JSON.stringify(payload.result, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/primitives";

const actions = [
  ["rewrite", "Rewrite"],
  ["expand", "Expand"],
  ["shorten", "Shorten"],
] as const;

export function AiRevision({
  articleId,
  getText,
  onAccepted,
}: {
  articleId: string;
  getText: () => string;
  onAccepted: (text: string) => void;
}) {
  const [suggestion, setSuggestion] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function ask(action: (typeof actions)[number][0]) {
    setPending(true);
    setMessage("");
    setSuggestion("");
    const res = await fetch("/api/studio/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, selection: getText(), topic: "Revision" }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string; suggestion?: string };
    setPending(false);
    if (!res.ok || !body.ok || !body.suggestion) {
      setMessage(body.error || "Generation failed. Try again.");
      return;
    }
    setSuggestion(body.suggestion);
    setMessage("Review the suggestion. Nothing has replaced your text.");
  }

  async function accept() {
    if (!articleId || !suggestion) return;
    setPending(true);
    const res = await fetch("/api/studio/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rewrite", accept: true, articleId, text: suggestion }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string };
    setPending(false);
    if (!res.ok || !body.ok) {
      setMessage(body.error || "The suggestion was not saved.");
      return;
    }
    onAccepted(suggestion);
    setSuggestion("");
    setMessage("Suggestion saved into the draft. The live article was not replaced.");
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold">Revise with AI</h3>
      <p className="text-sm leading-6 text-mid">
        A suggestion stays here until you accept it. Save draft still works when generation is not configured.
      </p>
      {!articleId ? <p className="text-sm text-mid">Save a draft before accepting a suggestion.</p> : null}
      <div className="flex flex-wrap gap-2">
        {actions.map(([action, label]) => (
          <button key={action} type="button" className={buttonClass("secondary")} disabled={pending} onClick={() => void ask(action)}>
            {label}
          </button>
        ))}
      </div>
      {suggestion ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Suggestion</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-white/15 bg-ink p-3 text-sm">{suggestion}</pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass("primary")} disabled={pending || !articleId} onClick={() => void accept()}>
              Accept
            </button>
            <button type="button" className={buttonClass("secondary")} onClick={() => { setSuggestion(""); setMessage("Suggestion dismissed."); }}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      {message ? <p className="text-sm text-mid" aria-live="polite">{message}</p> : null}
    </div>
  );
}

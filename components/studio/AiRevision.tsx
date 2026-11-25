"use client";

import { useRef, useState } from "react";
import { buttonClass } from "@/components/ui/primitives";
import { sameRevisionContext, type RevisionContext } from "@/lib/studio-revision";

const actions = [
  ["rewrite", "Rewrite"],
  ["expand", "Expand"],
  ["shorten", "Shorten"],
] as const;

export function AiRevision({
  getContext,
  onAccepted,
}: {
  getContext: () => RevisionContext;
  onAccepted: (text: string, context: RevisionContext) => boolean;
}) {
  const [suggestion, setSuggestion] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const contextRef = useRef<RevisionContext | null>(null);
  const requestRef = useRef(0);

  async function ask(action: (typeof actions)[number][0]) {
    const context = getContext();
    if (!context.text.trim()) {
      setMessage("Select some text before asking for a revision.");
      return;
    }
    if (context.text.length > 8000) {
      setMessage("Selected text is over the 8,000-character limit. Select a smaller section.");
      return;
    }
    const requestId = ++requestRef.current;
    contextRef.current = context;
    setPending(true);
    setMessage("");
    setSuggestion("");
    try {
      const res = await fetch("/api/studio/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, selection: context.text, topic: "Revision" }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; suggestion?: string };
      if (requestId !== requestRef.current) return;
      setPending(false);
      if (!sameRevisionContext(context, getContext())) {
        contextRef.current = null;
        setMessage("The document or selection changed while the revision was running. Request a new suggestion.");
        return;
      }
      if (!res.ok || !body.ok || !body.suggestion) {
        setMessage(body.error || "Generation failed. Try again.");
        return;
      }
      setSuggestion(body.suggestion);
      setMessage("Review the suggestion. Nothing has replaced your text.");
    } catch {
      if (requestId === requestRef.current) {
        setPending(false);
        setMessage("Generation failed. Try again.");
      }
    }
  }

  function accept() {
    const context = contextRef.current;
    if (!context || !suggestion) return;
    if (!sameRevisionContext(context, getContext()) || !onAccepted(suggestion, context)) {
      contextRef.current = null;
      setSuggestion("");
      setMessage("The document or selection changed. The suggestion was not applied; request a new one.");
      return;
    }
    contextRef.current = null;
    setSuggestion("");
    setMessage("Suggestion applied to the selected text. The full draft will save automatically.");
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold">Revise with AI</h3>
      <p className="text-sm leading-6 text-mid">
        A suggestion stays here until you accept it. Accepting replaces only the selected text; the full draft then saves normally.
      </p>
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
            <button type="button" className={buttonClass("primary")} disabled={pending} onClick={accept}>Accept</button>
            <button type="button" className={buttonClass("secondary")} onClick={() => { contextRef.current = null; setSuggestion(""); setMessage("Suggestion dismissed."); }}>Dismiss</button>
          </div>
        </div>
      ) : null}
      {message ? <p className="text-sm text-mid" aria-live="polite">{message}</p> : null}
    </div>
  );
}

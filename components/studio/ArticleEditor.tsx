"use client";

import { useState } from "react";
import type { ArticleRecord } from "@/lib/studio";
import { buttonClass } from "@/components/ui/primitives";

const fields: { name: keyof ArticleRecord; label: string; area?: boolean }[] = [
  { name: "title", label: "Title" },
  { name: "h1", label: "H1" },
  { name: "slug", label: "Slug" },
  { name: "excerpt", label: "Excerpt", area: true },
  { name: "author", label: "Author" },
  { name: "category", label: "Category" },
  { name: "body", label: "Body", area: true },
  { name: "hero_image", label: "Hero image path" },
  { name: "hero_alt", label: "Hero alt text" },
  { name: "publish_date", label: "Publish date" },
  { name: "seo_title", label: "SEO title" },
  { name: "meta_description", label: "Meta description", area: true },
  { name: "canonical", label: "Canonical URL" },
  { name: "og_title", label: "Open Graph title" },
  { name: "og_description", label: "Open Graph description", area: true },
  { name: "focus_phrase", label: "Focus phrase (guidance only)" },
  { name: "source_note", label: "Source note: title, URL, date, claim supported", area: true },
];

export function ArticleEditor({ initial }: { initial?: Partial<ArticleRecord> }) {
  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function send(intent: "save" | "publish", form: HTMLFormElement) {
    setPending(true);
    setIssues([]);
    setMessage("");
    const data = new FormData(form);
    const payload: Record<string, unknown> = { intent, id: initial?.id ?? "" };
    for (const field of fields) payload[field.name] = String(data.get(field.name) ?? "");
    payload.tags = String(data.get("tags") ?? "");
    payload.claims_checked = data.get("claims_checked") === "on";
    const res = await fetch("/api/studio/articles/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string; issues?: string[]; article?: { id: string } };
    if (body.issues) setIssues(body.issues);
    if (!res.ok || !body.ok) setMessage(body.error || "Not saved.");
    else setMessage(intent === "publish" ? "Published." : "Draft saved.");
    setPending(false);
    if (body.article?.id && !initial?.id) window.location.assign(`/studio/articles/${body.article.id}/`);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void send("save", event.currentTarget);
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className="block text-sm">
          <span className="font-semibold">{field.label}</span>
          {field.area ? (
            <textarea
              name={field.name}
              defaultValue={String(initial?.[field.name] ?? "")}
              rows={field.name === "body" ? 12 : 3}
              className="mt-2 w-full rounded-lg border border-white/15 bg-ink px-3 py-2"
            />
          ) : (
            <input
              name={field.name}
              defaultValue={String(initial?.[field.name] ?? "")}
              className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3"
            />
          )}
        </label>
      ))}
      <label className="block text-sm">
        <span className="font-semibold">Tags, comma separated</span>
        <input name="tags" defaultValue={(initial?.tags ?? []).join(", ")} className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input name="claims_checked" type="checkbox" defaultChecked={initial?.claims_checked === true} className="mt-1" />
        <span>I have checked every factual claim against the source note. This is not an SEO score.</span>
      </label>
      {issues.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-gold">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}
      {message ? <p className="text-sm text-mid">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className={buttonClass("secondary")} type="submit" disabled={pending}>
          Save draft
        </button>
        <button
          className={buttonClass("primary")}
          type="button"
          disabled={pending}
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) void send("publish", form);
          }}
        >
          Publish
        </button>
      </div>
    </form>
  );
}

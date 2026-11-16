"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { promptCategories } from "@/content/prompt-os/categories";
import type { PromptCategoryId } from "@/content/prompt-os/catalogue";

export type LibraryItem = {
  id: string;
  category: PromptCategoryId;
  title: string;
  purpose: string;
  instruction?: string;
};

export function LibraryBrowser({
  items,
  firstName,
}: {
  items: LibraryItem[];
  firstName?: string;
}) {
  const unlocked = items.some((item) => item.instruction);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PromptCategoryId | "all">("all");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        (item.instruction?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, query, category]);

  const active = list.find((item) => item.id === activeId) ?? list[0];

  return (
    <div>
      <p className="max-w-2xl leading-7 text-mid">
        {unlocked
          ? `Welcome${firstName ? `, ${firstName}` : ""}. Copy a prompt, replace the brackets, and paste it into the assistant you already use.`
          : "Register to unlock the full prompt bodies. Titles and purposes stay visible so you can see the operating system."}
      </p>
      {!unlocked ? (
        <div className="mt-6 flex flex-wrap items-center gap-4 border border-white/10 bg-surface p-5">
          <p className="flex-1 text-sm leading-6 text-mid">
            Instant access opens every prompt with its purpose, the full instruction, and the expected output. The instruction is rendered on the server after registration. It is not in the public page script.
          </p>
          <Link href="/120promptos/register/" className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-ink">
            Unlock Prompt OS
          </Link>
        </div>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search prompts"
          placeholder="Search prompts"
          className="min-h-11 flex-1 rounded-lg border border-white/15 bg-ink px-3"
        />
        <p className="tnum self-center text-sm text-mid">{list.length} prompts</p>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <FilterChip label="All" on={category === "all"} onClick={() => setCategory("all")} />
        {promptCategories.map((item) => (
          <FilterChip
            key={item.id}
            label={item.name}
            on={category === item.id}
            onClick={() => setCategory(item.id)}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ul className="max-h-[70vh] space-y-2 overflow-auto">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`w-full rounded-lg px-4 py-3 text-left ${
                  active?.id === item.id ? "bg-gold/15" : "bg-surface"
                }`}
              >
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-mid">{item.purpose}</span>
              </button>
            </li>
          ))}
        </ul>
        <article className="lg:sticky lg:top-24 lg:self-start">
          {active ? (
            <>
              <h2 className="text-2xl font-semibold">{active.title}</h2>
              <p className="mt-3 leading-7 text-mid">{active.purpose}</p>
              {active.instruction ? (
                <>
                  <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-lg bg-ink p-4 text-sm leading-6 text-soft">
                    {active.instruction}
                  </pre>
                  <button
                    type="button"
                    className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm"
                    onClick={() => navigator.clipboard.writeText(active.instruction ?? "")}
                  >
                    Copy prompt
                  </button>
                </>
              ) : (
                <p className="mt-6 text-sm leading-6 text-mid">
                  The full instruction stays on the server until you register.
                </p>
              )}
            </>
          ) : (
            <p className="text-mid">No prompts match that search.</p>
          )}
        </article>
      </div>
    </div>
  );
}

function FilterChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm ${
        on ? "border-gold bg-gold text-ink" : "border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

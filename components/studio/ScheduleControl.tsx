"use client";

import { useState } from "react";
import { johannesburgLabel, utcToJohannesburgInput } from "@/lib/studio-time";
import { buttonClass } from "@/components/ui/primitives";

export function ScheduleControl({
  articleId,
  scheduledAt,
  cronConfigured,
}: {
  articleId: string;
  scheduledAt?: string | null;
  cronConfigured: boolean;
}) {
  const [value, setValue] = useState(scheduledAt ? utcToJohannesburgInput(scheduledAt) : "");
  const [message, setMessage] = useState("");

  async function save() {
    if (!articleId) return;
    const res = await fetch("/api/studio/articles/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "schedule", id: articleId, scheduled_local: value }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string; scheduled_at?: string; cronConfigured?: boolean };
    if (!res.ok || !body.ok || !body.scheduled_at) {
      setMessage(body.error || "The schedule was not stored.");
      return;
    }
    const when = johannesburgLabel(body.scheduled_at);
    setMessage(
      body.cronConfigured
        ? `Scheduled for ${when} SAST. It publishes only when that time arrives.`
        : `Scheduled for ${when} SAST. The date is stored. It will not run until CRON_SECRET is set.`,
    );
  }

  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold">Schedule</h3>
      <p className="text-sm leading-6 text-mid">Times are Africa/Johannesburg. The article stays unpublished until the scheduled time.</p>
      {!cronConfigured ? (
        <p className="text-sm leading-6 text-mid">CRON_SECRET is not set, so a saved time will not run.</p>
      ) : null}
      {!articleId ? <p className="text-sm text-mid">Save a draft before scheduling.</p> : null}
      <label className="block text-sm font-semibold">
        Date and time
        <input
          type="datetime-local"
          className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <button type="button" className={buttonClass("secondary")} disabled={!articleId || !value} onClick={() => void save()}>
        Save schedule
      </button>
      {message ? (
        <p className="text-sm text-mid" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}

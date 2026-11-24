"use client";

export default function StudioError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-2xl font-semibold">Studio could not be loaded</h1>
      <p className="mt-3 text-sm leading-6 text-mid">
        The page failed before the articles could be read. Nothing was published.
      </p>
      <button
        type="button"
        className="mt-6 min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}

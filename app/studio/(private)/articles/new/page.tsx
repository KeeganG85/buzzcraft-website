import { EditorLoader } from "@/components/studio/EditorLoader";

export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold">New article</h1>
      <p className="mt-3 text-sm leading-6 text-mid">
        A draft saves on its own. Publish stays a separate step, and it waits until the checklist is clear.
      </p>
      <div className="mt-8">
        <EditorLoader cronConfigured={Boolean(process.env.CRON_SECRET?.trim())} />
      </div>
    </div>
  );
}

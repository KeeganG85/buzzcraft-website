import { GenerateForm } from "@/components/studio/GenerateForm";

export const dynamic = "force-dynamic";

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold">Generate</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mid">
        Ideas, a brief, an outline, or a full draft. A full draft is saved as a draft and is not published.
        If generation is not configured, these actions say so, and the article editor can still save.
      </p>
      <div className="mt-8">
        <GenerateForm />
      </div>
    </div>
  );
}

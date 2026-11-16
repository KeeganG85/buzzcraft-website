import { ArticleEditor } from "@/components/studio/ArticleEditor";

export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold">New article</h1>
      <p className="mt-3 text-sm leading-6 text-mid">
        Save a draft first. Publish stays disabled by the checklist until the metadata and source note are in place.
      </p>
      <div className="mt-8">
        <ArticleEditor />
      </div>
    </div>
  );
}

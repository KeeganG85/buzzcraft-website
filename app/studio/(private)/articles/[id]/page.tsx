import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/studio/ArticleEditor";
import { publishChecklist } from "@/lib/studio";
import { getArticle, listArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();
  const others = ((await listArticles()) ?? []).filter((item) => item.id !== article.id).map((item) => item.slug);
  const issues = publishChecklist(article, others);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-sm text-mid">{article.status}</p>
      <h1 className="mt-2 text-3xl font-semibold">Edit article</h1>
      <p className="mt-3">
        <Link className="text-gold" href={`/studio/preview/${article.id}/`}>
          Preview
        </Link>
      </p>
      {issues.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-mid">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-mid">Checklist is clear. A person can publish.</p>
      )}
      <div className="mt-8">
        <ArticleEditor initial={article} />
      </div>
    </div>
  );
}

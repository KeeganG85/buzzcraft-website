import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorLoader } from "@/components/studio/EditorLoader";
import { getWorkingArticle, listArticles, listPublishedArticles } from "@/lib/studio-store";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getWorkingArticle(id);
  if (!article) notFound();
  const [stored, published] = await Promise.all([listArticles(), listPublishedArticles()]);
  const otherSlugs = (stored ?? []).filter((item) => item.id !== article.id).map((item) => item.slug);
  const publishedArticles = published
    .filter((item) => item.slug !== article.slug)
    .map((item) => ({ slug: item.slug, title: item.title }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-mid">{article.status}</p>
          <h1 className="mt-2 text-3xl font-semibold">Edit article</h1>
        </div>
        <Link className="min-h-11 text-gold" href={`/studio/preview/${article.id}/`}>
          Preview
        </Link>
      </div>
      <div className="mt-8">
        <EditorLoader initial={article} publishedArticles={publishedArticles} otherSlugs={otherSlugs} />
      </div>
    </div>
  );
}

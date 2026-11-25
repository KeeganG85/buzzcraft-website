import { notFound } from "next/navigation";
import { getWorkingArticle } from "@/lib/studio-store";
import { docToHtml } from "@/lib/studio-doc";

export const dynamic = "force-dynamic";

export default async function PreviewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getWorkingArticle(id);
  if (!article) notFound();
  const bodyHtml = docToHtml(article.doc);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-sm text-gold">Preview. {article.status === "published" ? "Published" : "Not public."}</p>
      <h1 className="mt-4 text-4xl font-semibold">{article.h1 || article.title}</h1>
      <p className="mt-4 text-mid">{article.excerpt}</p>
      {article.hero_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.hero_image} alt={article.hero_alt} className="mt-6 max-w-full" />
      ) : null}
      <div className="mt-8 space-y-4 leading-7" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <p className="mt-8 text-sm text-mid">Source note: {article.source_note || "Missing."}</p>
    </article>
  );
}

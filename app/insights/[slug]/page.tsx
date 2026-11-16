import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { getInsight } from "@/content/insights";
import { listPublishedArticles } from "@/lib/studio-store";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const local = getInsight(slug);
  if (local) {
    return pageMetadata({ title: local.title, description: local.description, path: `/insights/${slug}` });
  }
  const remote = (await listPublishedArticles()).find((item) => item.slug === slug);
  if (!remote) return {};
  return pageMetadata({
    title: remote.seo_title || remote.title,
    description: remote.meta_description || remote.excerpt,
    path: `/insights/${slug}`,
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const local = getInsight(slug);
  if (local) {
    return (
      <Container className="py-16">
        <p className="text-sm text-mid">{local.category}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">{local.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-mid">{local.directAnswer}</p>
        {local.sections.map((section) => (
          <section key={section.heading} className="mt-10 max-w-2xl">
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 leading-7 text-mid">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </Container>
    );
  }

  const remote = (await listPublishedArticles()).find((item) => item.slug === slug);
  if (!remote) notFound();
  const paragraphs = remote.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return (
    <Container className="py-16">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">{remote.h1 || remote.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-mid">{remote.excerpt}</p>
      <div className="mt-8 max-w-2xl space-y-4 leading-7">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8 text-xs text-mid">Canonical {remote.canonical || absoluteUrl(`/insights/${slug}`)}</p>
    </Container>
  );
}

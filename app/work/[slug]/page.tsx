import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { caseStudies } from "@/content/case-studies";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};
  return pageMetadata({ title: study.name, description: study.situation, path: `/work/${slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  return (
    <Container className="py-16 md:py-24">
      <p className="text-sm text-mid">
        {study.category} · {study.location}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{study.name}</h1>
      {study.label ? <p className="mt-2 text-sm text-mid">{study.label}</p> : null}
      <h2 className="mt-8 text-2xl font-semibold">The situation</h2>
      <p className="mt-3 max-w-2xl leading-7 text-mid">{study.situation}</p>
      <h2 className="mt-8 text-2xl font-semibold">The system we built</h2>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-mid">
        {study.built.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl font-semibold">What changed</h2>
      <p className="mt-3 max-w-2xl leading-7 text-mid">{study.changed}</p>
      <p className="mt-4 text-sm text-mid">Pillar: {study.pillar}</p>
      <p className="mt-6 flex flex-wrap gap-4">
        <a className="font-semibold text-gold" href={study.href}>
          Visit the live site
        </a>
        <Link className="font-semibold text-gold" href="/work/">
          All work
        </Link>
      </p>
    </Container>
  );
}

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
  return pageMetadata({ title: study.name, description: study.summary, path: `/work/${slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  return (
    <Container className="py-16 md:py-24">
      <p className="text-sm text-mid">{study.location}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{study.name}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">{study.summary}</p>
      <h2 className="mt-10 text-2xl font-semibold">What the public site shows</h2>
      <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-mid">
        {study.observed.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-8 max-w-2xl text-sm leading-6 text-mid">{study.sourceNote}</p>
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

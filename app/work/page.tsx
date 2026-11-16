import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { caseStudies } from "@/content/case-studies";
import { listPublishedCaseStudies } from "@/lib/studio-store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Case notes for Nativ Genetix Soweto and CZApay, limited to what their public sites show. No invented metrics.",
  path: "/work",
});

export default async function WorkPage() {
  const extra = await listPublishedCaseStudies();

  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Work</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        Two live sites. No invented numbers.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        These notes say what the public sites stated on 16 November 2026. They do not claim a
        percentage, a ranking or a revenue result. Further studies can be added in Studio.
      </p>
      <div className="mt-12 space-y-12">
        {caseStudies.map((study) => (
          <article key={study.slug} className="border-t border-white/10 pt-8">
            <p className="text-sm text-mid">{study.location}</p>
            <h2 className="mt-2 text-3xl font-semibold">
              <Link href={`/work/${study.slug}/`} className="hover:text-gold">
                {study.name}
              </Link>
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-mid">{study.summary}</p>
            <a href={study.href} className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold">
              Visit the live site
            </a>
          </article>
        ))}
        {extra.map((study) => (
          <article key={study.id} className="border-t border-white/10 pt-8">
            <p className="text-sm text-mid">{study.location}</p>
            <h2 className="mt-2 text-3xl font-semibold">{study.client_name}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-mid">{study.summary}</p>
            <a href={study.url} className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold">
              Visit the live site
            </a>
          </article>
        ))}
      </div>
    </Container>
  );
}

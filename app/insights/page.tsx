import Link from "next/link";
import { Mascot } from "@/components/brand/Mascot";
import { Container } from "@/components/ui/primitives";
import { getPublishedInsights } from "@/content/insights";
import { listPublishedArticles } from "@/lib/studio-store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Insights",
  description: "Notes from BuzzCraft on growth systems, visibility and lead paths. Drafts stay unpublished.",
  path: "/insights",
});

export default async function InsightsPage() {
  const local = getPublishedInsights();
  const remote = await listPublishedArticles();

  return (
    <Container className="py-16 md:py-24">
      <div className="grid items-end gap-8 md:grid-cols-[1fr_14rem]">
        <div>
          <p className="eyebrow">Insights</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Notes, once a person publishes them.</h1>
        </div>
        <Mascot pose="reading" className="mx-auto w-full max-w-[14rem]" />
      </div>
      <p className="mt-6 max-w-2xl leading-7 text-mid">
        Articles are drafted in Studio and appear here only after a human publishes them. The three July drafts are
        still in review, so they are not listed.
      </p>
      <ul className="mt-10 space-y-6">
        {local.map((item) => (
          <li key={item.slug}>
            <Link href={`/insights/${item.slug}/`} className="text-xl font-semibold text-gold">
              {item.title}
            </Link>
            <p className="mt-2 text-sm text-mid">{item.description}</p>
          </li>
        ))}
        {remote.map((item) => (
          <li key={item.id}>
            <Link href={`/insights/${item.slug}/`} className="text-xl font-semibold text-gold">
              {item.title}
            </Link>
            <p className="mt-2 text-sm text-mid">{item.excerpt}</p>
          </li>
        ))}
      </ul>
      {local.length + remote.length === 0 ? (
        <p className="mt-8 text-mid">Nothing is published yet.</p>
      ) : null}
    </Container>
  );
}

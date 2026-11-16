import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Websites, search visibility and lead systems for South African service businesses. Three pillars, one connected system.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Services</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        We do not sell channels. We build the connections between them.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        BuzzCraft starts from who you serve, makes the business visible where buyers actually look,
        and fixes the path so attention can become an enquiry. Three pillars, written for South
        African service businesses across industries.
      </p>
      <ol className="mt-14 space-y-12">
        {services.map((service, index) => (
          <li key={service.slug} className="grid gap-6 border-t border-white/10 pt-10 md:grid-cols-[8rem_1fr]">
            <p className="tnum text-3xl text-gold">0{index + 1}</p>
            <div>
              <h2 className="text-3xl font-semibold">{service.nav}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-mid">{service.lede}</p>
              <Link href={service.href} className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold">
                Read {service.nav}
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-16 max-w-2xl leading-7 text-mid">
        Every serious engagement still starts with evidence: diagnose where visibility and leads leak,
        build the highest-impact fixes on a fixed scope, then decide together whether an ongoing
        partnership makes sense.
      </p>
    </Container>
  );
}
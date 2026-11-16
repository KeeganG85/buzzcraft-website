import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import type { ServicePage } from "@/content/services";
import { services } from "@/content/services";

export function ServiceArticle({ service }: { service: ServicePage }) {
  const others = services.filter((item) => item.slug !== service.slug);
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">{service.eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        {service.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">{service.lede}</p>
      <h2 className="mt-14 text-2xl font-semibold">What this includes</h2>
      <ul className="mt-4 max-w-2xl space-y-2 leading-7">
        {service.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-8 max-w-2xl leading-7 text-mid">{service.note}</p>
      <p className="mt-10 text-sm text-mid">
        <Link href="/services/" className="text-gold">
          All services
        </Link>
        {" · "}
        {others.map((item, index) => (
          <span key={item.slug}>
            {index > 0 ? " · " : null}
            <Link href={item.href} className="text-gold">
              {item.nav}
            </Link>
          </span>
        ))}
      </p>
    </Container>
  );
}

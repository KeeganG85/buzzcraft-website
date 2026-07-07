import { siteConfig, isVerified } from "./site-config";

/**
 * Safe JSON-LD helpers. Only verified facts from site-config are emitted.
 * No ratings, reviews, awards, addresses or opening hours are ever generated
 * here — those may only be added once real and publicly verifiable.
 */

type JsonLd = Record<string, unknown>;

/** Escape `<` so JSON can never break out of the script tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(): JsonLd {
  const sameAs = Object.values(siteConfig.social).filter(isVerified);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/buzzcraft-roundel.jpg`,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function professionalServiceJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/brand/buzzcraft-roundel.jpg`,
    description: siteConfig.description,
    areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "Place", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.countryCode,
    },
    knowsAbout: [
      "Growth strategy",
      "SEO",
      "Local search",
      "Generative engine optimisation",
      "Answer engine optimisation",
      "Conversion rate optimisation",
      "Marketing automation",
    ],
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-ZA",
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "Place", name })),
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function blogPostingJsonLd(input: {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  authorRole: string;
  coverImage: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt,
    image: `${siteConfig.url}${input.coverImage}`,
    url: `${siteConfig.url}/insights/${input.slug}`,
    mainEntityOfPage: `${siteConfig.url}/insights/${input.slug}`,
    author: { "@type": "Person", name: input.author, jobTitle: input.authorRole },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-ZA",
  };
}

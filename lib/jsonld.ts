import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalEntity.registeredName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/roundel.png`,
    image: `${siteConfig.url}/brand/og.png`,
    email: siteConfig.email,
    telephone: siteConfig.whatsappE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.countryCode,
    },
    founder: siteConfig.founders.map((person) => ({
      "@type": "Person",
      name: person.name,
    })),
    sameAs: siteConfig.social.map((profile) => profile.href),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: `${siteConfig.url}/`,
    publisher: { "@id": organizationId },
    inLanguage: "en-ZA",
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    areaServed: [
      { "@type": "City", name: siteConfig.city },
      { "@type": "AdministrativeArea", name: siteConfig.region },
      { "@type": "Country", name: siteConfig.country },
    ],
    provider: { "@id": organizationId },
    email: siteConfig.email,
    telephone: siteConfig.whatsappE164,
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

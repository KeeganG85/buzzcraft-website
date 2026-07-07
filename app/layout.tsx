import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site-config";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
  serializeJsonLd,
} from "@/lib/jsonld";

// DM Sans is self-hosted (variable weight 100–1000): no external font
// requests at build or run time, which is faster and POPIA-friendlier.
const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-latin-wght-normal.woff2", style: "normal", weight: "100 1000" },
    { path: "./fonts/dm-sans-latin-wght-italic.woff2", style: "italic", weight: "100 1000" },
  ],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Johannesburg Growth Systems Agency`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "growth systems agency",
    "Johannesburg marketing agency",
    "SEO South Africa",
    "conversion optimisation",
    "digital growth Gauteng",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={dmSans.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(professionalServiceJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(webSiteJsonLd()) }}
        />
      </body>
    </html>
  );
}

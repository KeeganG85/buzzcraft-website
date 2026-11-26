import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Honeycomb } from "@/components/brand/Honeycomb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionRoot } from "@/components/motion/MotionRoot";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  serializeJsonLd,
  webSiteJsonLd,
} from "@/lib/jsonld";
import { deploymentRobots } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-latin-wght-normal.woff2", style: "normal", weight: "100 1000" },
    { path: "./fonts/dm-sans-latin-wght-italic.woff2", style: "italic", weight: "100 1000" },
  ],
  display: "swap",
  variable: "--font-dm-sans",
});

const robots = deploymentRobots();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BuzzCraft: growth systems agency, Johannesburg",
    template: "%s | BuzzCraft",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  ...(robots ? { robots } : {}),
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_ZA",
    type: "website",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "BuzzCraft" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={dmSans.variable}>
      <body className="isolate relative">
        <Honeycomb />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <MotionRoot />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(webSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(professionalServiceJsonLd()) }}
        />
      </body>
    </html>
  );
}

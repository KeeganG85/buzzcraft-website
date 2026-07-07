"use client";

import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import type { WhatsAppContext } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

/**
 * WhatsApp-first contact block. Rendered on every route in place of a
 * separate Contact page.
 */
export function ContactFold({
  context = "default",
  heading = "Talk to a person, not a pipeline.",
  copy = "The fastest way to reach BuzzCraft is WhatsApp. Tell us where your growth feels stuck and we'll give you a straight answer, even if the answer is that you don't need us yet.",
}: {
  context?: WhatsAppContext;
  heading?: string;
  copy?: string;
}) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="border-t border-line bg-surface py-section">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              {siteConfig.city} · {siteConfig.region} · {siteConfig.country}
            </p>
            <h2 id="contact-heading" className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-mid">{copy}</p>
          </div>
          <div className="flex flex-col gap-4 sm:max-w-sm md:justify-self-end">
            <WhatsAppLink context={context} variant="primary">
              WhatsApp BuzzCraft
            </WhatsAppLink>
            <Link
              href="/scorecard"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-line px-6 font-semibold text-soft transition-colors hover:border-gold hover:text-gold"
            >
              Get My Scorecard
            </Link>
            <p className="text-sm text-mid">
              Prefer email?{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-medium text-soft underline underline-offset-4 hover:text-gold">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

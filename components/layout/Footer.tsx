import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { footerExplore } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

const tap =
  "inline-flex min-h-11 items-center text-sm text-soft hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function Footer() {
  const year = new Date().getFullYear();
  const { legalEntity } = siteConfig;

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 md:grid md:grid-cols-3 md:items-start md:gap-8 md:py-8">
        <div>
          <div className="flex items-center justify-between gap-3 md:block">
            <div className="min-w-0">
              <Wordmark height={26} />
              <p className="mt-2 text-sm font-semibold leading-5 text-soft">{legalEntity.registeredName}</p>
              <p className="text-sm leading-5 text-mid">{siteConfig.tagline}</p>
            </div>
            <ul className="flex shrink-0 gap-1 md:mt-4">
              {siteConfig.social.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.href}
                    aria-label={profile.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    <SocialIcon id={profile.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-2 max-w-sm text-sm leading-5 text-mid">
            A growth systems agency for ambitious South African businesses, based in {siteConfig.city},{" "}
            {siteConfig.region}.
          </p>
        </div>

        <nav aria-label="Explore" className="mt-4 md:mt-0">
          <p className="eyebrow">Explore</p>
          <ul className="mt-1 grid grid-cols-2 gap-x-4">
            {footerExplore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={tap}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-2 md:mt-0">
          <p className="eyebrow">Contact</p>
          <ul className="mt-1 flex flex-wrap md:block">
            <li>
              <a className={tap} href={siteConfig.whatsappHref}>
                WhatsApp {siteConfig.whatsappDisplay}
              </a>
            </li>
            <li>
              <a className={tap} href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <p className="inline-flex min-h-11 items-center text-sm text-mid">
                {siteConfig.city}, {siteConfig.region}, {siteConfig.country}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-3 text-xs leading-5 text-mid">
          © {year} {legalEntity.registeredName}. All rights reserved. VAT number:{" "}
          {legalEntity.vatNumber ?? "[owner input]"}. Company registration number:{" "}
          {legalEntity.registrationNumber ?? "[owner input]"}. Information Officer:{" "}
          {legalEntity.informationOfficer ?? "[owner input]"}.
        </p>
      </div>
    </footer>
  );
}

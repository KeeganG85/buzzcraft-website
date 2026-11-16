import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { footerExplore } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark height={34} />
          <p className="mt-4 text-sm font-semibold text-soft">{siteConfig.legalEntity.registeredName}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-mid">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-mid">
            A growth systems agency for ambitious South African businesses, based in {siteConfig.city},{" "}
            {siteConfig.region}.
          </p>
          <ul className="mt-5 flex gap-3">
            {siteConfig.social.map((profile) => (
              <li key={profile.id}>
                <a
                  href={profile.href}
                  aria-label={profile.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold hover:border-gold"
                >
                  <SocialIcon id={profile.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerExplore.length > 0 ? (
          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2">
              {footerExplore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-soft hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div />
        )}

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="text-soft hover:text-gold" href={siteConfig.whatsappHref}>
                WhatsApp {siteConfig.whatsappDisplay}
              </a>
            </li>
            <li>
              <a className="text-soft hover:text-gold" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            <li className="text-mid">
              {siteConfig.city}, {siteConfig.region}, {siteConfig.country}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-mid">
          © {new Date().getFullYear()} {siteConfig.legalEntity.registeredName}. All rights reserved.
          {" "}
          VAT number: {siteConfig.legalEntity.vatNumber ?? "[owner input]"}. Company registration
          number: {siteConfig.legalEntity.registrationNumber ?? "[owner input]"}. Information
          Officer: {siteConfig.legalEntity.informationOfficer ?? "[owner input]"}.
        </p>
      </div>
    </footer>
  );
}

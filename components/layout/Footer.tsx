import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { siteConfig, isVerified } from "@/lib/site-config";

const footerNav = [
  { href: "/services", label: "Services" },
  { href: "/sprint", label: "The Sprint" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/tools", label: "Free tools" },
  { href: "/scorecard", label: "Search Visibility Scorecard" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(siteConfig.social).filter(([, url]) => isVerified(url));

  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image src="/brand/buzzcraft-logo.png" alt="BuzzCraft" width={148} height={21} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mid">
              {siteConfig.tagline} A growth systems agency for ambitious South African businesses,
              based in {siteConfig.city}, {siteConfig.region}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">Explore</h2>
            <ul className="space-y-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-sm text-soft hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">Contact</h2>
            <ul className="space-y-1 text-sm text-soft">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="inline-flex min-h-10 items-center hover:text-gold">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-mid">
                {siteConfig.city}, {siteConfig.region}, {siteConfig.country}
              </li>
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex min-h-10 items-center capitalize hover:text-gold"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-mid sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="tnum">{year}</span> {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href={siteConfig.privacyPolicyPath} className="inline-flex min-h-10 items-center hover:text-gold">
              Privacy Policy (POPIA)
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

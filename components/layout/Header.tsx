import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { buttonClass } from "@/components/ui/primitives";
import { primaryNav } from "@/lib/nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="BuzzCraft home" className="shrink-0">
          <Wordmark height={32} />
        </Link>
        {primaryNav.length > 0 ? (
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-soft hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <WhatsAppLink className={buttonClass("primary")}>WhatsApp</WhatsAppLink>
      </div>
    </header>
  );
}

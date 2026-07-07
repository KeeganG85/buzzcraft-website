"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/sprint", label: "Sprint" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/tools", label: "Tools" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu on route change and return focus to the toggle.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; focus stays managed.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-charcoal/95 backdrop-blur-sm">
      <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex min-h-12 items-center" aria-label="BuzzCraft home">
          <Image
            src="/brand/buzzcraft-logo.png"
            alt="BuzzCraft"
            width={148}
            height={21}
            priority
          />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                pathname.startsWith(item.href) ? "text-gold" : "text-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/scorecard"
            className="inline-flex min-h-10 items-center rounded-md bg-gold px-4 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
          >
            Get My Scorecard
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md text-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open ? (
        <div ref={panelRef} id="mobile-nav" className="border-t border-line bg-surface px-5 py-4 md:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-12 items-center text-base font-medium text-soft hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/scorecard"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gold px-4 font-semibold text-ink"
              >
                Get My Scorecard
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

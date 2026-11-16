import Link from "next/link";

const links = [
  { href: "/120promptos/", label: "Prompt OS" },
  { href: "/120promptos/library/", label: "Library" },
  { href: "/120promptos/privacy/", label: "Privacy" },
  { href: "/120promptos/popia/", label: "POPIA" },
  { href: "/120promptos/terms/", label: "Terms" },
  { href: "/120promptos/contact/", label: "Contact" },
];

export function ProductNav() {
  return (
    <nav aria-label="Prompt OS" className="mb-10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="min-h-11 inline-flex items-center text-mid hover:text-gold">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

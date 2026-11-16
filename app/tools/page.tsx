import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tools",
  description:
    "The open FOUND prompt library, the gated 120 Prompt OS, and the free Search Visibility Scorecard.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Tools</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        Two prompt products, kept apart.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        FOUND is open. The 120 Prompt OS asks you to register before the full instructions load.
        The Scorecard is the free assessment. None of these replace a conversation.
      </p>
      <ol className="mt-12 space-y-10">
        <li className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold">Search Visibility Scorecard</h2>
          <p className="mt-3 max-w-2xl leading-7 text-mid">
            A 15-point review of how findable your business is on Google, local search and AI
            assistants, delivered free within 48 hours.
          </p>
          <Link href="/scorecard/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-gold">
            Get my Scorecard
          </Link>
        </li>
        <li className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold">FOUND prompt library</h2>
          <p className="mt-3 max-w-2xl leading-7 text-mid">
            35 prompts for South African owner-run service businesses. No email gate.
          </p>
          <Link href="/found/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-gold">
            Open FOUND
          </Link>
        </li>
        <li className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold">The 120 Prompt OS</h2>
          <p className="mt-3 max-w-2xl leading-7 text-mid">
            120 prompts across nine categories. Titles and purposes are public. Registration unlocks
            the full prompt bodies, which stay on the server.
          </p>
          <Link href="/120promptos/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-gold">
            See the 120 Prompt OS
          </Link>
        </li>
      </ol>
      <p className="mt-14 max-w-2xl text-sm leading-6 text-mid">
        The Local Website Blueprint Builder is a separate public tool:{" "}
        <a className="text-gold" href={siteConfig.blueprintUrl}>
          local-website-blueprint.vercel.app
        </a>
        .
      </p>
    </Container>
  );
}
import Link from "next/link";
import { Container, buttonClass } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">That page is not here.</h1>
      <p className="mt-4 max-w-xl text-mid">
        The link may be old, or the page has moved. Head home, or message BuzzCraft on WhatsApp.
      </p>
      <Link href="/" className={`${buttonClass("primary")} mt-8`}>
        Back to the homepage
      </Link>
    </Container>
  );
}

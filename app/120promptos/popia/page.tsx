import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "120 Prompt OS and POPIA",
  description: "How The 120 Prompt OS treats the Protection of Personal Information Act.",
  path: "/120promptos/popia",
});

export default function PromptPopiaPage() {
  return (
    <Container className="py-16">
      <ProductNav />
      <h1 className="text-4xl font-semibold">POPIA</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-7 text-mid">
        <p>
          BuzzCraft treats the Protection of Personal Information Act 4 of 2013 as the default for
          this library. Boxes are never pre-ticked.
        </p>
        <p>
          We process your name, work email, business name and a short description of the business to
          perform the request you made. Marketing email is a separate, optional consent.
        </p>
        <p>
          Do not paste special personal information, identity numbers, full medical files, or other
          people&apos;s data into an AI assistant unless you have a lawful basis and have read that
          assistant&apos;s terms.
        </p>
        <p>
          You remain responsible for how you use AI outputs with your customers. BuzzCraft is
          responsible for the information you give us to receive the library.
        </p>
        <p className="border border-gold/40 bg-surface p-4 text-sm">
          Information Officer: not published. The live Prompt OS page says those details will be
          pointed to as the commercial deployment is finalised. Until then, write to
          info@buzzcraft.co.za. This page is a summary, not legal advice.
        </p>
      </div>
    </Container>
  );
}
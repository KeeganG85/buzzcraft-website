import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "120 Prompt OS terms",
  description: "Terms for access to The 120 Prompt OS digital library.",
  path: "/120promptos/terms",
});

export default function PromptTermsPage() {
  return (
    <Container className="py-16">
      <ProductNav />
      <h1 className="text-4xl font-semibold">Terms</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-7 text-mid">
        <p>These terms cover access to The 120 Prompt OS, a digital library published by BuzzCraft.</p>
        <p>
          You receive a licence to use the prompts inside your own business, including with a small
          internal team. You may adapt bracketed fields. You may not resell, republish, or package
          the library as your own product.
        </p>
        <p>
          Prompts improve structure and drafting. They do not guarantee Google rankings, AI
          citations, revenue, or professional results in regulated work.
        </p>
        <p>
          You must review AI output before publishing or sending it. Health, legal, financial and
          similar content needs a qualified human. You own that decision.
        </p>
        <p>
          On this release, access is granted after registration is stored. There is no countdown
          timer and no published price. If a paid checkout is added later, the price shown at
          purchase is the price you pay.
        </p>
        <p>BuzzCraft, Johannesburg, South Africa. info@buzzcraft.co.za.</p>
      </div>
    </Container>
  );
}
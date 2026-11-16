import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "120 Prompt OS contact",
  description: "Contact BuzzCraft about The 120 Prompt OS.",
  path: "/120promptos/contact",
});

export default function PromptContactPage() {
  return (
    <Container className="py-16">
      <ProductNav />
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-4 max-w-xl leading-7 text-mid">
        BuzzCraft, Johannesburg, South Africa. For South African business owners and brands.
      </p>
      <p className="mt-6">
        <a className="text-gold" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
      </p>
      <p className="mt-4 text-sm text-mid">
        This page does not send a message for you. Use email, or the main{" "}
        <a className="text-gold" href="/contact/">
          contact page
        </a>
        .
      </p>
    </Container>
  );
}
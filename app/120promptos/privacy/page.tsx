import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "120 Prompt OS privacy",
  description: "How BuzzCraft handles personal information collected for The 120 Prompt OS.",
  path: "/120promptos/privacy",
});

export default function PromptPrivacyPage() {
  return (
    <Container className="py-16">
      <ProductNav />
      <h1 className="text-4xl font-semibold">Privacy</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-7 text-mid">
        <p>
          BuzzCraft is based in Johannesburg, South Africa. This notice covers personal information
          collected to open The 120 Prompt OS library.
        </p>
        <p>
          When you register we collect your first name, work email, business name, what the business
          does, and the consent you gave. We do not need your identity number, payment card or client
          lists.
        </p>
        <p>
          Registration storage is not connected. The SQL for it is in this repository and has not
          been applied. Until Keegan approves that migration and the server env vars, the library
          stays locked. We do not email the prompts from this site. Marketing email is a separate
          tick, and this site does not send that email itself.
        </p>
        <p>
          You may ask what we hold, correct it, or request deletion, subject to POPIA. Write to
          info@buzzcraft.co.za. You may also complain to the Information Regulator of South Africa.
        </p>
      </div>
    </Container>
  );
}
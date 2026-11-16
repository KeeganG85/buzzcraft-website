import { LibraryBrowser } from "@/components/prompt-os/LibraryBrowser";
import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container } from "@/components/ui/primitives";
import { buildPrompt, prompts } from "@/content/prompt-os/bodies.server";
import { publicPrompts } from "@/content/prompt-os/catalogue";
import { readPromptSession } from "@/lib/prompt-access";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "120 Prompt OS library",
  description:
    "Titles and purposes for all 120 prompts. Full instructions load only after registration.",
  path: "/120promptos/library",
});

export default async function LibraryPage() {
  const session = await readPromptSession();
  const items = session
    ? prompts.map((prompt) => ({
        id: prompt.id,
        category: prompt.category,
        title: prompt.title,
        purpose: prompt.purpose,
        instruction: buildPrompt(prompt),
      }))
    : publicPrompts.map((prompt) => ({ ...prompt }));

  return (
    <Container className="py-16 md:py-24">
      <ProductNav />
      <p className="eyebrow">Prompt library</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">The 120 Prompt OS</h1>
      <div className="mt-6">
        <LibraryBrowser items={items} firstName={session?.firstName} />
      </div>
    </Container>
  );
}
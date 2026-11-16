import Link from "next/link";
import { ProductNav } from "@/components/prompt-os/ProductNav";
import { Container, buttonClass } from "@/components/ui/primitives";
import { promptCategories } from "@/content/prompt-os/categories";
import { publicPrompts } from "@/content/prompt-os/catalogue";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The 120 Prompt OS",
  description:
    "120 practical AI prompts for South African business owners. Titles are public. Full instructions unlock after registration and stay on the server.",
  path: "/120promptos",
});

const faqs = [
  {
    q: "Do I need to know how to write AI prompts?",
    a: "No. The prompts provide the structure. You replace the brackets with your own verified business details.",
  },
  {
    q: "Which AI tools can I use?",
    a: "Prompt OS is written for major general-purpose assistants such as ChatGPT, Claude and Gemini.",
  },
  {
    q: "Is this only for marketing?",
    a: "No. It covers strategy, offers, sales, AI systems, decisions, learning and operations.",
  },
  {
    q: "Will these prompts guarantee rankings or revenue?",
    a: "No. They improve structure and drafting. They do not guarantee rankings, citations or revenue.",
  },
  {
    q: "Do I get access after I register?",
    a: "Yes, once the registration is stored. This build does not email you a copy. Access is the signed session on this browser.",
  },
];

export default function PromptOsPage() {
  return (
    <Container className="py-16 md:py-24">
      <ProductNav />
      <p className="eyebrow">BuzzCraft presents</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
        Stop asking AI random questions. Start running your business with it.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mid">
        The 120 Prompt OS gives South African business owners practical prompts for marketing, SEO,
        sales, AI visibility, automation, decisions and operations. You do not need to become an AI
        expert. Access is free after registration. There is no published price on this release.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/120promptos/register/" className={buttonClass("primary")}>
          Get the Prompt OS free
        </Link>
        <Link href="/120promptos/library/" className={buttonClass("secondary")}>
          See what is inside
        </Link>
      </div>
      <p className="tnum mt-10 text-sm text-mid">{publicPrompts.length} prompts across nine categories.</p>
      <ol className="mt-8 grid gap-6 md:grid-cols-2">
        {promptCategories.map((category, index) => {
          const count = publicPrompts.filter((prompt) => prompt.category === category.id).length;
          return (
            <li key={category.id} className="border-t border-white/10 pt-4">
              <p className="text-sm text-mid">
                0{index + 1} · {count} prompts
              </p>
              <h2 className="mt-1 text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-mid">{category.blurb}</p>
            </li>
          );
        })}
      </ol>
      <h2 className="mt-16 text-2xl font-semibold">How it works</h2>
      <ol className="mt-4 max-w-2xl list-decimal space-y-2 pl-5 leading-7 text-mid">
        <li>Choose the prompt that matches the job.</li>
        <li>Replace every bracket with a verified fact. Do not invent the inputs.</li>
        <li>Paste it into ChatGPT, Claude, Gemini, or the assistant you already pay for.</li>
        <li>Review the draft before you publish it. You make the decision.</li>
      </ol>
      <h2 className="mt-16 text-2xl font-semibold">Questions</h2>
      <div className="mt-4 max-w-2xl divide-y divide-white/10">
        {faqs.map((item) => (
          <div key={item.q} className="py-4">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 leading-7 text-mid">{item.a}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
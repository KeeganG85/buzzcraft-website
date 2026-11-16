import { Container } from "@/components/ui/primitives";
import { foundGroups, foundIntro, foundPrompts, foundRules } from "@/content/found";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The FOUND Prompt Library",
  description: foundIntro.lede,
  path: "/found",
});

export default function FoundPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="eyebrow">Free resource. No email required.</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        {foundIntro.title}
      </h1>
      <p className="mt-4 text-xl font-semibold">35 prompts. Zero fluff.</p>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mid">{foundIntro.lede}</p>
      <p className="mt-4 max-w-2xl leading-7 text-mid">{foundIntro.openNote}</p>
      <h2 className="mt-12 text-2xl font-semibold">Four rules before you paste anything</h2>
      <ul className="mt-4 max-w-2xl space-y-3 leading-7 text-mid">
        {foundRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      {foundGroups.map((group) => (
        <section key={group.letter} className="mt-14">
          <h2 className="text-2xl font-semibold">
            {group.letter}. {group.blurb}
          </h2>
          <div className="mt-6 space-y-4">
            {group.refs.map((ref) => {
              const prompt = foundPrompts.find((item) => item.ref === ref);
              if (!prompt) return null;
              return (
                <details key={prompt.ref} className="border-t border-white/10 py-4">
                  <summary className="cursor-pointer text-lg font-semibold">
                    {prompt.ref} {prompt.title}
                  </summary>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-soft">
                    {prompt.body}
                  </pre>
                  {prompt.note ? <p className="mt-3 text-sm leading-6 text-mid">{prompt.note}</p> : null}
                </details>
              );
            })}
          </div>
        </section>
      ))}
    </Container>
  );
}
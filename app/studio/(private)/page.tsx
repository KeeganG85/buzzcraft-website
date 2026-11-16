import Link from "next/link";
import { redirect } from "next/navigation";
import { CaseStudyForm } from "@/components/studio/CaseStudyForm";
import { insights } from "@/content/insights";
import { studioCookie } from "@/lib/studio";
import { listArticles, listCaseStudies } from "@/lib/studio-store";
import { storageConfigured } from "@/lib/studio";

export const dynamic = "force-dynamic";

export default async function StudioHomePage() {
  const articles = await listArticles();
  const studies = await listCaseStudies();

  async function logout() {
    "use server";
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    jar.set(studioCookie, "", { path: "/", maxAge: 0 });
    redirect("/studio/login/");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Studio</h1>
        <form action={logout}>
          <button className="min-h-11 text-sm text-gold" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-3 text-sm leading-6 text-mid">
        Drafts stay private. Publish is a separate button, and it refuses to run until the checklist is clear.
        Nothing here calls an external writing model.
      </p>
      {!storageConfigured() ? (
        <p className="mt-6 border border-gold/40 bg-surface p-4 text-sm leading-6">
          Supabase is not configured, so new articles and case studies cannot be stored. The three repository
          drafts below stay unpublished.
        </p>
      ) : null}

      <h2 className="mt-10 text-xl font-semibold">Repository drafts</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {insights.map((item) => (
          <li key={item.slug}>
            {item.title} <span className="text-mid">draft, not on the public site</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Stored articles</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(articles ?? []).map((item) => (
          <li key={item.id}>
            <Link className="text-gold" href={`/studio/articles/${item.id}/`}>
              {item.title}
            </Link>{" "}
            <span className="text-mid">{item.status}</span>
          </li>
        ))}
        {articles && articles.length === 0 ? <li className="text-mid">No stored articles yet.</li> : null}
      </ul>
      <p className="mt-4">
        <Link className="font-semibold text-gold" href="/studio/articles/new/">
          New article
        </Link>
      </p>

      <h2 className="mt-12 text-xl font-semibold">Add a case study</h2>
      <p className="mt-2 text-sm leading-6 text-mid">
        Nativ Genetix Soweto and CZApay are already on the public work page. Use this only for a new one, and only
        with facts you can point at.
      </p>
      <div className="mt-4">
        <CaseStudyForm />
      </div>
      <ul className="mt-4 space-y-1 text-sm text-mid">
        {(studies ?? []).map((study) => (
          <li key={study.id}>
            {study.client_name} ({study.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
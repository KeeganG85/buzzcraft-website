"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleRecord } from "@/lib/studio";
import { slugifyTitle } from "@/lib/studio-slug";
import { publishChecklist } from "@/lib/studio-checklist";
import { readingMinutes, wordCount, type ProseNode } from "@/lib/studio-doc";
import { SerialTaskQueue } from "@/lib/studio-save";
import { buttonClass } from "@/components/ui/primitives";

type OutlineItem = { level: number; text: string; pos: number };

const fieldClass = "mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3";

function readOutline(editor: Editor): OutlineItem[] {
  const items: OutlineItem[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name !== "heading") return;
    const level = Number(node.attrs.level);
    items.push({
      level: level === 3 ? 3 : 2,
      text: node.textContent.trim() || "Heading",
      pos,
    });
  });
  return items;
}

function ToolButton({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="min-h-11 rounded-full border border-white/15 px-3 text-sm text-soft hover:border-gold"
      aria-pressed={pressed}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function ArticleEditor({ initial }: { initial?: Partial<ArticleRecord> & { doc?: ProseNode } }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [h1, setH1] = useState(initial?.h1 ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [heroImage, setHeroImage] = useState(initial?.hero_image ?? "");
  const [heroAlt, setHeroAlt] = useState(initial?.hero_alt ?? "");
  const [publishDate, setPublishDate] = useState(initial?.publish_date ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [canonical, setCanonical] = useState(initial?.canonical ?? "");
  const [ogTitle, setOgTitle] = useState(initial?.og_title ?? "");
  const [ogDescription, setOgDescription] = useState(initial?.og_description ?? "");
  const [focusPhrase, setFocusPhrase] = useState(initial?.focus_phrase ?? "");
  const [sourceNote, setSourceNote] = useState(initial?.source_note ?? "");
  const [claimsChecked, setClaimsChecked] = useState(initial?.claims_checked === true);
  const [text, setText] = useState(initial?.body ?? "");
  const [revision, setRevision] = useState(0);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [tab, setTab] = useState<"outline" | "write" | "publish">("write");
  const [issues, setIssues] = useState<string[]>([]);
  const [statusText, setStatusText] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [markdown, setMarkdown] = useState("");
  const articleId = useRef(initial?.id ?? "");
  const changeCount = useRef(0);
  const savedChangeCount = useRef(0);
  const pendingSaves = useRef(0);
  const redirected = useRef(false);
  const saveQueue = useRef(new SerialTaskQueue());
  const flushRef = useRef<() => Promise<boolean>>(async () => true);

  function markChanged() {
    changeCount.current += 1;
    setRevision(changeCount.current);
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder: "Write the article" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown,
    ],
    content: initial?.doc,
    editorProps: {
      attributes: {
        "aria-label": "Article body",
        class: "min-h-[18rem] px-4 py-3 leading-7 focus:outline-none",
      },
    },
    onCreate: ({ editor: current }) => {
      setText(current.getText({ blockSeparator: "\n\n" }));
      setOutline(readOutline(current));
    },
    onUpdate: ({ editor: current }) => {
      markChanged();
      setText(current.getText({ blockSeparator: "\n\n" }));
      setOutline(readOutline(current));
    },
  });

  const words = wordCount(text);
  const minutes = readingMinutes(text);
  const readingLabel = minutes === 1 ? "1 min read" : `${minutes} min read`;

  const payload = useMemo(
    () => ({
      id: articleId.current,
      title,
      h1,
      slug,
      excerpt,
      author,
      category,
      tags,
      hero_image: heroImage,
      hero_alt: heroAlt,
      publish_date: publishDate,
      seo_title: seoTitle,
      meta_description: metaDescription,
      canonical,
      og_title: ogTitle,
      og_description: ogDescription,
      focus_phrase: focusPhrase,
      source_note: sourceNote,
      claims_checked: claimsChecked,
    }),
    [
      title,
      h1,
      slug,
      excerpt,
      author,
      category,
      tags,
      heroImage,
      heroAlt,
      publishDate,
      seoTitle,
      metaDescription,
      canonical,
      ogTitle,
      ogDescription,
      focusPhrase,
      sourceNote,
      claimsChecked,
    ],
  );

  function takeSnapshot() {
    if (!editor) return null;
    return {
      change: changeCount.current,
      payload: { ...payload, id: articleId.current },
      doc: editor.getJSON() as ProseNode,
      body: editor.getText({ blockSeparator: "\n\n" }),
    };
  }

  function queueSave(intent: "save" | "publish", snapshot = takeSnapshot()): Promise<boolean> {
    if (!snapshot) return Promise.resolve(false);
    pendingSaves.current += 1;
    return saveQueue.current.enqueue(async () => {
      setIssues([]);
      setStatusText(intent === "publish" ? "Publishing" : "Saving draft");
      try {
        const res = await fetch("/api/studio/articles/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...snapshot.payload, id: articleId.current || snapshot.payload.id, intent, doc: snapshot.doc, body: snapshot.body }),
        });
        const body = (await res.json()) as {
          ok?: boolean;
          error?: string;
          issues?: string[];
          article?: { id: string };
        };
        if (body.article?.id && !articleId.current) articleId.current = body.article.id;
        if (body.issues) setIssues(body.issues);
        if (!res.ok || !body.ok) {
          setStatusText(body.error || "Could not save the draft.");
          return false;
        }
        savedChangeCount.current = Math.max(savedChangeCount.current, snapshot.change);
        if (
          body.article?.id &&
          !initial?.id &&
          !redirected.current &&
          changeCount.current === snapshot.change
        ) {
          redirected.current = true;
          router.replace(`/studio/articles/${body.article.id}/`);
          return true;
        }
        setStatusText(
          changeCount.current > snapshot.change
            ? "Saved this snapshot. Newer edits are still unsaved."
            : intent === "publish"
              ? "Published."
              : initial?.status === "published"
                ? "Draft saved. The live article is unchanged."
                : "Draft saved.",
        );
        return true;
      } catch {
        setStatusText(intent === "publish" ? "Could not publish. Your edits are still unsaved." : "Could not save the draft.");
        return false;
      } finally {
        pendingSaves.current -= 1;
      }
    });
  }

  async function send(intent: "save" | "publish") {
    return queueSave(intent);
  }

  const sendRef = useRef(send);
  sendRef.current = send;
  flushRef.current = async () => {
    for (;;) {
      await saveQueue.current.idle();
      if (changeCount.current <= savedChangeCount.current) return true;
      const success = await queueSave("save", takeSnapshot());
      if (!success) return false;
    }
  };

  useEffect(() => {
    if (!editor) return;
    const timer = window.setTimeout(() => {
      if (changeCount.current <= savedChangeCount.current) return;
      if (!articleId.current && !title.trim() && wordCount(text) === 0) return;
      void sendRef.current("save");
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [editor, payload, revision, text, title]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (changeCount.current <= savedChangeCount.current && pendingSaves.current === 0) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  useEffect(() => {
    const interceptNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement) || target.target && target.target !== "_self") return;
      const destination = new URL(target.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault();
      const href = `${destination.pathname}${destination.search}${destination.hash}`;
      void flushRef.current().then((saved) => {
        if (saved) router.push(href);
      });
    };
    document.addEventListener("click", interceptNavigation, true);
    return () => document.removeEventListener("click", interceptNavigation, true);
  }, [router]);

  const checklist = publishChecklist(
    {
      id: articleId.current,
      title,
      h1,
      slug: slug || slugifyTitle(title),
      excerpt,
      author,
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      body: text,
      hero_image: heroImage,
      hero_alt: heroAlt,
      publish_date: publishDate,
      seo_title: seoTitle,
      meta_description: metaDescription,
      canonical,
      og_title: ogTitle,
      og_description: ogDescription,
      focus_phrase: focusPhrase,
      source_note: sourceNote,
      claims_checked: claimsChecked,
      status: initial?.status ?? "draft",
    },
    [],
  );

  function mark(name: "bold" | "italic") {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (name === "bold") chain.toggleBold().run();
    else chain.toggleItalic().run();
  }

  const outlinePanel = (
    <nav aria-label="Outline" className="space-y-2">
      <h2 className="text-sm font-semibold">Outline</h2>
      {outline.length === 0 ? <p className="text-sm text-mid">Headings you add will appear here.</p> : null}
      <ul className="space-y-1">
        {outline.map((item) => (
          <li key={`${item.pos}-${item.text}`}>
            <button
              type="button"
              className={`min-h-11 w-full rounded-lg px-2 text-left text-sm hover:text-gold ${item.level === 3 ? "pl-5" : ""}`}
              onClick={() => {
                editor?.chain().focus().setTextSelection(item.pos + 1).scrollIntoView().run();
                setTab("write");
              }}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const publishPanel = (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Publishing</h2>
      <p className="text-sm text-mid">
        {words} {words === 1 ? "word" : "words"}. {readingLabel}.
      </p>
      <p className="text-sm text-mid" aria-live="polite">
        {statusText}
      </p>
      {initial?.status === "published" ? (
        <p className="text-sm leading-6 text-mid">Edits stay in a draft version until you publish.</p>
      ) : null}
      <label className="block text-sm">
        <span className="font-semibold">Title</span>
        <input className={fieldClass} value={title} onChange={(event) => { markChanged(); setTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">H1</span>
        <input className={fieldClass} value={h1} onChange={(event) => { markChanged(); setH1(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Slug</span>
        <input className={fieldClass} value={slug || (title.trim() ? slugifyTitle(title) : "")} onChange={(event) => { markChanged(); setSlug(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Excerpt</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={excerpt} onChange={(event) => { markChanged(); setExcerpt(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Author</span>
        <input className={fieldClass} value={author} onChange={(event) => { markChanged(); setAuthor(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Category</span>
        <input className={fieldClass} value={category} onChange={(event) => { markChanged(); setCategory(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Tags, comma separated</span>
        <input className={fieldClass} value={tags} onChange={(event) => { markChanged(); setTags(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Hero image path</span>
        <input className={fieldClass} value={heroImage} onChange={(event) => { markChanged(); setHeroImage(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Hero alt text</span>
        <input className={fieldClass} value={heroAlt} onChange={(event) => { markChanged(); setHeroAlt(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Publish date</span>
        <input className={fieldClass} value={publishDate} onChange={(event) => { markChanged(); setPublishDate(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">SEO title</span>
        <input className={fieldClass} value={seoTitle} onChange={(event) => { markChanged(); setSeoTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Meta description</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={metaDescription} onChange={(event) => { markChanged(); setMetaDescription(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Canonical URL</span>
        <input className={fieldClass} value={canonical} onChange={(event) => { markChanged(); setCanonical(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Open Graph title</span>
        <input className={fieldClass} value={ogTitle} onChange={(event) => { markChanged(); setOgTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Open Graph description</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={ogDescription} onChange={(event) => { markChanged(); setOgDescription(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Focus phrase (guidance only)</span>
        <input className={fieldClass} value={focusPhrase} onChange={(event) => { markChanged(); setFocusPhrase(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Source note</span>
        <textarea className={`${fieldClass} py-2`} rows={4} value={sourceNote} onChange={(event) => { markChanged(); setSourceNote(event.target.value); }} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1"
          checked={claimsChecked}
          onChange={(event) => {
            markChanged();
            setClaimsChecked(event.target.checked);
          }}
        />
        <span>I have checked every factual claim against the source note. This is not an SEO score.</span>
      </label>
      {checklist.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-mid">
          {checklist.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-mid">Checklist is clear. A person can publish.</p>
      )}
      {issues.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-gold">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonClass("secondary")} onClick={() => void send("save")}>
          Save draft
        </button>
        <button type="button" className={buttonClass("primary")} onClick={() => void send("publish")}>
          Publish
        </button>
      </div>
    </div>
  );

  const editorPanel = (
    <div>
      <div className="flex flex-wrap gap-2">
        <ToolButton label="H2" pressed={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolButton label="H3" pressed={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
        <ToolButton label="Bold" pressed={editor?.isActive("bold")} onClick={() => mark("bold")} />
        <ToolButton label="Italic" pressed={editor?.isActive("italic")} onClick={() => mark("italic")} />
        <ToolButton label="List" pressed={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
        <ToolButton label="Numbered" pressed={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
        <ToolButton label="Quote" pressed={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
        <ToolButton label="Code" pressed={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
        <ToolButton label="Rule" onClick={() => editor?.chain().focus().setHorizontalRule().run()} />
        <ToolButton label="Table" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <ToolButton label="Link" pressed={editor?.isActive("link")} onClick={() => { setLinkHref(editor?.getAttributes("link").href ?? ""); setLinkOpen((open) => !open); }} />
        <ToolButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} />
        <ToolButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} />
      </div>
      {linkOpen ? (
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!editor) return;
            if (!linkHref.trim()) editor.chain().focus().unsetLink().run();
            else editor.chain().focus().extendMarkRange("link").setLink({ href: linkHref.trim() }).run();
            setLinkOpen(false);
          }}
        >
          <label className="min-w-0 flex-1 text-sm">
            <span className="sr-only">Link URL</span>
            <input className={fieldClass} value={linkHref} onChange={(event) => setLinkHref(event.target.value)} placeholder="https://" />
          </label>
          <button type="submit" className={buttonClass("secondary")}>Apply link</button>
        </form>
      ) : null}
      <div className="studio-editor mt-4 rounded-lg border border-white/15 bg-ink">
        <EditorContent editor={editor} />
      </div>
      <p className="mt-2 text-sm text-mid">
        {words} {words === 1 ? "word" : "words"}. {readingLabel}.
      </p>
      <details className="mt-4">
        <summary className="min-h-11 cursor-pointer text-sm font-semibold">Markdown</summary>
        <div className="mt-2 space-y-2">
          <textarea
            className={`${fieldClass} py-2 font-mono text-sm`}
            rows={8}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            aria-label="Markdown"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={() => setMarkdown(editor?.getMarkdown() ?? "")}
            >
              Export
            </button>
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={() => {
                markChanged();
                editor?.commands.setContent(markdown, { contentType: "markdown" });
              }}
            >
              Import
            </button>
          </div>
        </div>
      </details>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex gap-2 md:hidden" role="tablist" aria-label="Editor sections">
        {(
          [
            ["outline", "Outline"],
            ["write", "Editor"],
            ["publish", "Publishing"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`min-h-11 flex-1 rounded-full border px-3 text-sm ${tab === id ? "border-gold text-gold" : "border-white/15 text-soft"}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="md:grid md:grid-cols-[14rem_minmax(0,1fr)_20rem] md:items-start md:gap-6">
        <aside className={`${tab === "outline" ? "block" : "hidden"} md:block`}>{outlinePanel}</aside>
        <div className={`${tab === "write" ? "block" : "hidden"} md:block`}>{editorPanel}</div>
        <aside className={`${tab === "publish" ? "block" : "hidden"} md:block`}>{publishPanel}</aside>
      </div>
    </div>
  );
}

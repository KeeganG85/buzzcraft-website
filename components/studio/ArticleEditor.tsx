"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ArticleRecord } from "@/lib/studio";
import { publishChecklist } from "@/lib/studio-checklist";
import { readingMinutes, wordCount, type ProseNode } from "@/lib/studio-doc";
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
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [tab, setTab] = useState<"outline" | "write" | "publish">("write");
  const [issues, setIssues] = useState<string[]>([]);
  const [statusText, setStatusText] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [markdown, setMarkdown] = useState("");
  const articleId = useRef(initial?.id ?? "");
  const dirty = useRef(false);
  const saving = useRef(false);

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
      dirty.current = true;
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

  async function send(intent: "save" | "publish") {
    if (!editor || saving.current) return;
    saving.current = true;
    setIssues([]);
    if (intent === "publish") setStatusText("Publishing");
    else setStatusText("Saving draft");
    const doc = editor.getJSON() as ProseNode;
    const res = await fetch("/api/studio/articles/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        id: articleId.current,
        intent,
        doc,
        body: editor.getText({ blockSeparator: "\n\n" }),
      }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string; issues?: string[]; article?: { id: string } };
    saving.current = false;
    if (body.issues) setIssues(body.issues);
    if (!res.ok || !body.ok) {
      setStatusText(body.error || "Could not save the draft.");
      return;
    }
    dirty.current = false;
    if (body.article?.id && !articleId.current) {
      window.location.assign(`/studio/articles/${body.article.id}/`);
      return;
    }
    setStatusText(
      intent === "publish"
        ? "Published."
        : initial?.status === "published"
          ? "Draft saved. The live article is unchanged."
          : "Draft saved.",
    );
  }

  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    if (!editor) return;
    const timer = window.setTimeout(() => {
      if (!dirty.current || saving.current) return;
      if (!articleId.current && !title.trim() && wordCount(text) === 0) return;
      void sendRef.current("save");
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [editor, payload, text, title]);

  const checklist = publishChecklist(
    {
      id: articleId.current,
      title,
      h1,
      slug,
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
        <input className={fieldClass} value={title} onChange={(event) => { dirty.current = true; setTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">H1</span>
        <input className={fieldClass} value={h1} onChange={(event) => { dirty.current = true; setH1(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Slug</span>
        <input className={fieldClass} value={slug} onChange={(event) => { dirty.current = true; setSlug(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Excerpt</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={excerpt} onChange={(event) => { dirty.current = true; setExcerpt(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Author</span>
        <input className={fieldClass} value={author} onChange={(event) => { dirty.current = true; setAuthor(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Category</span>
        <input className={fieldClass} value={category} onChange={(event) => { dirty.current = true; setCategory(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Tags, comma separated</span>
        <input className={fieldClass} value={tags} onChange={(event) => { dirty.current = true; setTags(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Hero image path</span>
        <input className={fieldClass} value={heroImage} onChange={(event) => { dirty.current = true; setHeroImage(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Hero alt text</span>
        <input className={fieldClass} value={heroAlt} onChange={(event) => { dirty.current = true; setHeroAlt(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Publish date</span>
        <input className={fieldClass} value={publishDate} onChange={(event) => { dirty.current = true; setPublishDate(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">SEO title</span>
        <input className={fieldClass} value={seoTitle} onChange={(event) => { dirty.current = true; setSeoTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Meta description</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={metaDescription} onChange={(event) => { dirty.current = true; setMetaDescription(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Canonical URL</span>
        <input className={fieldClass} value={canonical} onChange={(event) => { dirty.current = true; setCanonical(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Open Graph title</span>
        <input className={fieldClass} value={ogTitle} onChange={(event) => { dirty.current = true; setOgTitle(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Open Graph description</span>
        <textarea className={`${fieldClass} py-2`} rows={3} value={ogDescription} onChange={(event) => { dirty.current = true; setOgDescription(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Focus phrase (guidance only)</span>
        <input className={fieldClass} value={focusPhrase} onChange={(event) => { dirty.current = true; setFocusPhrase(event.target.value); }} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Source note</span>
        <textarea className={`${fieldClass} py-2`} rows={4} value={sourceNote} onChange={(event) => { dirty.current = true; setSourceNote(event.target.value); }} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1"
          checked={claimsChecked}
          onChange={(event) => {
            dirty.current = true;
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
                dirty.current = true;
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

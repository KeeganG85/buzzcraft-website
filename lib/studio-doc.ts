export type ProseMark = { type: string; attrs?: Record<string, unknown> };

export type ProseNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: ProseNode[];
  marks?: ProseMark[];
};

export function isProseDoc(value: unknown): value is ProseNode {
  if (!value || typeof value !== "object") return false;
  const node = value as ProseNode;
  return node.type === "doc" && Array.isArray(node.content);
}

export function plainTextToDoc(text: string): ProseNode {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const content = (blocks.length > 0 ? blocks : [""]).map((block) => ({
    type: "paragraph",
    ...(block ? { content: [{ type: "text", text: block }] } : {}),
  }));
  return { type: "doc", content };
}

function textOf(node: ProseNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(textOf).join("");
}

export function docToText(doc: ProseNode): string {
  const blocks: string[] = [];
  const visit = (node: ProseNode) => {
    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "blockquote" ||
      node.type === "codeBlock" ||
      node.type === "listItem"
    ) {
      const text = textOf(node).trim();
      if (text) blocks.push(text);
      return;
    }
    for (const child of node.content ?? []) visit(child);
  };
  for (const child of doc.content ?? []) visit(child);
  return blocks.join("\n\n");
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/** About 200 words a minute. Empty text is 0. Any shorter piece is 1 minute. */
export function readingMinutes(text: string): number {
  const words = wordCount(text);
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function safeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith("javascript:")) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") return url.href;
  } catch {
    return null;
  }
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarks(text: string, marks: ProseMark[]): string {
  let html = escapeHtml(text);
  for (const mark of marks) {
    if (mark.type === "bold") html = `<strong>${html}</strong>`;
    else if (mark.type === "italic") html = `<em>${html}</em>`;
    else if (mark.type === "code") html = `<code>${html}</code>`;
    else if (mark.type === "strike") html = `<s>${html}</s>`;
    else if (mark.type === "underline") html = `<u>${html}</u>`;
    else if (mark.type === "link") {
      const href = safeUrl(String(mark.attrs?.href ?? ""));
      if (href) html = `<a href="${escapeHtml(href)}">${html}</a>`;
    }
  }
  return html;
}

function renderInline(node: ProseNode): string {
  return (node.content ?? [])
    .map((child) => {
      if (child.type === "text") return renderMarks(child.text ?? "", child.marks ?? []);
      if (child.type === "hardBreak") return "<br>";
      return "";
    })
    .join("");
}

function renderNode(node: ProseNode): string {
  const children = () => (node.content ?? []).map(renderNode).join("");
  switch (node.type) {
    case "doc":
      return children();
    case "paragraph":
      return `<p>${renderInline(node)}</p>`;
    case "heading": {
      const level = Number(node.attrs?.level);
      const tag = level === 1 || level === 2 || level === 3 ? `h${level}` : "h2";
      return `<${tag}>${renderInline(node)}</${tag}>`;
    }
    case "bulletList":
      return `<ul>${children()}</ul>`;
    case "orderedList":
      return `<ol>${children()}</ol>`;
    case "listItem":
      return `<li>${children()}</li>`;
    case "blockquote":
      return `<blockquote>${children()}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${escapeHtml(textOf(node))}</code></pre>`;
    case "horizontalRule":
      return "<hr>";
    case "table":
      return `<table>${children()}</table>`;
    case "tableRow":
      return `<tr>${children()}</tr>`;
    case "tableHeader":
      return `<th>${children()}</th>`;
    case "tableCell":
      return `<td>${children()}</td>`;
    case "hardBreak":
      return "<br>";
    case "text":
      return renderMarks(node.text ?? "", node.marks ?? []);
    default:
      return children();
  }
}

/** HTML is built only from known nodes. Text is escaped. The client HTML is not used. */
export function docToHtml(doc: ProseNode): string {
  return renderNode(doc);
}

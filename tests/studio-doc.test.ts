import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { docToHtml, docToText, isProseDoc, plainTextToDoc, readingMinutes, wordCount } from "@/lib/studio-doc";

describe("studio documents", () => {
  it("turns plain text into paragraphs and back", () => {
    const doc = plainTextToDoc("First paragraph.\n\nSecond paragraph.");
    expect(isProseDoc(doc)).toBe(true);
    expect(docToText(doc)).toBe("First paragraph.\n\nSecond paragraph.");
    expect(isProseDoc({ type: "paragraph" })).toBe(false);
  });

  it("counts words and reading time from the text", () => {
    expect(wordCount("  one   two  ")).toBe(2);
    expect(readingMinutes("")).toBe(0);
    expect(readingMinutes("short note")).toBe(1);
    expect(readingMinutes(Array.from({ length: 201 }, () => "word").join(" "))).toBe(2);
  });

  it("escapes text and drops unsafe links", () => {
    const html = docToHtml({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "<script>alert(1)</script>" },
            {
              type: "text",
              text: "safe",
              marks: [{ type: "link", attrs: { href: "https://www.buzzcraft.co.za/scorecard/" } }],
            },
            {
              type: "text",
              text: "bad",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
          ],
        },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Section" }] },
      ],
    });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain('href="https://www.buzzcraft.co.za/scorecard/"');
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<h2>Section</h2>");
    expect(html).toContain(">bad<");
  });
});

describe("TipTap imports", () => {
  it("keeps TipTap in the Studio editor only", () => {
    const roots = ["app", "components", "lib"];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === "node_modules") continue;
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        const text = fs.readFileSync(full, "utf8");
        if (text.includes("@tiptap/")) offenders.push(path.relative(process.cwd(), full));
      }
    };
    for (const root of roots) walk(path.join(process.cwd(), root));
    expect(offenders).toEqual(["components/studio/ArticleEditor.tsx"]);
  });
});

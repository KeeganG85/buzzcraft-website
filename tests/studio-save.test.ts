import { describe, expect, it } from "vitest";
import { docToHtml, type ProseNode } from "@/lib/studio-doc";
import { SerialTaskQueue } from "@/lib/studio-save";

describe("serialized article saves", () => {
  it("runs queued writes one at a time and preserves their order", async () => {
    const queue = new SerialTaskQueue();
    let releaseFirst!: () => void;
    let active = 0;
    let maxActive = 0;
    const order: number[] = [];
    const first = queue.enqueue(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise<void>((resolve) => { releaseFirst = resolve; });
      order.push(1);
      active -= 1;
    });
    const second = queue.enqueue(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      order.push(2);
      active -= 1;
    });

    await Promise.resolve();
    expect(active).toBe(1);
    releaseFirst();
    await Promise.all([first, second]);
    expect(order).toEqual([1, 2]);
    expect(maxActive).toBe(1);
  });

  it("continues with later writes after a failed write", async () => {
    const queue = new SerialTaskQueue();
    const failed = queue.enqueue(async () => { throw new Error("temporary failure"); });
    const next = queue.enqueue(async () => "saved");
    await expect(failed).rejects.toThrow("temporary failure");
    await expect(next).resolves.toBe("saved");
    await expect(queue.idle()).resolves.toBeUndefined();
  });
});

describe("rich text preview rendering", () => {
  it("preserves supported formatting, escapes text, and rejects unsafe links", () => {
    const doc: ProseNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "<script>alert(1)</script>", marks: [{ type: "bold" }] },
            { type: "text", text: "safe link", marks: [{ type: "link", attrs: { href: "https://example.com/?a=1&b=2" } }] },
            { type: "text", text: "unsafe link", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] },
          ],
        },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Section" }] },
      ],
    };
    const html = docToHtml(doc);
    expect(html).toContain("<strong>&lt;script&gt;alert(1)&lt;/script&gt;</strong>");
    expect(html).toContain('<a href="https://example.com/?a=1&amp;b=2">safe link</a>');
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<h2>Section</h2>");
  });
});

import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { cronAuthorised, cronConfigured, dueScheduled, scheduleRowPatch } from "@/lib/studio-schedule";
import { johannesburgInputToUtc, utcToJohannesburgInput } from "@/lib/studio-time";
import { assetInUse, countAssetUse, inspectImage, isSvgUpload } from "@/lib/studio-media";

describe("schedule", () => {
  it("stores Johannesburg time as UTC", () => {
    expect(johannesburgInputToUtc("2026-11-24T21:30")).toBe("2026-11-24T19:30:00.000Z");
    expect(utcToJohannesburgInput("2026-11-24T19:30:00.000Z")).toBe("2026-11-24T21:30");
    expect(johannesburgInputToUtc("tomorrow")).toBeNull();
  });

  it("does not run when the secret is missing and ignores drafts", () => {
    expect(cronConfigured("")).toBe(false);
    expect(cronAuthorised(null, "")).toBe("missing");
    expect(cronAuthorised("Bearer wrong", "expected-secret")).toBe("rejected");
    expect(cronAuthorised("Bearer expected-secret", "expected-secret")).toBe("ok");
    const due = dueScheduled(
      [
        { status: "draft", scheduled_at: "2026-11-24T00:00:00.000Z", slug: "notes" },
        { status: "scheduled", scheduled_at: "2026-11-24T00:00:00.000Z", slug: "notes" },
        { status: "scheduled", scheduled_at: "2026-11-24T00:00:00.000Z", slug: "what-is-a-growth-system" },
        { status: "published", scheduled_at: "2026-11-24T00:00:00.000Z", slug: "live" },
      ],
      "2026-11-24T12:00:00.000Z",
    );
    expect(due.map((item) => item.slug)).toEqual(["notes"]);
  });

  it("stores a schedule without rewriting article fields", () => {
    expect(scheduleRowPatch("2026-11-24T19:30:00.000Z")).toEqual({
      status: "scheduled",
      scheduled_at: "2026-11-24T19:30:00.000Z",
    });
  });
});

describe("media checks", () => {
  it("reads supported raster images and rejects SVG declarations and content", () => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const image = inspectImage(png);
    expect(image?.mime).toBe("image/png");
    expect(image?.width).toBe(1);
    expect(image?.height).toBe(1);
    expect(inspectImage(Buffer.from("not an image"))).toBeNull();
    expect(isSvgUpload("image.svg", "image/svg+xml")).toBe(true);
    expect(isSvgUpload("image.SVG", "image/png")).toBe(true);
    expect(isSvgUpload("image.png", "image/svg+xml; charset=utf-8")).toBe(true);
    expect(isSvgUpload("image.png", "image/png")).toBe(false);
    expect(inspectImage(Buffer.from('<svg width="10" height="20"></svg>'))).toBeNull();
    expect(inspectImage(Buffer.from('<svg><script>alert(1)</script></svg>'))).toBeNull();

    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x07, 0x08, 0x00, 0x01, 0x00, 0x01, 0x00]);
    expect(inspectImage(jpeg)?.mime).toBe("image/jpeg");
    const webp = Buffer.alloc(30);
    webp.write("RIFF", 0, "ascii");
    webp.write("WEBP", 8, "ascii");
    webp.write("VP8X", 12, "ascii");
    expect(inspectImage(webp)?.mime).toBe("image/webp");
    const avif = Buffer.alloc(16);
    avif.write("ftyp", 4, "ascii");
    avif.write("avif", 8, "ascii");
    expect(inspectImage(avif)?.mime).toBe("image/avif");
  });

  it("blocks deletion when an article still uses the file", () => {
    expect(assetInUse("abc.jpg", ["https://example.test/abc.jpg"])).toBe(true);
    expect(assetInUse("abc.jpg", ["https://example.test/other.jpg"])).toBe(false);
    expect(
      countAssetUse(
        { publicUrl: "https://example.test/studio-media/abc.jpg", storagePath: "abc.jpg" },
        [{ hero_image: "/brand/roundel.webp" }],
        [{ content_html: "<p>Hello</p>", content_json: { hero_image: "https://example.test/studio-media/abc.jpg" } }],
      ),
    ).toBe(1);
    expect(
      countAssetUse(
        { publicUrl: "https://example.test/studio-media/abc.jpg", storagePath: "abc.jpg" },
        [{ hero_image: "" }],
        [{ content_html: "<p>Hello</p>", content_json: { hero_image: "/brand/roundel.webp" } }],
      ),
    ).toBe(0);
  });
});

describe("july drafts", () => {
  it("still keeps the repository drafts unpublished", () => {
    expect(insights.every((item) => item.published === false)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { cronAuthorised, cronConfigured, dueScheduled } from "@/lib/studio-schedule";
import { johannesburgInputToUtc, utcToJohannesburgInput } from "@/lib/studio-time";
import { assetInUse, inspectImage, sanitizeSvg } from "@/lib/studio-media";

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
});

describe("media checks", () => {
  it("reads a PNG and rejects a dangerous SVG", () => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const image = inspectImage(png);
    expect(image?.mime).toBe("image/png");
    expect(image?.width).toBe(1);
    expect(image?.height).toBe(1);
    expect(inspectImage(Buffer.from("not an image"))).toBeNull();
    expect(sanitizeSvg('<svg width="10" height="20"></svg>')?.width).toBe(10);
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>')).toBeNull();
  });

  it("blocks deletion when an article still uses the file", () => {
    expect(assetInUse("abc.jpg", ["https://example.test/abc.jpg"])).toBe(true);
    expect(assetInUse("abc.jpg", ["https://example.test/other.jpg"])).toBe(false);
  });
});

describe("july drafts", () => {
  it("still keeps the repository drafts unpublished", () => {
    expect(insights.every((item) => item.published === false)).toBe(true);
  });
});

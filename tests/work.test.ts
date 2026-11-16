import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";

describe("approved case studies", () => {
  it("publishes only the two sites Keegan named, without metrics", () => {
    expect(caseStudies.map((study) => study.name)).toEqual(["Nativ Genetix Soweto", "CZApay"]);
    const blob = JSON.stringify(caseStudies);
    expect(blob).not.toMatch(/\d+%/);
    expect(blob).not.toContain("SKNN");
    expect(blob).not.toContain("QuickBill");
  });
});

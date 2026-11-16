import fs from "fs";
import { describe, expect, it } from "vitest";
import { packageAmount, packages, sprintOffer } from "@/content/pricing";
import { sprint } from "@/content/sprint";
import { formatZar } from "@/lib/money";

describe("package prices", () => {
  it("matches the approved from prices and leaves the Authority annual saving unset", () => {
    expect(packages.map((offer) => [offer.onceOff, offer.monthly, offer.annualSaving])).toEqual([
      [3000, 300, 600],
      [6500, 650, 1300],
      [12000, 1200, null],
    ]);
    expect(packages.some((offer) => offer.name.toLowerCase().includes("recommend"))).toBe(false);
  });

  it("switches the visible amount without inventing a fourth package price", () => {
    const authority = packages[2];
    expect(packageAmount(authority, "once")).toBe(12000);
    expect(packageAmount(authority, "monthly")).toBe(1200);
    expect(authority.annualSaving).toBeNull();
  });

  it("keeps the Sprint beside the packages at the live price", () => {
    expect(sprintOffer.price).toBe(18500);
    expect(sprintOffer.workingDays).toBe(10);
    expect(formatZar(18500)).toBe("R18,500");
    expect(formatZar(600)).toBe("R600");
    expect(sprint.deliverables).toHaveLength(6);
    expect(sprint.deposit).toBe("50% deposit to book");
  });

  it("marks package prices excl. VAT and does not invent a VAT number", () => {
    const home = fs.readFileSync("app/page.tsx", "utf8");
    const cards = fs.readFileSync("components/marketing/PriceCards.tsx", "utf8");
    expect(home).toContain("excl. VAT");
    expect(cards).toContain("excl. VAT");
    expect(home).not.toMatch(/VAT number[:\s]*\d/);
    expect(cards).not.toContain("awaiting owner confirmation");
    expect(cards).not.toContain("recommended");
    const pricing = fs.readFileSync("app/pricing/page.tsx", "utf8");
    const sprintPage = fs.readFileSync("app/sprint/page.tsx", "utf8");
    const sprintCopy = fs.readFileSync("content/sprint.ts", "utf8");
    for (const text of [pricing, sprintPage, sprintCopy]) {
      expect(text).not.toContain("R25,000");
      expect(text).toContain("excl. VAT");
      expect(text).not.toMatch(/VAT number[:\s]*\d/);
      expect(text).not.toContain("contract length");
      expect(text).not.toContain("cancellation");
    }
    expect(pricing).toContain("R18,500");
    expect(sprintPage).toContain("R18,500");
  });
});

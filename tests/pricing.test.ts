import { describe, expect, it } from "vitest";
import { packageAmount, packages, sprintOffer } from "@/content/pricing";
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
  });
});

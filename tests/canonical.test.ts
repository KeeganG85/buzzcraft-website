import { describe, expect, it } from "vitest";
import { organizationJsonLd, professionalServiceJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { legacyRedirects } from "@/lib/redirects";
import { blockedPaths, indexablePaths } from "@/lib/routes";
import { absoluteUrl, canonicalPath } from "@/lib/seo";

describe("canonical policy", () => {
  it("uses www and a trailing slash on directory routes", () => {
    expect(canonicalPath("/")).toBe("/");
    expect(canonicalPath("/services")).toBe("/services/");
    expect(canonicalPath("/services/")).toBe("/services/");
    expect(absoluteUrl("/services")).toBe("https://www.buzzcraft.co.za/services/");
    expect(absoluteUrl("/sitemap.xml")).toBe("https://www.buzzcraft.co.za/sitemap.xml");
  });

  it("keeps legacy redirects permanent and does not send about or contact away", () => {
    expect(legacyRedirects.every((rule) => rule.permanent)).toBe(true);
    const sources = legacyRedirects.map((rule) => rule.source);
    expect(sources).toContain("/blog/:slug");
    expect(sources).not.toContain("/about");
    expect(sources).not.toContain("/contact");
    const promptLibrary = legacyRedirects.find((rule) => rule.source === "/promptlibrary");
    expect(promptLibrary?.destination).toBe("/120promptos");
    expect(promptLibrary?.permanent).toBe(true);
  });

  it("keeps drafts, studio and the legacy prompt library out of the sitemap list", () => {
    expect(indexablePaths).toEqual([
      "/",
      "/services",
      "/services/websites",
      "/services/search-visibility",
      "/services/lead-systems",
      "/pricing",
      "/sprint",
      "/contact",
      "/scorecard",
      "/privacy",
      "/tools",
      "/found",
      "/120promptos",
      "/120promptos/library",
      "/120promptos/privacy",
      "/120promptos/popia",
      "/120promptos/terms",
      "/120promptos/contact",
      "/insights",
      "/about",
      "/work",
      "/work/nativ-genetix-soweto",
      "/work/czapay",
    ]);
    expect(blockedPaths).toContain("/promptlibrary/");
    expect(blockedPaths).toContain("/studio/");
    expect(indexablePaths.join(" ")).not.toContain("promptlibrary");
    expect(indexablePaths.join(" ")).not.toContain("studio");
  });
});

describe("structured data", () => {
  it("publishes only confirmed organisation facts", () => {
    const graph = JSON.stringify([
      organizationJsonLd(),
      webSiteJsonLd(),
      professionalServiceJsonLd(),
    ]);
    expect(graph).toContain("Buzzcraft (Pty) Ltd");
    expect(graph).toContain("Keegan Goocin");
    expect(graph).toContain("Mokhachane Taoana");
    expect(graph).toContain("+27679521325");
    expect(graph).toContain("info@buzzcraft.co.za");
    expect(graph).toContain("https://www.buzzcraft.co.za/brand/roundel.png");
    expect(graph).not.toContain("streetAddress");
    expect(graph).not.toContain("latitude");
    expect(graph).not.toContain("openingHours");
    expect(graph).not.toContain("TODO_VERIFY");
    expect(graph).not.toContain("facebook.com/share");
    expect(graph).not.toContain("priceRange");
  });
});

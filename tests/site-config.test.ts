import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { whatsAppHref } from "@/lib/whatsapp";

describe("public facts", () => {
  it("uses the confirmed phone, email and www host", () => {
    expect(siteConfig.whatsappE164).toBe("+27679521325");
    expect(siteConfig.whatsappDisplay).toBe("+27 67 952 1325");
    expect(siteConfig.email).toBe("info@buzzcraft.co.za");
    expect(siteConfig.url).toBe("https://www.buzzcraft.co.za");
  });

  it("does not invent a registered legal name", () => {
    expect(siteConfig.legalEntity.registeredName).toBeNull();
    expect(siteConfig.legalEntity.registrationNumber).toBeNull();
    expect(siteConfig.legalEntity.informationOfficer).toBeNull();
  });

  it("lists the three live profile links and not the Facebook share URL", () => {
    const hrefs = siteConfig.social.map((item) => item.href);
    expect(hrefs).toEqual([
      "https://www.instagram.com/buzzcraftza/",
      "https://www.linkedin.com/company/buzzcraftza/",
      "https://x.com/BuzzCraftZa",
    ]);
    expect(hrefs.join(" ")).not.toContain("facebook.com/share");
  });

  it("builds a WhatsApp link with an encoded message", () => {
    const href = whatsAppHref("Hello BuzzCraft");
    expect(href.startsWith("https://wa.me/27679521325?text=")).toBe(true);
    expect(href).toContain("Hello%20BuzzCraft");
  });
});

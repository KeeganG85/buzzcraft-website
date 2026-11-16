import { describe, expect, it } from "vitest";
import { parseScorecard, scorecardWhatsAppMessage } from "@/lib/scorecard";

const valid = {
  full_name: "Amina Naidoo",
  email: "amina@example.co.za",
  business_name: "Naidoo Plumbing",
  privacy_consent: true,
};

describe("scorecard requests", () => {
  it("accepts a request without a website and keeps marketing opt-in separate", () => {
    const parsed = parseScorecard(valid);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.lead.website_url).toBeNull();
    expect(parsed.lead.marketing_opt_in).toBe(false);
    expect(parsed.lead.privacy_consent).toBe(true);
  });

  it("records marketing only when that box is ticked", () => {
    const parsed = parseScorecard({ ...valid, marketing_opt_in: true, website_url: "example.co.za" });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.lead.marketing_opt_in).toBe(true);
    expect(parsed.lead.website_url).toBe("https://example.co.za/");
  });

  it("rejects a missing POPIA consent", () => {
    const parsed = parseScorecard({ ...valid, privacy_consent: false });
    expect(parsed.ok).toBe(false);
    if (parsed.ok || "honeypot" in parsed) return;
    expect(parsed.errors.privacy_consent).toBeTruthy();
  });

  it("drops honeypot submissions before a lead exists", () => {
    const parsed = parseScorecard({ ...valid, company: "Spam Co" });
    expect(parsed).toEqual({ ok: false, honeypot: true });
  });

  it("builds a WhatsApp note that includes consent and not a fake metric", () => {
    const parsed = parseScorecard({ ...valid, headache: "Nobody finds us on Google" });
    if (!parsed.ok) throw new Error("expected a lead");
    const message = scorecardWhatsAppMessage(parsed.lead);
    expect(message).toContain("POPIA consent: yes");
    expect(message).toContain("Marketing emails: no");
    expect(message).toContain("Website: Not supplied");
    expect(message).not.toContain("%");
  });
});

import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { foundPrompts } from "@/content/found";
import { publicPrompts } from "@/content/prompt-os/catalogue";
import { parseRegistration } from "@/lib/prompt-access";

describe("prompt libraries", () => {
  it("keeps FOUND open at 35 prompts and gates 120 titles without bodies", () => {
    expect(foundPrompts).toHaveLength(35);
    expect(publicPrompts).toHaveLength(120);
    for (const prompt of publicPrompts) {
      expect(prompt).not.toHaveProperty("task");
      expect(prompt).not.toHaveProperty("expected");
      expect(prompt).not.toHaveProperty("role");
      expect(prompt).not.toHaveProperty("instruction");
    }
  });

  it("keeps full instructions in a server-only module", () => {
    const file = fs.readFileSync(
      path.join(process.cwd(), "content/prompt-os/bodies.server.ts"),
      "utf8",
    );
    expect(file.startsWith('import "server-only"')).toBe(true);
    expect(file).toContain("export function buildPrompt");
    const catalogue = fs.readFileSync(
      path.join(process.cwd(), "content/prompt-os/catalogue.ts"),
      "utf8",
    );
    expect(catalogue).not.toContain("buildPrompt");
    expect(catalogue).not.toContain("EXPECTED OUTPUT");
  });

  it("requires POPIA consent before a registration is stored", () => {
    const denied = parseRegistration(
      { first_name: "Keegan", email: "info@buzzcraft.co.za", business_name: "BuzzCraft", business_does: "Growth systems", privacy_consent: false },
      "hash",
    );
    expect(denied.ok).toBe(false);
    const allowed = parseRegistration(
      { first_name: "Keegan", email: "info@buzzcraft.co.za", business_name: "BuzzCraft", business_does: "Growth systems", privacy_consent: true, marketing_opt_in: false },
      "hash",
    );
    expect(allowed.ok).toBe(true);
    if (allowed.ok) expect(allowed.registration.marketing_opt_in).toBe(false);
  });
});

import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const roots = ["app", "components", "content", "lib", "supabase", "scripts", "tests"];

function filesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...filesIn(full));
    else if (/\.(ts|tsx|md|css|mjs|sql)$/.test(entry.name)) found.push(full);
  }
  return found;
}

describe("copy rules", () => {
  it("does not use an em dash in source we ship", () => {
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of filesIn(path.join(process.cwd(), root))) {
        const text = fs.readFileSync(file, "utf8");
        if (text.includes("\u2014")) offenders.push(file);
      }
    }
    const readme = path.join(process.cwd(), "README.md");
    if (fs.readFileSync(readme, "utf8").includes("\u2014")) offenders.push(readme);
    expect(offenders).toEqual([]);
  });
});

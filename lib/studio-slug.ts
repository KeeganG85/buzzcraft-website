export function slugifyTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "draft";
}

export function uniqueSlugFromTitle(title: string, existingSlugs: string[]): string {
  const base = slugifyTitle(title);
  const used = new Set(existingSlugs.map((slug) => slug.toLowerCase()));
  if (!used.has(base)) return base;
  for (let suffix = 2; ; suffix += 1) {
    const ending = `-${suffix}`;
    const candidate = `${base.slice(0, 80 - ending.length).replace(/-+$/, "")}${ending}`;
    if (!used.has(candidate)) return candidate;
  }
}

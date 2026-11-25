const MAX_BYTES = 5 * 1024 * 1024;

export const brandAssets = [
  { path: "/brand/mascot-reading.webp", label: "Mascot reading" },
  { path: "/brand/mascot-welcome.webp", label: "Mascot welcome" },
  { path: "/brand/mascot-laptop-thinking.webp", label: "Mascot at a laptop" },
  { path: "/brand/mascot-flipchart.webp", label: "Mascot at a flipchart" },
  { path: "/brand/mascot-johannesburg.webp", label: "Mascot in Johannesburg" },
  { path: "/brand/roundel.webp", label: "Existing roundel" },
  { path: "/brand/wordmark.webp", label: "Existing wordmark" },
] as const;

export type InspectedImage = {
  mime: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  extension: "jpg" | "png" | "webp" | "avif";
  width: number | null;
  height: number | null;
  bytes: Buffer;
};

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function inspectImage(input: Buffer): InspectedImage | null {
  if (input.length === 0 || input.length > MAX_BYTES) return null;
  const png = readPng(input);
  if (png) return { mime: "image/png", extension: "png", ...png, bytes: input };
  const jpeg = readJpeg(input);
  if (jpeg) return { mime: "image/jpeg", extension: "jpg", ...jpeg, bytes: input };
  const webp = readWebp(input);
  if (webp) return { mime: "image/webp", extension: "webp", ...webp, bytes: input };
  const avif = readAvif(input);
  if (avif) return { mime: "image/avif", extension: "avif", ...avif, bytes: input };
  return null;
}

/** Reject SVG declarations independently of the file's actual bytes. */
export function isSvgUpload(fileName: string, mimeType: string): boolean {
  return mimeType.split(";", 1)[0].trim().toLowerCase() === "image/svg+xml" ||
    fileName.trim().toLowerCase().endsWith(".svg");
}

function readPng(input: Buffer): { width: number | null; height: number | null } | null {
  if (input.length < 24 || input[0] !== 0x89 || input.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: input.readUInt32BE(16), height: input.readUInt32BE(20) };
}

function readJpeg(input: Buffer): { width: number | null; height: number | null } | null {
  if (input.length < 4 || input[0] !== 0xff || input[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < input.length) {
    if (input[offset] !== 0xff) return { width: null, height: null };
    const marker = input[offset + 1];
    if (marker === 0xd9 || marker === 0xda) return { width: null, height: null };
    const size = input.readUInt16BE(offset + 2);
    if (size < 2) return { width: null, height: null };
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: input.readUInt16BE(offset + 5), width: input.readUInt16BE(offset + 7) };
    }
    offset += 2 + size;
  }
  return { width: null, height: null };
}

function readWebp(input: Buffer): { width: number | null; height: number | null } | null {
  if (input.length < 30 || input.toString("ascii", 0, 4) !== "RIFF" || input.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const format = input.toString("ascii", 12, 16);
  if (format === "VP8X" && input.length >= 30) {
    return { width: 1 + input.readUIntLE(24, 3), height: 1 + input.readUIntLE(27, 3) };
  }
  if (format === "VP8 " && input.length >= 30) {
    return { width: input.readUInt16LE(26) & 0x3fff, height: input.readUInt16LE(28) & 0x3fff };
  }
  if (format === "VP8L" && input.length >= 25) {
    const bits = input.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return { width: null, height: null };
}

function readAvif(input: Buffer): { width: number | null; height: number | null } | null {
  if (input.length < 16 || input.toString("ascii", 4, 8) !== "ftyp") return null;
  const brand = input.toString("ascii", 8, 12);
  if (brand !== "avif" && brand !== "avis") return null;
  return { width: null, height: null };
}

export function assetInUse(path: string, fields: string[]): boolean {
  return fields.some((field) => field.includes(path));
}

export function countAssetUse(
  needle: { publicUrl: string; storagePath: string },
  articles: { hero_image?: string | null }[],
  versions: { content_html?: string | null; content_json?: unknown }[],
): number {
  const needles = [needle.publicUrl, needle.storagePath].filter((value) => value.length > 0);
  const hit = (value: string) => needles.some((item) => value.includes(item));
  let count = 0;
  for (const article of articles) {
    if (hit(article.hero_image ?? "")) count += 1;
  }
  for (const version of versions) {
    const snapshot = `${version.content_html ?? ""}\n${JSON.stringify(version.content_json ?? {})}`;
    if (hit(snapshot)) count += 1;
  }
  return count;
}

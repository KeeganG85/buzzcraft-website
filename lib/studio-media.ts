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
  mime: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/svg+xml";
  extension: "jpg" | "png" | "webp" | "avif" | "svg";
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
  const svg = sanitizeSvg(input.toString("utf8"));
  if (svg) {
    const bytes = Buffer.from(svg.svg);
    return { mime: "image/svg+xml", extension: "svg", width: svg.width, height: svg.height, bytes };
  }
  return null;
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

export function sanitizeSvg(source: string): { svg: string; width: number | null; height: number | null } | null {
  const svg = source.replace(/^\uFEFF/, "").replace(/<\?xml[\s\S]*?\?>/gi, "").trim();
  if (!/^<svg[\s>]/i.test(svg) || !/<\/svg>\s*$/i.test(svg)) return null;
  if (/<!entity|<!doctype|<\s*script|<\s*foreignobject|<\s*iframe|<\s*embed|<\s*object|javascript:|data:|on[a-z]+\s*=/i.test(svg)) {
    return null;
  }
  const width = numberAttr(svg, "width");
  const height = numberAttr(svg, "height");
  const viewBox = svg.match(/viewBox\s*=\s*["']([^"']+)["']/i)?.[1];
  let boxWidth = width;
  let boxHeight = height;
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      boxWidth = boxWidth ?? Math.round(parts[2]);
      boxHeight = boxHeight ?? Math.round(parts[3]);
    }
  }
  return { svg, width: boxWidth, height: boxHeight };
}

function numberAttr(svg: string, name: string): number | null {
  const match = svg.match(new RegExp(`${name}\\s*=\\s*["']([0-9.]+)`, "i"));
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? Math.round(value) : null;
}

export function assetInUse(path: string, fields: string[]): boolean {
  return fields.some((field) => field.includes(path));
}

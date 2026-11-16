type WordmarkProps = {
  height?: number;
  className?: string;
};

/** Trimmed gold wordmark. Place it on charcoal. Do not invert the gold. */
export function Wordmark({ height = 36, className }: WordmarkProps) {
  const width = Math.round(height * (957 / 153));
  return (
    <picture>
      <source srcSet="/brand/wordmark.avif" type="image/avif" />
      <source srcSet="/brand/wordmark.webp" type="image/webp" />
      <img
        src="/brand/wordmark.png"
        alt="BuzzCraft"
        width={width}
        height={height}
        className={className}
        decoding="async"
      />
    </picture>
  );
}

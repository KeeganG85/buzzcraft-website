const poses = {
  welcome: { w: 880, h: 963 },
  "stressed-desk": { w: 760, h: 428 },
  flipchart: { w: 760, h: 507 },
  "arms-crossed": { w: 720, h: 405 },
  "laptop-thinking": { w: 720, h: 405 },
  reading: { w: 640, h: 700 },
  johannesburg: { w: 720, h: 720 },
} as const;

export type MascotPose = keyof typeof poses;

type MascotProps = {
  pose: MascotPose;
  alt?: string;
  priority?: boolean;
  className?: string;
};

export function Mascot({ pose, alt = "", priority = false, className }: MascotProps) {
  const { w, h } = poses[pose];
  return (
    <picture className={className}>
      <source srcSet={`/brand/mascot-${pose}.avif`} type="image/avif" />
      <source srcSet={`/brand/mascot-${pose}.webp`} type="image/webp" />
      <img
        src={`/brand/mascot-${pose}.webp`}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="h-auto w-full"
      />
    </picture>
  );
}

import type { SocialId } from "@/lib/site-config";

/**
 * Drawn for this site. Gold via currentColor. Not an icon-font or emoji.
 */
export function SocialIcon({ id }: { id: SocialId }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  if (id === "instagram") {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 10.5V16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="8" cy="8" r="0.9" fill="currentColor" />
        <path
          d="M12 16.5v-3.4c0-1.3.8-2.1 1.9-2.1 1.1 0 1.8.8 1.8 2.1v3.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M6 6.5 18 17.5M18 6.5 6 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

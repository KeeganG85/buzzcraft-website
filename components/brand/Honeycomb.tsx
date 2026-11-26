import styles from "./Honeycomb.module.css";

/**
 * Decorative honeycomb behind the page. Outlines only.
 * The tile draws each shared wall once per side of the repeat so the clipped
 * halves meet at one line weight.
 */
export function Honeycomb() {
  return (
    <div className={styles.root} aria-hidden="true">
      <svg className={styles.svg} focusable="false" width="100%" height="100%">
        <defs>
          <linearGradient id="bc-honeycomb-sheen" x1="0" y1="0" x2="0.2" y2="1">
            <stop className={styles.sheenHi} offset="0%" />
            <stop className={styles.sheenLo} offset="100%" />
          </linearGradient>
          <filter
            id="bc-honeycomb-glow"
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur" />
            <feFlood className={styles.glowFlood} result="color" />
            <feComposite in="color" in2="blur" operator="in" />
          </filter>
          <pattern
            id="bc-honeycomb-pattern"
            className={styles.pattern}
            patternUnits="userSpaceOnUse"
            width="62.3538"
            height="108"
          >
            <path
              className={styles.stroke}
              stroke="url(#bc-honeycomb-sheen)"
              d="M0 18 L0 54 L31.1769 72 L62.3538 54 L62.3538 18 L31.1769 0 Z"
            />
            <path
              className={styles.stroke}
              stroke="url(#bc-honeycomb-sheen)"
              d="M31.1769 72 L31.1769 108"
            />
          </pattern>
        </defs>
        <rect
          className={styles.glow}
          width="100%"
          height="100%"
          fill="url(#bc-honeycomb-pattern)"
          filter="url(#bc-honeycomb-glow)"
        />
        <rect className={styles.base} width="100%" height="100%" fill="url(#bc-honeycomb-pattern)" />
      </svg>
    </div>
  );
}

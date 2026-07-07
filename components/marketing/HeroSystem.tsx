"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked hero stage.
 *
 * A single rAF-throttled scroll observer writes one CSS custom property
 * (--hero-p, 0 → 1) on the wrapper. All animation derives from it in CSS via
 * transforms and opacity only — no layout properties, no per-element
 * listeners, no canvas. The headline, copy and CTAs arrive as server-rendered
 * children so the message never depends on JavaScript.
 *
 * prefers-reduced-motion swaps the sequence for a static connected-system
 * composition (handled in globals.css).
 */
export function HeroSystem({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      el.style.setProperty("--hero-p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-stage relative min-h-[180svh] md:min-h-[240svh]">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        {/* System grid backdrop */}
        <div aria-hidden="true" className="system-grid absolute inset-0" />

        {/* Scroll-driven system visual */}
        <SystemVisual />

        {/* Server-rendered headline, copy and CTAs */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

/** Decorative SVG: signal → three nodes → pathway → momentum loop. */
function SystemVisual() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-0 top-1/2 hidden h-[420px] w-full -translate-y-1/2 md:block"
      viewBox="0 0 1200 420"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Phase 0–20%: lone gold signal drifting through the grid */}
      <g className="hero-signal signal-pulse">
        <circle cx="180" cy="210" r="5" fill="#FFB300" />
        <circle cx="180" cy="210" r="14" stroke="#FFB300" strokeOpacity="0.35" />
      </g>

      {/* Phase 20–55%: continuous gold pathway connecting the nodes */}
      <path
        className="hero-path"
        d="M260 300 C 400 300, 460 130, 600 130 C 740 130, 800 300, 940 300"
        stroke="#FFB300"
        strokeWidth="2"
        pathLength={1}
        strokeLinecap="round"
      />

      {/* Three system nodes: Strategy, Visibility, Conversion */}
      <g className="hero-node" style={{ "--node-at": 0.22 } as React.CSSProperties}>
        <circle cx="260" cy="300" r="7" fill="#FFB300" />
        <circle cx="260" cy="300" r="20" stroke="#FFB300" strokeOpacity="0.3" />
        <text x="260" y="348" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="600">
          Strategy
        </text>
      </g>
      <g className="hero-node" style={{ "--node-at": 0.32 } as React.CSSProperties}>
        <circle cx="600" cy="130" r="7" fill="#FFB300" />
        <circle cx="600" cy="130" r="20" stroke="#4A90E2" strokeOpacity="0.45" />
        <text x="600" y="90" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="600">
          Visibility
        </text>
      </g>
      <g className="hero-node" style={{ "--node-at": 0.42 } as React.CSSProperties}>
        <circle cx="940" cy="300" r="7" fill="#FFB300" />
        <circle cx="940" cy="300" r="20" stroke="#FFB300" strokeOpacity="0.3" />
        <text x="940" y="348" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="600">
          Conversion
        </text>
      </g>

      {/* Phase 55–80%: the system condenses into a momentum loop */}
      <g className="hero-loop">
        <circle
          className="hero-loop-ring"
          cx="600"
          cy="215"
          r="58"
          stroke="#FFB300"
          strokeWidth="2.5"
          pathLength={1}
        />
        <circle cx="600" cy="157" r="5" fill="#FFB300" />
        <text x="600" y="222" textAnchor="middle" fill="#FFB300" fontSize="14" fontWeight="700" letterSpacing="2">
          MOMENTUM
        </text>
      </g>
    </svg>
  );
}

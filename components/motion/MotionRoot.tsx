"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveals load after first paint and only move transform and opacity.
 * The first section is left alone so the hero can paint. Without JS, copy stays
 * at its normal opacity because nothing in CSS hides it.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    document.documentElement.animate([{ opacity: 0.97 }, { opacity: 1 }], {
      duration: 150,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, [pathname]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let dead = false;
    let revert: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      void import("gsap").then(async ({ default: gsap }) => {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (dead) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          const sections = gsap.utils.toArray<HTMLElement>("main section").slice(1);
          sections.forEach((section) => {
            if (section.getBoundingClientRect().top < window.innerHeight * 0.85) return;
            const bits = section.querySelectorAll<HTMLElement>(
              ":scope h2, :scope article, :scope ol > li",
            );
            const targets = bits.length > 0 ? Array.from(bits) : [section];
            const stagger = Math.min(0.08, 0.45 / Math.max(targets.length, 1));
            gsap.from(targets, {
              opacity: 0,
              y: 12,
              duration: 0.6,
              ease: "power3.out",
              stagger,
              immediateRender: false,
              scrollTrigger: { trigger: section, start: "top 86%", once: true },
            });
          });
        });
        revert = () => ctx.revert();
      });
    }, 700);

    return () => {
      dead = true;
      window.clearTimeout(timer);
      revert?.();
    };
  }, [pathname]);

  return null;
}

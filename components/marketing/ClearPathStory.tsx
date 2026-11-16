"use client";

import { useEffect, useRef } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { buttonClass } from "@/components/ui/primitives";
import Link from "next/link";

const beats = [
  {
    id: "muddle",
    pose: "stressed-desk" as const,
    kicker: "The muddle",
    title: "Activity is not a system.",
    body: "Most businesses are not short of marketing. There is a website, some posts, the odd boosted ad, a WhatsApp number that rings. Each piece exists. None of them talk to each other, and the budget leaks out of the gaps.",
  },
  {
    id: "fix",
    pose: "flipchart" as const,
    kicker: "The fix",
    title: "From idea to customer.",
    body: "The replacement is a connection, not another isolated tactic. A page that answers the real question, a profile people nearby can find, and one next step that lands in WhatsApp where someone will see it.",
  },
];

export function ClearPathStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || narrow) return;

    let revert: (() => void) | undefined;
    let dead = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-beat]").forEach((beat) => {
          gsap.from(beat, {
            opacity: 0,
            y: 12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: beat, start: "top 78%", once: true },
          });
        });
      }, root);
      revert = () => ctx.revert();
    })();

    return () => {
      dead = true;
      revert?.();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="story-title" className="border-y border-white/10 bg-ink py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <p className="eyebrow">A shorter path</p>
        <h2 id="story-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          From a messy presence to a clear enquiry.
        </h2>
        <div className="mt-14 space-y-16">
          {beats.map((beat) => (
            <div
              key={beat.id}
              data-beat
              className="grid items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <Mascot pose={beat.pose} className="mx-auto w-full max-w-md" />
              <div>
                <p className="eyebrow">{beat.kicker}</p>
                <h3 className="mt-3 text-2xl font-semibold">{beat.title}</h3>
                <p className="mt-4 max-w-xl leading-7 text-mid">{beat.body}</p>
              </div>
            </div>
          ))}
          <div data-beat className="max-w-2xl">
            <h3 className="text-2xl font-semibold">Then someone has to answer.</h3>
            <p className="mt-4 leading-7 text-mid">
              The story ends at a conversation, not a slogan. WhatsApp is the fast path. The Scorecard
              is the free 15-point review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppLink className={buttonClass("primary")}>WhatsApp BuzzCraft</WhatsAppLink>
              <Link href="/scorecard/" className={buttonClass("secondary")}>
                Get my Scorecard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

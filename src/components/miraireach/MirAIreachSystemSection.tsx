"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import MagneticLink from "@/components/miraireach/MagneticLink";
import { MIRAIREACH_SYSTEM_URL } from "@/lib/miraireach-links";

const CREAM = "#f7f5f0";
const INK = "#1a1714";
const GOLD = "#D4AF37";
const MUTED = "rgba(26,23,20,0.55)";
const EASE = [0.16, 1, 0.3, 1] as const;

/** 漫画の原寸（manga-0N.png と一致） */
const MANGA_WIDTH = 2039;
const MANGA_HEIGHT = 2894;
const MANGA_DISPLAY_MAX = 896;

const MANGA_PAGES = [
  {
    src: "/miraireach/manga-01.png",
    alt: "mirAIreach comic page 1: customers walk past the cafe because AI search sends them to a competitor",
    caption: "Part 1 — The AI search era is already deciding where customers go.",
  },
  {
    src: "/miraireach/manga-02.png",
    alt: "mirAIreach comic page 2: Google AI Overviews, GEO, and the four key features of mirAIreach",
    caption: "Part 2 — AIO, GEO, and how mirAIreach strengthens Local SEO.",
  },
  {
    src: "/miraireach/manga-03.png",
    alt: "mirAIreach comic page 3: sync across 100+ platforms and win AI recommendations",
    caption: "Part 3 — Broadcast your shop everywhere AI looks—and win the recommendation.",
  },
] as const;

function MangaPageImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="flex justify-center px-2 pb-2 pt-1 md:px-4 md:pb-3">
      <img
        src={src}
        alt={alt}
        width={MANGA_WIDTH}
        height={MANGA_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-auto w-full"
        style={{ maxWidth: MANGA_DISPLAY_MAX }}
      />
    </div>
  );
}

export default function MirAIreachSystemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const reduce = useReducedMotion();

  return (
    <section
      ref={ref}
      id="miraireach-system"
      aria-labelledby="miraireach-system-heading"
      className="scroll-mt-28 border-b border-black/[0.06] bg-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center md:text-left"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
            mirAIreach system
          </p>
          <h2
            id="miraireach-system-heading"
            className="mt-3 font-serif text-3xl font-medium leading-[1.12] tracking-tight md:text-[2.65rem]"
            style={{ color: INK }}
          >
            How mirAIreach works —{" "}
            <span style={{ color: GOLD }}>in three chapters</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-gray-700 md:mx-0 md:text-lg">
            A quick visual guide to AI search optimization: why visibility matters, what mirAIreach does, and how
            Dubai &amp; UAE operators win recommendations across Google AI, Maps, and the open web.
          </p>
        </motion.div>

        <ol className="mt-12 space-y-10 md:mt-14 md:space-y-12">
          {MANGA_PAGES.map((page, i) => (
            <motion.li
              key={page.src}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: reduce ? 0 : 0.08 + i * 0.1, duration: 0.85, ease: EASE }}
              className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#faf8f5] shadow-[0_20px_60px_-32px_rgba(26,23,20,0.2)]"
            >
              <p
                className="border-b border-black/[0.06] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: MUTED, backgroundColor: CREAM }}
              >
                {page.caption}
              </p>
              <MangaPageImage src={page.src} alt={page.alt} priority={i === 0} />
            </motion.li>
          ))}
        </ol>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-[#D4AF37]/35 px-6 py-8 text-center md:mt-14 md:flex-row md:justify-between md:text-left"
          style={{ backgroundColor: `${GOLD}10` }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduce ? 0 : 0.35, duration: 0.75, ease: EASE }}
        >
          <div>
            <p className="font-serif text-xl font-medium md:text-2xl" style={{ color: INK }}>
              Ready for the full mirAIreach system?
            </p>
            <p className="mt-2 text-sm font-medium text-gray-600 md:text-base">
              Features, comparison, case studies, and onboarding steps on the dedicated overview.
            </p>
          </div>
          <MagneticLink
            href={MIRAIREACH_SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1714] shadow-[0_12px_36px_-12px_rgba(212,175,55,0.55)]"
          >
            Full system overview <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
}

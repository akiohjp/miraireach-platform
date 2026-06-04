"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Megaphone,
  MousePointerClick,
  Rocket,
  Target,
} from "lucide-react";
import RevealStaggerGroup from "@/components/miraireach/RevealStaggerGroup";
import ScrollParallax from "@/components/miraireach/ScrollParallax";
import MagneticLink from "@/components/miraireach/MagneticLink";
import GamRevealMaskLine from "@/components/gam/GamRevealMaskLine";
import {
  ADS_EDITORIAL_MOBILE,
  ADS_EDITORIAL_SIDE,
  CREAM,
  EASE,
  G_ADS_PRIMARY,
  G_BRAND_BAR,
  GOLD,
  INK,
  MUTED,
} from "@/components/gam/gam-lp-tokens";
import { GAM_MISSION_AND_VISION_BLOCKS } from "@/content/gamAboutCopy";
import { GAM_FAQ_ITEMS } from "@/content/gamFaq";
import { GOOGLE_AI_ADS_WHY_CHOOSE } from "@/content/googleAiAdsCopy";
import { MIRAIREACH_SYSTEM_URL } from "@/lib/miraireach-links";

const EXPLORE_NAV = [
  { label: "Google AI Ads", href: "#google-ai-ads" },
  { label: "Mission", href: "#story" },
  { label: "What we offer", href: "#what-we-offer" },
  { label: "How it connects", href: "#how-it-connects" },
  { label: "FAQ", href: "#faq" },
] as const;

function ExplorePageHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-md md:px-10"
      style={{
        backgroundColor: scrolled ? "rgba(247, 245, 240, 0.94)" : "rgba(247, 245, 240, 0.88)",
        borderColor: "rgba(26, 23, 20, 0.08)",
        color: INK,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-600 hover:text-gray-900">
          ← Home
        </Link>
        <span className="font-serif text-base tracking-wide md:text-lg">
          GAM <span style={{ color: GOLD }}>solutions</span>
        </span>
        <Link
          href="/contact"
          className="rounded-full border border-[#1a1714]/25 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.22em] hover:border-[#1a1714]/45"
        >
          contact
        </Link>
      </div>
      <nav
        className="mx-auto mt-3 flex max-w-6xl flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600"
        aria-label="On this page"
      >
        {EXPLORE_NAV.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors hover:text-gray-900">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ExplorePageIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <section
      ref={ref}
      className="border-b border-black/[0.06] px-6 py-14 md:px-12 md:py-20"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-3xl">
        <motion.p
          className="text-[10px] font-bold uppercase tracking-[0.32em]"
          style={{ color: GOLD }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Services &amp; company
        </motion.p>
        <motion.h1
          className="mt-3 font-serif text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: EASE }}
        >
          Google AI Ads, mission, and how we{" "}
          <span style={{ color: GOLD }}>connect the stack</span>
        </motion.h1>
        <motion.p
          className="mt-5 text-base font-medium leading-relaxed text-gray-700 md:text-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
        >
          Paid acquisition, capabilities, Dubai &amp; UAE positioning, and FAQs — everything beyond the product
          overview on the homepage.
        </motion.p>
      </div>
    </section>
  );
}

/** Color bar + copy so the block reads as Google Ads + AI (Search, Ads Advisor, etc.). */
function GoogleAdsEcosystemRibbon() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-gradient-to-br from-white to-gray-50 px-4 py-3.5 shadow-sm sm:flex-row sm:items-start sm:gap-4">
      <div className="flex items-center gap-2 sm:pt-0.5" aria-hidden>
        <div className="flex gap-1">
          {G_BRAND_BAR.map((c) => (
            <span key={c} className="h-10 w-2 rounded-full shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span
          className="hidden h-10 w-px bg-black/10 sm:block"
          aria-hidden
        />
        <div className="flex gap-2 text-gray-700">
          <Megaphone className="h-5 w-5 shrink-0 text-[#4285F4]" strokeWidth={2} aria-hidden />
          <BarChart3 className="h-5 w-5 shrink-0 text-[#EA4335]" strokeWidth={2} aria-hidden />
          <MousePointerClick className="h-5 w-5 shrink-0 text-[#34A853]" strokeWidth={2} aria-hidden />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">Google Ads powered growth</p>
        <p className="text-sm font-bold leading-snug text-gray-900 md:text-base">
          <span style={{ color: G_ADS_PRIMARY }}>Search</span>
          <span className="text-gray-400"> · </span>
          <span className="font-bold text-gray-900">Ads Advisor (beta)</span>
          <span className="text-gray-400"> · </span>
          Demand Gen
          <span className="text-gray-400"> · </span>
          YouTube
        </p>
        <p className="text-xs font-medium leading-relaxed text-gray-600 md:text-[13px]">
          Ads Advisor (beta) is a conversational agent built with the Gemini family of models. It is designed to assist
          with campaign performance, optimization, and reporting.
        </p>
      </div>
    </div>
  );
}

function GoogleAdsMicroGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 pt-1">
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl ring-1 ring-black/[0.08]">
        <Image
          src={ADS_EDITORIAL_SIDE}
          alt="Campaign analytics dashboards and performance reporting on a screen"
          fill
          sizes="(max-width: 1024px) 45vw, 220px"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#1a73e8]/25 to-transparent"
          aria-hidden
        />
        <p className="absolute bottom-2 left-2 right-2 rounded-md bg-black/45 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px] md:text-[10px]">
          Live performance &amp; pacing
        </p>
      </div>
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl ring-1 ring-black/[0.08]">
        <Image
          src={ADS_EDITORIAL_MOBILE}
          alt="Mobile placements and on-the-go demand generation"
          fill
          sizes="(max-width: 1024px) 45vw, 220px"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#34A853]/20 to-transparent"
          aria-hidden
        />
        <p className="absolute bottom-2 left-2 right-2 rounded-md bg-black/45 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px] md:text-[10px]">
          Feed &amp; Demand Gen surfaces
        </p>
      </div>
    </div>
  );
}

/** Inline **bold** and *italic* in Google Ads copy strings. */
function RichAdsCopy({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((p) => p.length > 0);
  return (
    <>
      {parts.map((chunk, i) => {
        if (chunk.startsWith("**") && chunk.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-gray-900">
              {chunk.slice(2, -2)}
            </strong>
          );
        }
        if (chunk.startsWith("*") && chunk.endsWith("*")) {
          return (
            <em key={i} className="italic text-gray-800">
              {chunk.slice(1, -1)}
            </em>
          );
        }
        return <span key={i}>{chunk}</span>;
      })}
    </>
  );
}

function GoogleAdsWhyChooseDeepDive({ inView }: { inView: boolean }) {
  const { heading, lead, items } = GOOGLE_AI_ADS_WHY_CHOOSE;

  return (
    <div className="mt-14 border-t border-black/[0.06] pt-12 md:mt-20 md:pt-16">
      <motion.div
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-[#1a73e8]/25"
          style={{
            background: `linear-gradient(145deg, ${G_ADS_PRIMARY}18, #fff)`,
          }}
          aria-hidden
        >
          <Rocket className="h-7 w-7 text-[#1a73e8]" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-gray-500 md:text-[11px]">
            Strategic pillars
          </p>
          <h3 className="font-serif text-2xl font-medium leading-snug tracking-tight text-gray-900 md:text-3xl">
            {heading}
          </h3>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-gray-700 md:text-lg">{lead}</p>
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((item, idx) => (
          <motion.article
            key={item.n}
            className={
              item.n === 5
                ? "rounded-2xl border border-black/[0.07] bg-gradient-to-br from-[#f8fafc] to-white p-5 shadow-sm ring-1 ring-[#1a73e8]/10 md:col-span-2 md:p-7"
                : "rounded-2xl border border-black/[0.06] bg-gradient-to-br from-white to-gray-50/80 p-5 shadow-sm md:p-6"
            }
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.06 + idx * 0.05, duration: 0.65, ease: EASE }}
          >
            <div className="flex gap-4 md:gap-5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
                style={{ backgroundColor: G_ADS_PRIMARY }}
                aria-hidden
              >
                {item.n}
              </span>
              <div className="min-w-0">
                <h4 className="font-serif text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a73e8] md:text-xs">
                  {item.subtitle}
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
                  <RichAdsCopy text={item.body} />
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/** Suggests signed-in Google Ads without using Google trademarks as artwork. */
function GoogleAdsOmnibarStrip() {
  return (
    <div className="border-b border-black/[0.06] bg-gradient-to-b from-gray-100/95 to-gray-50/80 px-4 py-2.5 md:px-5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 opacity-40" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex min-h-[2.25rem] min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/[0.06]">
          <span className="text-xs" aria-hidden>
            🔒
          </span>
          <span className="truncate font-mono text-[11px] font-medium text-gray-700 md:text-xs">
            ads.google.com<span className="text-gray-400">/aw/campaigns/overview</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** 旧トップの「AI-Managed Google Ads」相当 — ダッシュボード付きで有償獲得を提示 */
function GoogleAiAdsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section ref={ref} id="google-ai-ads" className="border-b border-black/[0.06] bg-white px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-5">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-600 md:text-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Paid acquisition
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <GoogleAdsEcosystemRibbon />
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1 ring-[#1a73e8]/20"
              style={{ background: `linear-gradient(135deg, ${G_ADS_PRIMARY}12, #fff)` }}
            >
              <Target className="h-6 w-6 text-[#1a73e8]" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex gap-2">
              {G_BRAND_BAR.map((c) => (
                <span key={c} className="h-2 w-2 rounded-full ring-2 ring-black/[0.04]" style={{ backgroundColor: c }} />
              ))}
            </div>
          </motion.div>
          <motion.h2
            className="font-serif text-3xl font-medium leading-[1.1] tracking-tight md:text-[2.4rem]"
            style={{ color: INK }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.75, ease: EASE }}
          >
            AI-managed
            <br />
            <span style={{ color: GOLD }}>Google Ads.</span>
          </motion.h2>
          <motion.p
            className="max-w-xl text-base font-medium leading-relaxed text-gray-700 md:text-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
          >
            Traditional agencies guess. Our AI optimizes every dirham of your ad spend in real time for Dubai and UAE
            audiences—targeting the right audience at the right moment with the right message. ROI that manual campaign
            managers simply can&apos;t match.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.75, ease: EASE }}
          >
            <GoogleAdsMicroGallery />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
          >
            <MagneticLink
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-black md:px-10 md:py-5"
            >
              Maximize my ad spend <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </MagneticLink>
          </motion.div>
        </div>

        <motion.div
          className="overflow-hidden rounded-3xl border border-black/[0.06] shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.85, ease: EASE }}
        >
          <GoogleAdsOmnibarStrip />
          <GoogleAdsRoiCard nested />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl">
        <GoogleAdsWhyChooseDeepDive inView={inView} />
      </div>
    </section>
  );
}

function GoogleAdsRoiCard({ nested }: { nested?: boolean }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;
  const reduce = useReducedMotion();
  /** Upward ROI curve in viewBox 0 0 100 42 */
  const linePath =
    "M 2 36 L 18 32 L 34 26 L 50 19 L 66 12 L 82 7 L 97 4";
  const areaPath = `${linePath} L 99 42 L 0 42 Z`;

  const wrap = nested
    ? "rounded-b-3xl border-0 bg-white p-6 shadow-none md:p-8"
    : "rounded-3xl border border-black/[0.06] bg-white p-6 shadow-xl md:p-8";

  return (
    <div className={wrap}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Ad ROI — 6 month trend
          </p>
          <p className="font-serif text-4xl font-semibold tabular-nums text-gray-900 md:text-5xl">+247%</p>
        </div>
        <div className="shrink-0 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
          ▲ AI optimized
        </div>
      </div>

      <div className="relative mb-4 h-[150px] overflow-hidden rounded-2xl ring-1 ring-black/[0.06] md:h-[170px]">
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=82"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          priority={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0e0c]/88 via-[#1a1714]/45 to-[#1a1714]/15"
          aria-hidden
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 42"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="adsRoiArea" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
              <stop offset="55%" stopColor={GOLD} stopOpacity="0.35" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.55" />
            </linearGradient>
            <filter id="adsRoiGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={areaPath} fill="url(#adsRoiArea)" opacity={0.9} />
          <motion.path
            d={linePath}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#adsRoiGlow)"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 1.75, ease: EASE }}
          />
        </svg>
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute right-[4%] top-[14%] h-2 w-2 rounded-full"
            style={{
              backgroundColor: GOLD,
              boxShadow: `0 0 12px ${GOLD}, 0 0 24px rgba(212,175,55,0.35)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.35, duration: 0.4, ease: EASE }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-10">
          {months.map((m) => (
            <span key={m} className="text-[10px] font-semibold tracking-wide text-white/85 md:text-[11px]">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
        {[
          { label: "CPC reduction", val: "−62%" },
          { label: "Conversion ▲", val: "+89%" },
          { label: "Audience match", val: "96%" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-base font-bold tabular-nums text-gray-900 md:text-lg">{s.val}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 md:text-[11px]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Mission & vision — copy shared with /about (see gamAboutCopy.ts) */
function ManifestoSection() {
  const blocks = GAM_MISSION_AND_VISION_BLOCKS;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduce = useReducedMotion();

  return (
    <section
      id="story"
      ref={ref}
      className="px-6 py-24 md:px-12 md:py-36"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-3xl">
        <motion.p
          className="mb-10 text-[10px] uppercase tracking-[0.35em]"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          mission & vision
        </motion.p>
        <div className="space-y-8 md:space-y-10">
          {blocks.map((block, i) =>
            reduce ? (
              <p
                key={`manifesto-${i}`}
                className="font-serif text-lg leading-relaxed tracking-tight text-pretty md:text-xl md:leading-relaxed"
                style={{ color: INK }}
              >
                {block}
              </p>
            ) : (
              <GamRevealMaskLine
                key={`manifesto-${i}`}
                active={inView}
                delay={i * 0.14}
                className="font-serif text-lg leading-relaxed tracking-tight text-pretty md:text-xl md:leading-relaxed"
              >
                <p
                  className="font-serif text-lg leading-relaxed tracking-tight text-pretty md:text-xl md:leading-relaxed"
                  style={{ color: INK }}
                >
                  {block}
                </p>
              </GamRevealMaskLine>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function TimelineStrip() {
  const steps = [
    {
      y: "2026",
      t: "Deploying AI marketing systems proven in Japan—now packaged for Dubai marketing and UAE-wide digital marketing. Gain first-mover advantage with GEO, Dubai AIO programs, and automation built for the Emirates.",
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-t border-black/[0.06] px-6 py-20 md:px-12 md:py-28"
      style={{ backgroundColor: "#f0ebe3" }}
    >
      <div ref={ref} className="mx-auto max-w-3xl">
        {steps.map((s, i) => (
          <motion.div
            key={s.y}
            initial={{ opacity: 0, y: reduce ? 0 : 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reduce ? 0 : 0.08 + i * 0.15, duration: 1, ease: EASE }}
          >
            <span className="font-serif text-3xl md:text-5xl" style={{ color: GOLD }}>
              {s.y}
            </span>
            <p className="mt-6 text-base leading-relaxed md:text-lg" style={{ color: MUTED }}>
              {s.t}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const capList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const capItem = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE },
  },
};

const capItemReduced = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const CAPABILITIES = [
  {
    title: "mirAIreach",
    sub: "Flagship engine",
    body: "Dubai and UAE AI marketing core: reputation, reviews, and flows tuned for how people actually decide—Maps, AI answers, and digital marketing in one lane.",
    href: "/#miraireach-system",
  },
  {
    title: "GEO & AI Search",
    sub: "Generative engine optimization",
    body: "GEO for ChatGPT-class answers, Google AI Overviews, Perplexity-style discovery, and Dubai AIO visibility—structured so AI recommends your brand in the Emirates.",
    href: "/contact",
  },
  {
    title: "Directory sync",
    sub: "Everywhere local",
    body: "100+ listings aligned for UAE-wide Dubai marketing: maps, voice, and mobile search tell one true story from Abu Dhabi to Dubai and beyond.",
    href: "/contact",
  },
  {
    title: "Campaign layer",
    sub: "Ads that learn",
    body: "Performance creative and targeting that feeds AI memory about your brand—digital marketing and paid media aligned with GEO and AIO signals.",
    href: "/contact",
  },
];

function CapabilitiesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduce = useReducedMotion();

  return (
    <section
      id="what-we-offer"
      aria-label="What we offer"
      className="scroll-mt-28 px-6 py-24 md:px-12 md:py-32"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-6xl">
        <RevealStaggerGroup staggerMs={140}>
          <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: MUTED }}>
            what we offer
          </p>
          <h2 className="mt-4 mb-4 font-serif text-4xl md:text-5xl" style={{ color: INK }}>
            When intent becomes infrastructure—in Dubai, Abu Dhabi, and across the UAE.
          </h2>
          <p className="mb-16 max-w-2xl text-base leading-relaxed md:mb-20" style={{ color: MUTED }}>
            One spine for AI marketing, GEO, digital marketing, and paid layers—aligned to how buyers discover brands
            in the Emirates, from AI answers to maps and the open web.
          </p>
        </RevealStaggerGroup>

        <motion.div
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 md:gap-8"
          variants={capList}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {CAPABILITIES.map((c) => (
            <motion.article
              key={c.title}
              variants={reduce ? capItemReduced : capItem}
              className="group relative rounded-2xl border p-8 transition-shadow duration-500 md:p-10"
              style={{
                borderColor: "rgba(26,23,20,0.08)",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
              whileHover={
                reduce
                  ? {}
                  : {
                      borderColor: "rgba(212,175,55,0.35)",
                      backgroundColor: "rgba(255,255,255,0.88)",
                      y: -4,
                      transition: { duration: 0.45, ease: EASE },
                    }
              }
            >
              <h3 className="font-serif text-2xl" style={{ color: INK }}>
                {c.title}
              </h3>
              <p className="mt-2 mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                {c.sub}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                {c.body}
              </p>
              <Link
                href={c.href}
                className="mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: INK }}
              >
                explore <ArrowUpRight size={14} />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PlatformStatement() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  return (
    <section
      id="how-it-connects"
      aria-label="How it connects"
      ref={ref}
      className="scroll-mt-28 relative overflow-hidden px-6 py-28 md:px-12 md:py-44"
      style={{ backgroundColor: INK, color: CREAM }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 20% 40%, rgba(212,175,55,0.15), transparent 50%)",
        }}
        aria-hidden
        animate={
          reduce
            ? {}
            : {
                opacity: [0.22, 0.32, 0.22],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <ScrollParallax strength={reduce ? 8 : 28} className="relative mx-auto max-w-4xl text-center">
        <motion.span
          className="text-[10px] uppercase tracking-[0.35em]"
          style={{ color: "rgba(247,245,240,0.45)" }}
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={inView ? { opacity: 1, letterSpacing: "0.35em" } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          how it connects
        </motion.span>
        <motion.h2
          className="mt-8 font-serif text-3xl leading-tight md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.05, ease: EASE }}
        >
          One spine.
          <br />
          <span style={{ color: GOLD }}>Every channel.</span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-10 max-w-2xl text-base font-light leading-relaxed md:text-lg"
          style={{ color: "rgba(247,245,240,0.72)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 1, ease: EASE }}
        >
          Built for operators in Dubai and the UAE who want craft-grade AI marketing and digital marketing execution—
          GEO, Dubai AIO, and performance tempo without losing coherence.
        </motion.p>
        <motion.div
          className="mt-14 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.32, duration: 0.85, ease: EASE }}
        >
          <MagneticLink
            href={MIRAIREACH_SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-sm bg-[#f7f5f0] px-10 py-4 text-sm font-bold tracking-wide text-[#1a1714] shadow-lg shadow-black/25 transition hover:opacity-95 hover:shadow-xl md:px-12 md:py-5 md:text-[0.9375rem]"
          >
            mirAIreach overview <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
          </MagneticLink>
        </motion.div>
      </ScrollParallax>
    </section>
  );
}

/** Dubai / UAE — crawler-visible English SEO block. */
function SeoDubaiUaeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduce = useReducedMotion();

  return (
    <section
      id="dubai-uae-ai-marketing"
      ref={ref}
      aria-labelledby="seo-dubai-uae-heading"
      className="scroll-mt-28 border-t border-black/[0.06] bg-[#faf8f5] px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="text-[10px] uppercase tracking-[0.35em]"
          style={{ color: MUTED }}
        >
          Dubai · UAE
        </p>
        <h2
          id="seo-dubai-uae-heading"
          className="mt-4 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl"
          style={{ color: INK }}
        >
          AI marketing, GEO &amp; Dubai AIO for the{" "}
          <span style={{ color: GOLD }}>UAE</span>
        </h2>
        <motion.p
          className="mt-8 text-base font-light leading-relaxed md:text-lg"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
        >
          GAM solutions builds{" "}
          <strong className="font-medium" style={{ color: INK }}>
            digital marketing
          </strong>{" "}
          and{" "}
          <strong className="font-medium" style={{ color: INK }}>
            AI marketing
          </strong>{" "}
          infrastructure for operators in{" "}
          <strong className="font-medium" style={{ color: INK }}>
            Dubai
          </strong>{" "}
          and across the{" "}
          <strong className="font-medium" style={{ color: INK }}>
            United Arab Emirates (UAE)
          </strong>
          . We combine{" "}
          <strong className="font-medium" style={{ color: INK }}>
            GEO
          </strong>{" "}
          (generative engine optimization)—ChatGPT-style systems, Perplexity-class discovery, and Google AI surfaces—with{" "}
          <strong className="font-medium" style={{ color: INK }}>
            Dubai AIO
          </strong>{" "}
          and AI-overviews-style visibility, plus reputation, reviews, and maps—so your brand is
          recommended where buyers search in the Emirates.
        </motion.p>
        <motion.p
          className="mt-6 text-base font-light leading-relaxed md:text-lg"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduce ? 0 : 0.08, duration: 0.75, ease: EASE }}
        >
          <strong className="font-medium" style={{ color: INK }}>
            Dubai marketing
          </strong>{" "}
          in the UAE now spans classic search, social, maps, and generative AI answers. Whether you serve tourists on
          Sheikh Zayed Road or B2B buyers in Business Bay, our stack aligns{" "}
          <strong className="font-medium" style={{ color: INK }}>
            digital marketing
          </strong>
          ,{" "}
          <strong className="font-medium" style={{ color: INK }}>
            AI
          </strong>
          -driven discovery, and{" "}
          <strong className="font-medium" style={{ color: INK }}>
            GEO
          </strong>{" "}
          so your brand is cited where decisions are formed across the Emirates.
        </motion.p>
      </div>
    </section>
  );
}

function FaqSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="faq"
      ref={ref}
      aria-labelledby="faq-heading"
      className="scroll-mt-28 border-t border-black/[0.06] bg-white px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <RevealStaggerGroup staggerMs={120}>
          <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: MUTED }}>
            faq
          </p>
          <h2 id="faq-heading" className="mt-4 font-serif text-4xl md:text-5xl" style={{ color: INK }}>
            Frequently asked questions
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: MUTED }}>
            Straight answers on mirAIreach, AI marketing, GEO, and Dubai operations across the UAE.
          </p>
        </RevealStaggerGroup>

        <div className="mt-12 space-y-3">
          {GAM_FAQ_ITEMS.map((item, i) => {
            const open = openIdx === i;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: reduce ? 0 : 0.06 + i * 0.05, duration: 0.55, ease: EASE }}
                className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f7f5f0]/50"
                style={
                  open
                    ? {
                        borderColor: "rgba(212,175,55,0.28)",
                        boxShadow: "0 12px 40px -16px rgba(26,23,20,0.14)",
                      }
                    : { borderColor: "rgba(26,23,20,0.06)" }
                }
              >
                <h3 className="m-0 font-normal">
                  <button
                    type="button"
                    id={`faq-trigger-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIdx((prev) => (prev === i ? null : i))}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-black/[0.02] md:px-8 md:py-6"
                  >
                    <span className="font-serif text-lg leading-snug md:text-xl" style={{ color: INK }}>
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      strokeWidth={1.5}
                      style={{ color: GOLD }}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className="border-t border-black/[0.05] px-6 pb-6 pt-4 text-base font-light leading-relaxed md:px-8 md:pb-8"
                      style={{ color: MUTED }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  return (
    <section
      ref={ref}
      className="px-6 py-28 md:px-12 md:py-36"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-4xl text-center">
        {reduce ? (
          <h2 className="font-serif text-4xl leading-[1.08] md:text-6xl" style={{ color: INK }}>
            Ready to be found
            <br />
            <span style={{ color: GOLD }}>everywhere.</span>
          </h2>
        ) : (
          <h2 className="m-0 p-0 font-normal font-serif text-4xl leading-[1.08] md:text-6xl" style={{ color: INK }}>
            <GamRevealMaskLine active={inView} delay={0} className="block">
              <span className="block">Ready to be found</span>
            </GamRevealMaskLine>
            <div className="mt-2">
              <GamRevealMaskLine active={inView} delay={0.12} className="block">
                <span className="block" style={{ color: GOLD }}>
                  everywhere.
                </span>
              </GamRevealMaskLine>
            </div>
          </h2>
        )}
        <motion.p
          className="mx-auto mt-8 max-w-xl text-base"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.95, ease: EASE }}
        >
          Tell us your Dubai and UAE markets—we’ll map GEO, Dubai AIO, and reputation work that closes the gap.
        </motion.p>
        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
        >
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#D4AF37] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
          >
            Book a consultation <ArrowUpRight size={16} />
          </MagneticLink>
          <Link
            href="/contact"
            className="border-b border-black/20 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-black/50"
            style={{ color: INK }}
          >
            Or write to info.ae@miraireach.marketing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function GamExplorePage() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="relative w-full" style={{ backgroundColor: CREAM, color: INK }}>
      <ExplorePageHeader />
      <main>
        <ExplorePageIntro />
        <GoogleAiAdsSection />
        <ManifestoSection />
        <TimelineStrip />
        <CapabilitiesGrid />
        <PlatformStatement />
        <SeoDubaiUaeSection />
        <FaqSection />
        <ClosingCta />
      </main>
    </div>
  );
}

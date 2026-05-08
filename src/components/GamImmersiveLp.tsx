"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, CheckCircle, ChevronDown, Globe, MapPin, Megaphone, Menu, MousePointerClick, Star, Target, X } from "lucide-react";
import RevealStaggerGroup from "@/components/miraireach/RevealStaggerGroup";
import ScrollParallax from "@/components/miraireach/ScrollParallax";
import MagneticLink from "@/components/miraireach/MagneticLink";
import EcosystemFlowAnimation from "@/components/miraireach/EcosystemFlowAnimation";
import LocalReachShowcase from "@/components/miraireach/LocalReachShowcase";
import LocalReachProductionPreviews from "@/components/localreach/LocalReachProductionPreviews";
import { GAM_MISSION_AND_VISION_BLOCKS } from "@/content/gamAboutCopy";
import { GAM_FAQ_ITEMS } from "@/content/gamFaq";

const CREAM = "#f7f5f0";
const INK = "#1a1714";
const GOLD = "#D4AF37";
const MUTED = "rgba(26,23,20,0.55)";

/** Google product UI / brand-adjacent accents (informative only — not official logo artwork). */
const G_ADS_PRIMARY = "#1a73e8";
const G_BRAND_BAR = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;

/** Editorial: paid media / dashboards (Unsplash — no Google logos in-frame). */
const ADS_EDITORIAL_SIDE =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=82";
const ADS_EDITORIAL_MOBILE =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=82";

/** Dubai skyline（Unsplash）— 本番で差し替え可 */
const HERO_DUBAI_IMAGE =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=88";
const HERO_TEXT_LIGHT = "#f7f5f0";
const HERO_MUTED_LIGHT = "rgba(255,255,255,0.74)";

/** Editorial / peace-put系：ゆっくり落ち着いた減速 */
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING_SCROLL = { stiffness: 42, damping: 28, mass: 0.85 };

/** In-page sections (labels are plain language; anchors match IDs below) */
const NAV = [
  { label: "what we offer", href: "#what-we-offer" },
  { label: "how it connects", href: "#how-it-connects" },
  { label: "LocalReach", href: "/localreach" },
  { label: "about", href: "/about" },
];

/** 専用 LP（今後コンテンツ追加）— リンク先はここに集約 */
export const MIRAIREACH_LP_PATH = "/lp/miraireach";

/* ── クリップマスクで一行ずつ「緩く」顔を出す ─────────────────────── */
function RevealMaskLine({
  children,
  active,
  delay,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "108%" }}
        animate={active ? { y: 0 } : {}}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        <div className={className}>{children}</div>
      </motion.div>
    </div>
  );
}

/* ── 上部プログレス：スプリングで追従（ヒーロー上はライトUI） ───────── */
function ScrollPercentRibbon() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, SPRING_SCROLL);
  const pctRaw = useTransform(smooth, [0, 1], [0, 100]);
  const [pct, setPct] = useState(0);
  const [inkMode, setInkMode] = useState(false);

  useEffect(() => {
    const unsub = pctRaw.on("change", (v) => setPct(Math.round(v)));
    return unsub;
  }, [pctRaw]);

  useEffect(() => {
    const onScroll = () => setInkMode(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lineColor = inkMode ? INK : "rgba(255,255,255,0.92)";
  const trackColor = inkMode ? "bg-black/[0.06]" : "bg-white/[0.12]";
  const labelColor = inkMode ? MUTED : "rgba(255,255,255,0.5)";

  return (
    <>
      <div className={`pointer-events-none fixed top-0 right-0 left-0 z-[100] h-px ${trackColor}`} aria-hidden />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[101] h-0.5 w-full origin-left will-change-transform"
        style={{
          scaleX: reduce ? scrollYProgress : smooth,
          backgroundColor: lineColor,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed top-[5.25rem] left-5 z-[102] font-mono text-[11px] tabular-nums tracking-[0.2em] transition-colors duration-300 md:left-8"
        style={{ color: labelColor }}
        aria-live="polite"
      >
        {pct}%
      </div>
    </>
  );
}

function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col"
          style={{ backgroundColor: CREAM }}
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE }}
        >
          <motion.div
            className="flex items-center justify-between border-b px-6 py-6 md:px-10"
            style={{ borderColor: "rgba(26,23,20,0.08)" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <span className="font-serif text-base tracking-wide md:text-lg" style={{ color: INK }}>
              <span className="inline-flex items-baseline gap-x-2">
                <span>GAM</span>
                <span style={{ color: GOLD }}>solutions</span>
              </span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-black/[0.04]"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.2} style={{ color: INK }} />
            </button>
          </motion.div>
          <nav className="flex flex-1 flex-col justify-center gap-10 px-8 md:gap-12 md:px-16">
            {/* メインシステム — 専用 LP へ（後からコンテンツ追加） */}
            <motion.div
              initial={{ opacity: 0, y: 44, filter: reduce ? "blur(0px)" : "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.18, duration: 0.95, ease: EASE }}
            >
              <Link
                href={MIRAIREACH_LP_PATH}
                onClick={onClose}
                className="group block max-w-2xl rounded-2xl border border-[#D4AF37]/35 bg-[rgba(26,23,20,0.03)] px-6 py-8 shadow-[0_24px_60px_-28px_rgba(26,23,20,0.25)] transition-[border-color,box-shadow] hover:border-[#D4AF37]/55 hover:shadow-[0_28px_70px_-24px_rgba(212,175,55,0.18)] md:px-8 md:py-10"
              >
                <span
                  className="mb-3 inline-block rounded-full border border-[#D4AF37]/40 bg-[#1a1714] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]"
                >
                  Main system
                </span>
                <span className="block font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                  <span style={{ color: INK }}>mir</span>
                  <span style={{ color: GOLD }}>AI</span>
                  <span style={{ color: INK }}>reach</span>
                </span>
                <span className="mt-4 flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-[#1a1714]/55 group-hover:text-[#1a1714]/75 md:text-sm">
                  Dedicated mirAIreach page
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </span>
              </Link>
            </motion.div>

            <div className="flex flex-col gap-8 md:gap-10">
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 36, filter: reduce ? "blur(0px)" : "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.38 + i * 0.09,
                  duration: 0.85,
                  ease: EASE,
                }}
              >
                {item.href.startsWith("/") ? (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block font-serif text-3xl tracking-tight transition-opacity hover:opacity-70 md:text-5xl"
                    style={{ color: INK }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="block font-serif text-3xl tracking-tight transition-opacity hover:opacity-70 md:text-5xl"
                    style={{ color: INK }}
                  >
                    {item.label}
                  </a>
                )}
              </motion.div>
            ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            >
              <MagneticLink
                href="/contact"
                className="inline-flex items-center gap-2 border-b border-[#1a1714] pb-1 text-[12px] font-bold uppercase tracking-[0.25em] text-[#1a1714]"
              >
                contact <ArrowUpRight size={16} />
              </MagneticLink>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroBlock() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIntro(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, reduce ? 40 : 72]);
  const y = useSpring(yRaw, SPRING_SCROLL);
  const opRaw = useTransform(scrollYProgress, [0, 0.52], [1, 0]);
  const opacity = useSpring(opRaw, SPRING_SCROLL);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-20 pt-28 md:px-12 md:pb-32 md:pt-36"
    >
      {/* ── Dubai 写真（オープニングでスケールイン + 軽い Ken Burns） ── */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.15, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
          >
            <div className="relative h-full min-h-[100svh] w-full overflow-hidden">
              {reduce ? (
                <Image
                  src={HERO_DUBAI_IMAGE}
                  alt="Dubai skyline"
                  fill
                  priority
                  className="object-cover object-[center_32%]"
                  sizes="100vw"
                  quality={88}
                />
              ) : (
                <motion.div
                  className="relative h-full min-h-[100svh] w-full"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{
                    duration: 32,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "50% 40%" }}
                >
                  <Image
                    src={HERO_DUBAI_IMAGE}
                    alt="Dubai skyline"
                    fill
                    priority
                    className="object-cover object-[center_32%]"
                    sizes="100vw"
                    quality={88}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* 読みやすさ + 下でクリームセクションへ溶ける */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, #0a0908 0%, rgba(14,12,10,0.88) 38%, rgba(18,16,14,0.55) 62%, rgba(26,23,20,0.35) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 70% 20%, rgba(212,175,55,0.14), transparent 55%), radial-gradient(ellipse 60% 50% at 15% 80%, rgba(0,0,0,0.45), transparent 65%)",
          }}
          aria-hidden
        />
        {/* 光のスイープ（1発目で視線を奪う） */}
        {!reduce && (
          <motion.div
            className="absolute inset-0 z-[2] pointer-events-none opacity-40"
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,245,220,0.2) 50%, transparent 65%)",
            }}
            initial={{ x: "-60%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 2.8, delay: 0.35, ease: EASE }}
            aria-hidden
          />
        )}
        {!reduce && (
          <motion.div
            className="absolute inset-0 z-[2] mix-blend-soft-light pointer-events-none"
            aria-hidden
            animate={{ opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at 40% 30%, rgba(252,240,200,0.35), transparent 45%)",
            }}
          />
        )}
        {/* フローティング粒子 */}
        {!reduce &&
          [
            { t: "18%", l: "12%", d: 0 },
            { t: "52%", l: "78%", d: 0.4 },
            { t: "68%", l: "22%", d: 0.8 },
            { t: "30%", l: "58%", d: 1.1 },
            { t: "78%", l: "88%", d: 0.6 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute z-[2] h-1 w-1 rounded-full bg-white/50"
              style={{ top: p.t, left: p.l }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.35, 0.85, 0.35], scale: 1, y: [0, -10, 0] }}
              transition={{
                duration: 5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.d,
              }}
              aria-hidden
            />
          ))}
      </div>

      {/* Dubai ピル（即レスで場所が伝わる） */}
      <motion.div
        className="relative z-10 mb-8 md:mb-10 max-w-[min(92vw,980px)]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-2 backdrop-blur-md"
          style={{ color: HERO_MUTED_LIGHT }}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" strokeWidth={1.6} aria-hidden />
          <span className="text-[10px] uppercase tracking-[0.28em]">Dubai · United Arab Emirates</span>
        </div>
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-[min(92vw,980px)]">
        <motion.p
          className="mb-6 text-[10px] tracking-[0.35em] uppercase md:mb-8 md:text-[11px]"
          style={{ color: HERO_MUTED_LIGHT }}
          initial={{ opacity: 0, filter: reduce ? "none" : "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.15, delay: 0.08, ease: EASE }}
        >
          AI marketing · Dubai &amp; UAE
        </motion.p>

        <h1 className="m-0 p-0 font-normal">
          <RevealMaskLine
            active={intro}
            delay={0.12}
            className="block font-serif leading-[1.05] tracking-tight"
          >
            <span
              className="block text-balance"
              style={{
                color: HERO_TEXT_LIGHT,
                fontSize: "clamp(2.35rem, 7.2vw, 5.2rem)",
                textShadow: "0 2px 40px rgba(0,0,0,0.45)",
              }}
            >
              Search is rewriting itself.
            </span>
          </RevealMaskLine>
          <div className="mt-2">
            <RevealMaskLine active={intro} delay={0.28} className="block font-serif leading-[1.05] tracking-tight">
              <span
                className="block text-balance"
                style={{
                  color: HERO_TEXT_LIGHT,
                  fontSize: "clamp(2.35rem, 7.2vw, 5.2rem)",
                  textShadow: "0 2px 40px rgba(0,0,0,0.45)",
                }}
              >
                <span style={{ color: GOLD }}>Put your brand</span> in every answer.
              </span>
            </RevealMaskLine>
          </div>
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-base font-light leading-relaxed text-pretty md:mt-10 md:text-lg"
          style={{ color: HERO_MUTED_LIGHT }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, delay: 0.55, ease: EASE }}
        >
          GAM solutions delivers AI marketing and digital marketing for Dubai and the UAE: GEO, Dubai AIO-style
          visibility, reputation, and maps — so customers meet you first across ChatGPT-class answers, Google AI
          surfaces, Maps, and the open web.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
        >
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1714] shadow-[0_12px_40px_-12px_rgba(212,175,55,0.55)] transition-transform hover:brightness-105"
          >
            Get started <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </MagneticLink>
          <a
            href="#what-we-offer"
            className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            What we offer
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-16 flex flex-col items-center gap-3 md:mt-24"
        style={{ color: "rgba(255,255,255,0.45)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 1.05, ease: EASE }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">scroll</span>
        <div className="relative h-16 w-px overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-[#D4AF37]/80 to-transparent"
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.4,
            }}
            style={{ height: "42%" }}
          />
        </div>
      </motion.div>

      {/* 下端で次セクション（クリーム）へ自然に接続 */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-32 bg-gradient-to-t from-[#f7f5f0] to-transparent"
        aria-hidden
      />
    </section>
  );
}

function EcosystemFlowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  return (
    <section
      ref={ref}
      id="ecosystem-flow"
      className="border-b border-black/[0.06] bg-[#f7f5f0] px-6 py-14 md:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-600 md:text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Acquisition &amp; reputation
        </motion.p>
        <motion.h2
          className="mt-3 font-serif text-3xl font-medium leading-[1.15] tracking-tight md:text-[2.65rem] md:leading-[1.1]"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.06, ease: EASE }}
        >
          Instagram feeds mirAIreach — Google in sync, then the wider web
        </motion.h2>
        <motion.p
          className="mx-auto mt-3 max-w-2xl text-base font-medium leading-relaxed text-gray-700 md:text-lg md:leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.12, duration: 0.8, ease: EASE }}
        >
          Your social channel supplies the story; mirAIreach turns it into structured data for Google and AI answers.
          Automated signup and citation sync extend Dubai marketing and UAE digital footprint across directories and
          the wider web—not a single silo.
        </motion.p>
      </div>
      <div className="relative mx-auto mt-8 max-w-5xl md:mt-10">
        <EcosystemFlowAnimation active={inView} />
      </div>
    </section>
  );
}

function LocalReachProductSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const bullets = [
    "Negative feedback routed privately — never goes public",
    "One-tap Google review redirects via QR code",
    "Works for restaurants, cafés, retail & hospitality",
    "Private internal feedback CRM included",
  ];

  return (
    <section
      ref={ref}
      id="localreach"
      className="border-b border-black/[0.06] bg-white px-6 py-12 md:px-10 md:py-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-5 lg:space-y-6">
          <motion.div
            className="flex flex-wrap items-center gap-2 md:gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <span className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">LocalReach</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest md:text-[11px]"
              style={{
                borderColor: `${GOLD}55`,
                color: GOLD,
                backgroundColor: `${GOLD}12`,
              }}
            >
              <MapPin className="h-3 w-3 shrink-0" strokeWidth={2.25} aria-hidden />
              #1 Maps visibility
            </span>
          </motion.div>

          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-600 md:text-sm"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.04, duration: 0.7, ease: EASE }}
          >
            Reviews automation
          </motion.p>

          <motion.h2
            className="font-serif text-3xl font-medium leading-[1.12] tracking-tight md:text-[2.35rem]"
            style={{ color: INK }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.06, duration: 0.75, ease: EASE }}
          >
            LocalReach: Automated
            <br />
            <span style={{ color: GOLD }}>Google Reviews.</span>
          </motion.h2>

          <motion.div
            className="rounded-2xl border-2 p-5 shadow-sm md:p-6"
            style={{ borderColor: GOLD, backgroundColor: `${GOLD}08` }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-black tabular-nums text-gray-900 md:text-5xl">500</span>
              <span className="text-2xl font-black text-gray-800">AED</span>
              <span className="text-lg font-bold text-gray-500">/ month</span>
            </div>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 md:text-xs">
              No hidden fees · Full automation · Less than the cost of a daily coffee
            </p>
          </motion.div>

          <motion.p
            className="max-w-xl text-base font-medium leading-relaxed text-gray-700 md:text-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.12, duration: 0.75, ease: EASE }}
          >
            Turn satisfied guests into five-star Google reviews automatically—built for Dubai and UAE hospitality and
            retail. Smart QR codes and feedback routing lift Maps visibility while protecting your brand; core AI
            marketing for local discovery in the Emirates.
          </motion.p>

          <motion.ul
            className="space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.75, ease: EASE }}
          >
            {bullets.map((t) => (
              <li key={t} className="flex items-start gap-3 text-gray-900">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-sm font-semibold leading-snug md:text-base">{t}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="pt-1"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100">
                  <Star className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} aria-hidden />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
                  <Globe className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} aria-hidden />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300">
                  <CheckCircle className="h-3.5 w-3.5 text-gray-600" strokeWidth={2} aria-hidden />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Trusted across Dubai &amp; the UAE
                </p>
                <p className="text-xs font-bold text-gray-800">F&amp;B groups &amp; retailers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-4 pt-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.22, duration: 0.75, ease: EASE }}
          >
            <MagneticLink
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-black md:px-10 md:py-5"
            >
              Get started — 500 AED/mo <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </MagneticLink>
            <Link
              href="/localreach"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 transition-colors hover:text-gray-900"
            >
              Full LocalReach product page <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative flex flex-col items-stretch gap-6 md:gap-7"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.85, ease: EASE }}
        >
          <div className="flex justify-center">
            <LocalReachShowcase />
          </div>
          <LocalReachProductionPreviews embedded />
        </motion.div>
      </div>
    </section>
  );
}

/** Color bar + copy so the block reads as Google Ads / Performance ecosystem at a glance. */
function GoogleAdsEcosystemRibbon() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-gradient-to-br from-white to-gray-50 px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2" aria-hidden>
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
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">Google Ads powered growth</p>
        <p className="text-sm font-bold leading-snug text-gray-900 md:text-base">
          <span style={{ color: G_ADS_PRIMARY }}>Search</span>
          <span className="text-gray-400"> · </span>
          Performance Max
          <span className="text-gray-400"> · </span>
          Demand Gen
          <span className="text-gray-400"> · </span>
          YouTube
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

  const bullets = [
    "AI bid optimization & precision audience targeting",
    "Real-time performance monitoring & auto-adjustments",
    "Conversion-focused ad creative generation",
    "Fully transparent ROI reporting dashboard",
  ];

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
          <motion.ul
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.75, ease: EASE }}
          >
            {bullets.map((t) => (
              <li key={t} className="flex items-start gap-3 text-gray-800">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-sm font-semibold leading-snug md:text-base">{t}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.75, ease: EASE }}
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
              <RevealMaskLine
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
              </RevealMaskLine>
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
    href: "/localreach",
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
            href={MIRAIREACH_LP_PATH}
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
            <RevealMaskLine active={inView} delay={0} className="block">
              <span className="block">Ready to be found</span>
            </RevealMaskLine>
            <div className="mt-2">
              <RevealMaskLine active={inView} delay={0.12} className="block">
                <span className="block" style={{ color: GOLD }}>
                  everywhere.
                </span>
              </RevealMaskLine>
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

/* 紙のような粒子感（peace / 編集ムック系） */
function FilmGrain() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[6] mix-blend-multiply"
      style={{
        opacity: 0.038,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "260px 260px",
      }}
      aria-hidden
    />
  );
}

export default function GamImmersiveLp() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 110);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMenu(false);
  }, []);

  useEffect(() => {
    if (menu) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu, onKey]);

  return (
    <div className="relative w-full" style={{ backgroundColor: CREAM, color: INK }}>
      <ScrollPercentRibbon />
      <FilmGrain />

      <motion.header
        className={`fixed top-0 right-0 left-0 z-[80] flex items-center justify-between border-b px-6 py-5 backdrop-blur-md md:px-10 md:py-6 ${
          scrolled ? "text-[#1a1714]" : "border-white/10 text-white/95"
        }`}
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(247, 245, 240, 0.94)" : "rgba(8, 7, 6, 0.38)",
          borderBottomColor: scrolled ? "rgba(26, 23, 20, 0.08)" : "rgba(255, 255, 255, 0.12)",
        }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <button
          type="button"
          onClick={() => setMenu(true)}
          className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] transition-opacity hover:opacity-80 ${
            scrolled ? "text-[#1a1714]" : "text-white/95"
          }`}
          aria-expanded={menu}
          aria-label="Open menu"
        >
          <Menu size={18} strokeWidth={1.2} />
          menu
        </button>

        <Link
          href="/"
          className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-base tracking-wide sm:text-lg md:text-xl ${
            scrolled ? "text-[#1a1714]" : "text-white"
          }`}
        >
          GAM <span style={{ color: GOLD }}>solutions</span>
        </Link>

        <div
          className={`flex items-center gap-5 text-[10px] uppercase tracking-[0.3em] ${
            scrolled ? "text-[#1a1714]" : "text-white/95"
          }`}
        >
          <Link href="/contact" className="hidden transition-opacity hover:opacity-80 sm:inline">
            contact
          </Link>
          <Link
            href="/contact"
            className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-[9px] transition-colors ${
              scrolled
                ? "border border-[#1a1714]/25 hover:border-[#1a1714]/50"
                : "border border-white/35 hover:border-white/55"
            }`}
          >
            get started
            <span className="text-sm leading-none">+</span>
          </Link>
        </div>
      </motion.header>

      <MenuOverlay open={menu} onClose={() => setMenu(false)} />

      <main>
        <HeroBlock />
        <EcosystemFlowSection />
        <LocalReachProductSection />
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

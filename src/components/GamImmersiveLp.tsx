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
import { ArrowRight, ArrowUpRight, BarChart3, CheckCircle, ChevronDown, Globe, MapPin, Megaphone, Menu, MousePointerClick, Rocket, Star, Target, X } from "lucide-react";
import ScrollParallax from "@/components/miraireach/ScrollParallax";
import MagneticLink from "@/components/miraireach/MagneticLink";
import EcosystemFlowAnimation from "@/components/miraireach/EcosystemFlowAnimation";
import LocalReachShowcase from "@/components/miraireach/LocalReachShowcase";
import LocalReachProductionPreviews from "@/components/localreach/LocalReachProductionPreviews";
import { heroAssetUrl } from "@/lib/hero-assets";
import { LOCALREACH_MONTHLY_AED } from "@/content/localReachPricing";
import { MIRAIREACH_LP_PATH, MIRAIREACH_SYSTEM_URL } from "@/lib/miraireach-links";
import MirAIreachSystemSection from "@/components/miraireach/MirAIreachSystemSection";

const CREAM = "#f7f5f0";
const INK = "#1a1714";
const GOLD = "#D4AF37";
const MUTED = "rgba(26,23,20,0.55)";

/** Dubai hero — loop video in `public/hero/` (version query busts mobile cache). */
const HERO_VIDEO_MP4 = heroAssetUrl("/hero/hero-dubai.mp4");
const HERO_VIDEO_WEBM = heroAssetUrl("/hero/hero-dubai.webm");
const HERO_POSTER = heroAssetUrl("/hero/hero-dubai-poster.jpg");
/** Fallback still when video cannot load or reduced motion is enabled. */
const HERO_DUBAI_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=88";
const HERO_TEXT_LIGHT = "#ffffff";
const HERO_SUBTEXT_LIGHT = "rgba(255,255,255,0.98)";
const HERO_HEADLINE_SHADOW =
  "0 1px 1px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.45)";
const HERO_BODY_SHADOW =
  "0 1px 1px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.7)";
const HERO_LABEL_SHADOW = "0 1px 2px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.6)";
const HERO_HEADLINE_STROKE = "0px rgba(0,0,0,0)";
const HERO_TEXT_GLOW =
  "drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]";

/** Editorial / peace-put系：ゆっくり落ち着いた減速 */
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING_SCROLL = { stiffness: 42, damping: 28, mass: 0.85 };

/** In-page sections (labels are plain language; anchors match IDs below) */
const NAV = [
  { label: "mirAIreach system", href: "#miraireach-system" },
  { label: "LocalReach", href: "#localreach" },
  { label: "services", href: "/google-ai-ads" },
  { label: "about", href: "/about" },
];

export { MIRAIREACH_LP_PATH, MIRAIREACH_SYSTEM_URL } from "@/lib/miraireach-links";

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
              <a
                href={MIRAIREACH_SYSTEM_URL}
                target="_blank"
                rel="noopener noreferrer"
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
                  See the mirAIreach system
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </span>
              </a>
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

/** Full-bleed cover; minimal overscan to avoid edge gaps without heavy scale blur. */
const HERO_MEDIA_COVER =
  "absolute left-1/2 top-1/2 z-0 h-full w-full min-h-[104%] min-w-[104%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_32%] [filter:brightness(1.08)_contrast(1.2)_saturate(1.35)]";

/** Hero copy — no full panel; legibility from shadow + small chips only. */
function HeroCopyStack({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative z-10 max-w-[min(92vw,980px)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function HeroGoldHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2">
      <span
        className="absolute -inset-x-1 bottom-[0.04em] -z-0 h-[0.96em] rounded-md"
        style={{
          background: "linear-gradient(100deg, #E0B53C 0%, #F4D575 55%, #FFE9A8 100%)",
          boxShadow: "0 10px 28px -10px rgba(212,175,55,0.55)",
        }}
        aria-hidden
      />
      <span
        className="relative z-10 font-bold"
        style={{ color: "#1a1714", textShadow: "none", WebkitTextStroke: "0px transparent" }}
      >
        {children}
      </span>
    </span>
  );
}

function HeroBackgroundMedia() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  useEffect(() => {
    if (reduce || !videoRef.current) return;
    const v = videoRef.current;
    v.play().catch(() => {});
  }, [reduce]);

  if (reduce || useFallbackImage) {
    return (
      <Image
        src={HERO_DUBAI_IMAGE_FALLBACK}
        alt="Dubai skyline"
        fill
        priority
        className="absolute inset-0 h-full w-full object-cover object-[center_32%] [filter:brightness(1.08)_contrast(1.2)_saturate(1.35)]"
        sizes="100vw"
        quality={92}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={HERO_MEDIA_COVER}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={HERO_POSTER}
      aria-hidden
      onError={() => setUseFallbackImage(true)}
    >
      <source src={HERO_VIDEO_MP4} type="video/mp4" />
      <source src={HERO_VIDEO_WEBM} type="video/webm" />
    </video>
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
      {/* ── Dubai hero video (`public/hero/hero-dubai.mp4`) ── */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.15, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.15, ease: EASE }}
          >
            <div className="relative h-full min-h-[100svh] w-full overflow-hidden">
              <HeroBackgroundMedia />
            </div>
          </motion.div>
        </motion.div>

        {/* コピー裏のスクリム：左＋下＋上を暗くして文字を背景から分離（右の夕景は残す） */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(4,3,2,0.95) 0%, rgba(6,5,4,0.82) 32%, rgba(8,7,6,0.52) 56%, rgba(9,8,7,0.24) 76%, transparent 90%), linear-gradient(to top, rgba(4,3,2,0.78) 0%, rgba(8,7,6,0.36) 36%, transparent 64%), linear-gradient(to bottom, rgba(4,3,2,0.52) 0%, transparent 30%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 70% 20%, rgba(212,175,55,0.1), transparent 55%)",
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
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at 40% 30%, rgba(252,240,200,0.25), transparent 50%)",
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

      <HeroCopyStack>
        <motion.div style={{ y, opacity }} className={HERO_TEXT_GLOW}>
        <div className="mb-6 flex flex-wrap items-center gap-2.5 md:mb-7">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/12 px-4 py-2 backdrop-blur-sm"
            style={{ color: HERO_TEXT_LIGHT, textShadow: HERO_LABEL_SHADOW }}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F5D76E]" strokeWidth={2} aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] md:text-[11px]">
              Dubai · United Arab Emirates
            </span>
          </div>
          <motion.p
            className="inline-flex items-center rounded-full border border-[#D4AF37]/55 bg-[#D4AF37]/20 px-4 py-2 text-[10px] font-bold tracking-[0.32em] uppercase text-[#FFF4D0] backdrop-blur-sm md:text-[11px]"
            style={{ textShadow: HERO_LABEL_SHADOW }}
            initial={{ opacity: 0, filter: reduce ? "none" : "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.15, delay: 0.08, ease: EASE }}
          >
            AI marketing · Dubai &amp; UAE
          </motion.p>
        </div>

        <h1 className="m-0 p-0">
          <RevealMaskLine
            active={intro}
            delay={0.12}
            className="block font-serif font-semibold leading-[1.04] tracking-tight"
          >
            <span
              className="block text-balance"
              style={{
                color: HERO_TEXT_LIGHT,
                fontSize: "clamp(2.45rem, 7.5vw, 5.35rem)",
                textShadow: HERO_HEADLINE_SHADOW,
                WebkitTextStroke: HERO_HEADLINE_STROKE,
              }}
            >
              Search is rewriting itself.
            </span>
          </RevealMaskLine>
          <div className="mt-1.5 md:mt-2">
            <RevealMaskLine active={intro} delay={0.28} className="block font-serif font-semibold leading-[1.04] tracking-tight">
              <span
                className="block text-balance"
                style={{
                  color: HERO_TEXT_LIGHT,
                  fontSize: "clamp(2.45rem, 7.5vw, 5.35rem)",
                  textShadow: HERO_HEADLINE_SHADOW,
                  WebkitTextStroke: HERO_HEADLINE_STROKE,
                }}
              >
                <HeroGoldHighlight>Put your brand</HeroGoldHighlight> in every answer.
              </span>
            </RevealMaskLine>
          </div>
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-pretty md:mt-8 md:text-[1.125rem] md:leading-relaxed"
          style={{ color: HERO_SUBTEXT_LIGHT, textShadow: HERO_BODY_SHADOW }}
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
            href={MIRAIREACH_SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-sm border-2 border-[#D4AF37] bg-[#1a1714]/55 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFE9A8] shadow-[0_10px_34px_-8px_rgba(212,175,55,0.5)] backdrop-blur-md transition-colors hover:bg-[#1a1714]/75"
          >
            See the mirAIreach system
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
          <a
            href="/google-ai-ads#what-we-offer"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-white/50 bg-white/20 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-md transition-colors hover:bg-white/30"
          >
            What we offer
          </a>
        </motion.div>
        </motion.div>
      </HeroCopyStack>

      <motion.div
        className="relative z-10 mt-16 flex flex-col items-center gap-3 md:mt-24"
        style={{ color: "rgba(255,255,255,0.9)", textShadow: HERO_LABEL_SHADOW }}
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
              <span className="text-4xl font-black tabular-nums text-gray-900 md:text-5xl">{LOCALREACH_MONTHLY_AED}</span>
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
              Get started — {LOCALREACH_MONTHLY_AED} AED/mo <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
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

function HomeExploreTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const links = [
    {
      title: "Google AI Ads",
      desc: "AI-managed campaigns, ROI dashboards, and strategic pillars for UAE audiences.",
      href: "/google-ai-ads#google-ai-ads",
    },
    {
      title: "Mission & capabilities",
      desc: "What we offer, how the stack connects, and Dubai / UAE positioning.",
      href: "/google-ai-ads#what-we-offer",
    },
    {
      title: "FAQ",
      desc: "Straight answers on mirAIreach, GEO, and operating in the Emirates.",
      href: "/google-ai-ads#faq",
    },
  ] as const;

  return (
    <section
      ref={ref}
      id="explore-more"
      className="scroll-mt-28 border-t border-black/[0.06] px-6 py-16 md:px-12 md:py-24"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="text-[10px] font-bold uppercase tracking-[0.32em]"
          style={{ color: GOLD }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Go deeper
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.12] tracking-tight md:text-4xl"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: EASE }}
        >
          Google AI Ads, company story, and{" "}
          <span style={{ color: GOLD }}>full capabilities</span>
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-base font-medium leading-relaxed text-gray-700"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
        >
          The homepage focuses on products. Everything else — paid media, mission, FAQs — lives on a dedicated page so
          you can scan faster.
        </motion.p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 md:gap-5">
          {links.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.06, duration: 0.75, ease: EASE }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-black/[0.08] bg-white/60 p-6 transition-[border-color,box-shadow] hover:border-[#D4AF37]/35 hover:shadow-[0_20px_50px_-28px_rgba(26,23,20,0.18)] md:p-7"
              >
                <h3 className="font-serif text-xl font-medium" style={{ color: INK }}>
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                <span
                  className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 group-hover:text-[#1a1714]"
                >
                  View <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
        >
          <MagneticLink
            href="/google-ai-ads"
            className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1714]"
          >
            Full services page <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </MagneticLink>
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 border-b border-[#1a1714]/25 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1714]"
          >
            Book a consultation <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
}

function HomeClosingCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <section ref={ref} className="border-t border-black/[0.06] px-6 py-20 md:px-12 md:py-28" style={{ backgroundColor: "#f0ebe3" }}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl leading-[1.1] md:text-5xl" style={{ color: INK }}>
          Ready to be found <span style={{ color: GOLD }}>everywhere?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed" style={{ color: MUTED }}>
          Tell us your Dubai and UAE markets — we&apos;ll map GEO, reputation, and the right product lane.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#D4AF37] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
          >
            Get started <ArrowUpRight size={16} />
          </MagneticLink>
          <Link href="/google-ai-ads" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 hover:text-gray-900">
            Explore services →
          </Link>
        </div>
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
      className="pointer-events-none fixed inset-x-0 bottom-0 top-[100svh] z-[6] mix-blend-multiply"
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
          backgroundColor: scrolled ? "rgba(247, 245, 240, 0.94)" : "rgba(8, 7, 6, 0.12)",
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
        <MirAIreachSystemSection />
        <LocalReachProductSection />
        <HomeExploreTeaser />
        <HomeClosingCta />
      </main>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import ReviewFlowHeroAnimation from "@/components/localreach/ReviewFlowHeroAnimation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ── Local animation helpers ──────────────────────────── */
function LRFadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function LRStagger({ children, className, stagger = 0.1 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const items = Array.isArray(children) ? children : [children];
  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}>
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// ── Brand constants ────────────────────────────────────────────────
const GOLD = "#D4AF37";
const GOLD_DARK = "#B8961C";
const GOLD_BG = "#FBF5DC";

// ── Static data ────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: "📉",
    title: "Reviews Aren't Growing",
    body: "Even satisfied customers forget to post. Without a frictionless system your Google rating stagnates while competitors climb the local search rankings.",
  },
  {
    icon: "🔁",
    title: "No Path to Repeat Visits",
    body: "You invest in every guest experience but walk away with zero contact information. No customer list means no re-engagement, ever.",
  },
  {
    icon: "🚫",
    title: "Spam Penalties Loom",
    body: "Templated review tools produce identical text that triggers Google's spam detection — risking suspension of your entire Business Profile.",
  },
];

const HOW_STEPS = [
  { n: "01", icon: "📱", title: "Customer Scans QR", body: "A branded QR code at the table opens the LocalReach review module — no app download, no friction, works on any device." },
  { n: "02", icon: "⭐", title: "Satisfaction Survey", body: "A compliance buffer: customers rate their experience first. This feedback-first framing fully satisfies Google's review guidelines." },
  { n: "03", icon: "🤖", title: "AI Generates Unique Review", body: "Our assembler randomly combines openers, GEO keywords, and closers — producing a never-repeated, natural-language draft every session." },
  { n: "04", icon: "✅", title: "Posted + You're Instantly Notified", body: "The review goes live on Google. You receive an instant email alert with the reviewer's name and a preview of their words. Optionally the customer shares their WhatsApp number, growing your CRM automatically." },
];

const FEATURES = [
  {
    icon: "🤖",
    tag: "AI-Powered Local SEO",
    title: "Every Review Is Unique. Every Time.",
    body: "Our on-device assembler randomly combines openers, GEO keyword connectors, and closers — producing grammatically natural reviews that never repeat. No two submissions share the same structure, eliminating spam signals entirely while systematically injecting Local SEO keywords that lift your Google Maps ranking.",
    bullets: [
      "Random sentence assembly — zero duplicate text across submissions",
      "GEO Keywords woven naturally to strengthen local search signals",
      "Runs on-device — zero API cost, zero latency",
      "Automatic language matching for EN, JA, and AR visitors",
    ],
    visual: "ai",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85&auto=format&fit=crop", // More dynamic AI/tech photo
  },
  {
    icon: "📲",
    tag: "Stealth CRM · WhatsApp Integration",
    title: "Build Your Customer Asset Passively.",
    body: "Inside the review flow, customers optionally share their WhatsApp number and opt into future communications. You receive a growing, first-party CRM — automatically segmented by keywords and opt-in status — with zero additional effort or cost.",
    bullets: [
      "WhatsApp number capture embedded seamlessly in the review flow",
      "Opt-in flag and keyword snapshot stored per customer",
      "Full international dialling code support for Dubai's expat market",
      "Instant email alert to store owner for every new 5-star review",
      "CSV export available at any time from the admin dashboard",
    ],
    visual: "crm",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&q=85&auto=format&fit=crop", // Real WhatsApp interface photo
  },
  {
    icon: "🌍",
    tag: "Global Optimization",
    title: "Dubai's Multicultural Market, Fully Covered.",
    body: "Full English, Japanese, and Arabic interface with automatic RTL layout for Arabic-speaking visitors. Any international country code is accepted — covering the highly diverse Dubai demographic from day one.",
    bullets: [
      "EN / JA / AR with automatic RTL layout for Arabic",
      "Any country code registration — from +44 to +81",
      "Brand color and logo customization per individual store",
      "Locale-aware AI review generation matches visitor language",
    ],
    visual: "global",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85&auto=format&fit=crop", // Diverse group of people representing global market
  },
];

const COMPARISON_ROWS = [
  { feature: "AI Individual Review Generation", lr: "✓  High Quality",    gen: "△  Templates only", pop: "✗" },
  { feature: "CRM · WhatsApp + Real-time Alerts", lr: "✓  Automatic",     gen: "✗",                 pop: "✗" },
  { feature: "Local SEO / GEO Effect",          lr: "High",              gen: "Low",               pop: "None" },
  { feature: "Multi-language Support",          lr: "✓  EN / JA / AR",  gen: "△  EN only",        pop: "✗" },
  { feature: "Spam Protection",                 lr: "Advanced AI",       gen: "Basic",             pop: "N/A" },
  { feature: "Guideline Compliance",            lr: "✓  Compliant",      gen: "✗  Risk",           pop: "N/A" },
];

const LEAD_GEN_QUESTIONS = [
  {
    question: "How many Google reviews does your business currently have?",
    options: ["Fewer than 20", "20 – 100", "100 – 300", "300+"],
  },
  {
    question: "How are you currently collecting customer reviews?",
    options: ["We're not", "Asking verbally", "Paper / QR cards", "An existing tool"],
  },
  {
    question: "What's your biggest growth priority right now?",
    options: ["More Google reviews", "Repeat customers", "Higher map ranking", "All of the above"],
  },
];

// ── Sub-components ─────────────────────────────────────────────────

function GoldButton({ href, children, large }: { href: string; children: React.ReactNode; large?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-full
        transition-all hover:scale-105 active:scale-[0.97] shadow-lg
        ${large ? "px-12 py-5 text-sm" : "px-8 py-4 text-xs"}`}
      style={{ backgroundColor: GOLD, color: "#000" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_DARK; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
    >
      {children}
    </Link>
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10px] font-bold tracking-[0.35em] uppercase mb-3 ${light ? "opacity-60" : ""}`}
      style={{ color: GOLD }}
    >
      {children}
    </p>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span style={{ color: "#FBBC04", letterSpacing: "0.05em" }}>
      {"★".repeat(n)}
    </span>
  );
}

// ── Google Ecosystem Decorative Elements ───────────────────────────

function GooglePin({ color = "#4285F4", size = 32 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 24 32" fill="none">
      <path
        d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 23 9 23s9-16.25 9-23c0-4.97-4.03-9-9-9z"
        fill={color}
        style={{ filter: `drop-shadow(0 3px 8px ${color}80)` }}
      />
      <circle cx="12" cy="9" r="3.5" fill="white" />
    </svg>
  );
}

function UpArrow({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.6)} viewBox="0 0 16 26" fill="none">
      <path
        d="M8 24V4M8 4L2 10M8 4l6 6"
        stroke={GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarBadge() {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}35` }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ color: "#FBBC04", fontSize: 9 }}>★</span>
      ))}
    </div>
  );
}

function GoogleSearchCard() {
  return (
    <div
      className="relative z-[3] w-[222px] max-w-[min(222px,calc(100vw-2.5rem))] shrink-0 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
      }}
    >
      {/* Search bar */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", background: "rgba(0,0,0,0.02)" }}
      >
        <span className="font-black text-[11px] tracking-tight">
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC04" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </span>
        <span className="text-[8.5px] font-semibold flex-1 truncate" style={{ color: "rgba(0,0,0,0.7)" }}>
          Japanese Restaurant Dubai
        </span>
        <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 9 }}>🔍</span>
      </div>
      {/* Pack label */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-[7px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.4)" }}>
          · Top Results ·
        </p>
      </div>
      {/* Listings */}
      {[
        { rank: "#1", name: "Your Business", rating: "5.0", count: "247", you: true  },
        { rank: "#2", name: "Sakura Lounge", rating: "4.2", count: "103", you: false },
        { rank: "#3", name: "Ichiban DIFC",  rating: "3.9", count: "61",  you: false },
      ].map(({ rank, name, rating, count, you }) => (
        <div
          key={rank}
          className="px-3 py-2 flex items-center gap-2"
          style={{
            borderLeft: you ? `2px solid ${GOLD}` : "2px solid transparent",
                background: you ? `linear-gradient(90deg, ${GOLD}12 0%, transparent 72%)` : undefined,
          }}
        >
          <span
            className="text-[10px] font-black w-4 shrink-0"
                style={{ color: you ? GOLD : "rgba(0,0,0,0.3)" }}
          >
            {rank}
          </span>
          <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold" style={{ color: you ? "#111" : "rgba(0,0,0,0.6)" }}>
              {name}
            </p>
            <div className="flex items-center gap-1">
              <span style={{ color: "#FBBC04", fontSize: 6.5, letterSpacing: "0.04em" }}>★★★★★</span>
                  <span style={{ color: "rgba(0,0,0,0.4)", fontSize: 7 }}>{rating} ({count})</span>
            </div>
          </div>
          {you && (
            <span
              className="text-[7px] font-black px-1.5 rounded-full shrink-0"
              style={{ backgroundColor: GOLD, color: "#000", lineHeight: "20px", display: "inline-block" }}
            >
              #1
            </span>
          )}
        </div>
      ))}
      <div
        className="px-3 py-1.5"
        style={{ color: "rgba(0,0,0,0.4)", fontSize: 6.5, borderTop: "1px solid rgba(0,0,0,0.04)" }}
      >
        Updated just now · Powered by LocalReach AI
      </div>
    </div>
  );
}

// ── iPhone Mockup ──────────────────────────────────────────────────

const MOCK_REVIEWS = [
  { initial: "A", color: "#4285F4", name: "Ahmed M.", text: "Incredible atmosphere — the salmon sashimi was flawless. Will absolutely return!", time: "2 days ago" },
  { initial: "Y", color: "#34A853", name: "Yuki T.",  text: "Best omakase in Dubai Marina. Exceptional fresh ingredients every visit.", time: "5 days ago" },
  { initial: "S", color: "#EA4335", name: "Sarah K.", text: "Staff were incredibly welcoming. Fantastic Japanese whisky selection too.", time: "1 week ago" },
  { initial: "F", color: "#FBBC04", name: "Faisal R.", text: "A truly premium dining experience. Highly recommended for business dinners.", time: "2 weeks ago" },
];

// Doubled for seamless infinite scroll — translateY(-50%) = exactly one full set
const SCROLLING_REVIEWS = [...MOCK_REVIEWS, ...MOCK_REVIEWS];

function IPhoneMockup() {
  return (
    <div className="iphone-float relative mx-auto" style={{ width: 262, height: 534 }}>
      {/* Outer device frame */}
      <div
        className="absolute inset-0 rounded-[42px]"
        style={{
          background: "linear-gradient(150deg, #2e2e2e 0%, #0f0f0f 100%)",
          border: "10px solid #141414",
          boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      />
      {/* Left-edge specular highlight */}
      <div
        className="absolute inset-0 rounded-[42px] pointer-events-none"
        style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 45%)" }}
      />
      {/* Dynamic Island */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 14, width: 90, height: 26, background: "#000", borderRadius: 13, zIndex: 10 }}
      />

      {/* Screen */}
      <div
        className="absolute rounded-[34px] flex flex-col overflow-hidden"
        style={{ inset: 10, background: "#fff" }}
      >
        {/* Google Maps header */}
        <div className="shrink-0 px-3 pt-7 pb-2.5" style={{ background: "#4285F4" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[7.5px] font-semibold text-white/70 tracking-widest uppercase">Google Maps</p>
              <p className="text-[11px] font-black text-white leading-tight mt-0.5">Your Business</p>
            </div>
            <div className="text-right mt-0.5">
              <div className="flex items-center justify-end gap-px">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} style={{ color: "#FBBC04", fontSize: 8 }}>★</span>
                ))}
              </div>
              <p className="text-[8px] font-semibold text-white/80 mt-0.5">5.0 · 247 reviews</p>
            </div>
          </div>
        </div>

        {/* Thin separator */}
        <div style={{ height: 1, background: "#e8e8e8", flexShrink: 0 }} />

        {/* Scrolling reviews — overflow clipped, inner div runs the animation */}
        <div className="flex-1 overflow-hidden" style={{ background: "#fff" }}>
          <div className="scroll-reviews">
            {SCROLLING_REVIEWS.map(({ initial, color, name, text, time }, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 px-3 py-2.5"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <div
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-black text-white"
                  style={{ fontSize: 9, backgroundColor: color, marginTop: 1 }}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#1a1a1a" }}>{name}</p>
                    <p style={{ fontSize: 7, color: "#b0b0b0" }}>{time}</p>
                  </div>
                  <div className="flex items-center gap-px my-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} style={{ color: "#FBBC04", fontSize: 7.5 }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 8, color: "#555", lineHeight: 1.45 }}>
                    {text}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p style={{ fontSize: 7, color: "#4285F4" }}>Google</p>
                    <span
                      className="text-[6px] font-bold px-1 py-0.5 rounded bg-green-50 text-green-600 uppercase tracking-wider animate-slide-up-fade"
                      style={{ animationDelay: `${(idx % (SCROLLING_REVIEWS.length / 2)) * 2 + 1}s` }}
                    >
                      AI-Replied
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="shrink-0 flex justify-center py-2" style={{ background: "#fff" }}>
          <div className="w-16 h-[3px] rounded-full" style={{ background: "#d0d0d0" }} />
        </div>
      </div>
    </div>
  );
}

// ── Live Review Panel (replaces iPhone mockup) ────────────────────

const PANEL_REVIEWS = [
  { initial: "A", color: "#4285F4", name: "Ahmed M.",  text: "Amazing atmosphere — the salmon sashimi was absolutely flawless.", time: "2 min ago" },
  { initial: "Y", color: "#34A853", name: "Yuki T.",   text: "Best omakase in Dubai Marina. Exceptional freshness every visit.", time: "8 min ago" },
  { initial: "S", color: "#EA4335", name: "Sarah K.",  text: "Staff were incredibly welcoming. Highly recommend to everyone!", time: "15 min ago" },
];

function LiveReviewPanel() {
  return (
    <div className="relative flex-shrink-0 w-full max-w-[420px] mx-auto lg:mx-0 animate-slide-up-delayed">
      {/* Ambient glow orbs */}
      <div
        className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}22 0%, transparent 65%)` }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}16 0%, transparent 65%)` }}
      />

      {/* Main glass card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: `1px solid rgba(212,175,55,0.22)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
        }}
      >
        {/* Top stripe */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60, rgba(245,227,160,0.8), ${GOLD}60, transparent)` }}
        />

        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="ping-soft w-2 h-2 rounded-full shrink-0" style={{ background: "#16a34a" }} />
              <span className="text-[10px] font-black tracking-[0.28em] uppercase text-green-700">Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-semibold text-gray-400">Powered by</span>
              <span className="text-[11px] font-black" style={{ color: "#4285F4" }}>G</span>
              <span className="text-[11px] font-black" style={{ color: "#EA4335" }}>o</span>
              <span className="text-[11px] font-black" style={{ color: "#FBBC04" }}>o</span>
              <span className="text-[11px] font-black" style={{ color: "#4285F4" }}>g</span>
              <span className="text-[11px] font-black" style={{ color: "#34A853" }}>l</span>
              <span className="text-[11px] font-black" style={{ color: "#EA4335" }}>e</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-black text-gray-900 tracking-tight">Your Business</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Stars n={5} />
                <span className="text-sm font-bold text-gray-700">5.0</span>
                <span className="text-xs text-gray-400">(247 reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black leading-none" style={{ color: GOLD }}>#1</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Google Maps</p>
            </div>
          </div>

          {/* Animated rating bar */}
          <div className="mt-3.5">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
              <div
                className="h-full rounded-full lr-bar-fill"
                style={{ background: `linear-gradient(90deg, ${GOLD}, #f5e3a0)` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-1 font-semibold">+18 reviews this week · trending ↑</p>
          </div>
        </div>

        {/* Review cards */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Recent Reviews</p>
          {PANEL_REVIEWS.map(({ initial, color, name, text, time }, i) => (
            <div
              key={name}
              className="lr-card-in rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.055)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                animationDelay: `${i * 0.18}s`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white shrink-0"
                    style={{ fontSize: 10, background: color }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800 leading-none">{name}</p>
                    <Stars n={5} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-gray-400">{time}</p>
                  <span
                    className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: `${GOLD}22`, color: GOLD }}
                  >
                    AI-crafted
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-2.5">{text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)", background: "rgba(251,245,220,0.45)" }}
        >
          <p className="text-[9px] font-semibold text-gray-500">Zero duplicates · 100% Google compliant</p>
          <span className="text-[10px] font-black" style={{ color: GOLD }}>LocalReach →</span>
        </div>
      </div>

      {/* Floating badge — top right */}
      <div
        className="badge-float absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-2.5 shadow-xl"
        style={{ border: `1px solid ${GOLD}30`, animationDelay: "0.8s", zIndex: 20 }}
      >
        <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">Review Growth</p>
        <p className="text-xl font-black leading-tight" style={{ color: GOLD }}>3× faster</p>
      </div>

      {/* Floating badge — bottom left */}
      <div
        className="badge-float absolute -bottom-4 -left-5 bg-white rounded-2xl px-4 py-2.5 shadow-xl"
        style={{ border: "1px solid rgba(0,0,0,0.06)", animationDelay: "0.3s", zIndex: 20 }}
      >
        <div className="flex items-center gap-1.5">
          <span className="ping-soft w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <p className="text-[10px] font-black text-gray-800">New 5-star review!</p>
        </div>
        <p className="text-[9px] text-gray-400 mt-0.5">Google Maps · just now</p>
      </div>
    </div>
  );
}

// ── Feature Visuals ────────────────────────────────────────────────

function AiVisual() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3 shadow-lg">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>AI Review Generator</p>
      {[
        { kw: "Best sushi Dubai Marina", done: true },
        { kw: "Fresh omakase experience", done: true },
        { kw: "Japanese whisky selection", done: false },
      ].map(({ kw, done }) => (
        <div key={kw} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <span className={`text-sm font-bold ${done ? "text-green-500" : "text-gray-300"}`}>{done ? "✓" : "○"}</span>
          <span className="text-xs text-slate-600">{kw}</span>
          {done && <span className="ml-auto text-[10px] font-bold" style={{ color: GOLD }}>GEO</span>}
        </div>
      ))}
      <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-white leading-relaxed">
        &ldquo;Best sushi experience in Dubai Marina — the fresh omakase selection was simply outstanding...&rdquo;
      </div>
    </div>
  );
}

function CrmVisual() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3 shadow-lg">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>WhatsApp CRM Dashboard</p>
      {[
        { wa: "+971 50 123 4567", kw: "omakase, whisky", opt: true },
        { wa: "+44 7911 123456",  kw: "sashimi, ambiance", opt: true },
        { wa: "+81 90 1234 5678", kw: "fresh ingredients", opt: false },
      ].map(({ wa, kw, opt }) => (
        <div key={wa} className="flex items-start justify-between gap-3 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900 font-mono">{wa}</p>
            <p className="text-[10px] text-slate-400">{kw}</p>
          </div>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${opt ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {opt ? "opt-in" : "opt-out"}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs font-black text-slate-900">247 contacts</span>
        <span className="text-[10px] text-slate-400">· 89% opted in</span>
        <span className="ml-auto text-[10px] font-bold cursor-pointer" style={{ color: GOLD }}>Export CSV →</span>
      </div>
    </div>
  );
}

function GlobalVisual() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3 shadow-lg">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>Multi-language Reviews</p>
      {[
        { flag: "🇬🇧", lang: "English", review: "Absolutely fantastic experience — highly recommend!" },
        { flag: "🇯🇵", lang: "Japanese", review: "Outstanding restaurant — the freshest ingredients and impeccable hospitality. Can't wait to return." },
        { flag: "🇦🇪", lang: "Arabic (RTL)", review: "تجربة رائعة، الطعام لذيذ جداً وسيجري الخدمة ممتازة." },
      ].map(({ flag, lang, review }) => (
        <div key={lang} className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm space-y-1">
          <div className="flex items-center gap-2">
            <span>{flag}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{lang}</span>
            <Stars n={5} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed" dir={lang.includes("RTL") ? "rtl" : "ltr"}>
            {review}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────

export default function LocalReachClient() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const allAnswered = Object.keys(answers).length === LEAD_GEN_QUESTIONS.length;

  return (
    <>
      <style>{`
        @keyframes lrFloatPhone {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-14px) rotate(-1deg); }
        }
        @keyframes lrFloatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes lrShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lrPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes lrFloatPin {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-16px); }
        }
        @keyframes lrDriftUp {
          0%, 100% { transform: translateY(0px) rotate(-12deg); opacity: 0.18; }
          50%       { transform: translateY(-22px) rotate(-8deg); opacity: 0.32; }
        }
        @keyframes lrStarPulse {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.12; }
          50%       { transform: translateY(-10px) scale(1.05); opacity: 0.22; }
        }
        .iphone-float  { animation: lrFloatPhone  4s   ease-in-out infinite; }
        .badge-float   { animation: lrFloatBadge  3s   ease-in-out infinite 0.5s; }
        .shimmer-gold-text {
          background: linear-gradient(90deg, #D4AF37 0%, #F5E3A0 45%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lrShimmer 3s linear infinite;
        }
        @keyframes lrScrollReviews {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .live-dot      { animation: lrPulse          1.8s ease-in-out infinite; }
        .pin-float-a   { animation: lrFloatPin        5.0s ease-in-out infinite; }
        .pin-float-b   { animation: lrFloatPin        6.5s ease-in-out infinite 1.5s; }
        .pin-float-c   { animation: lrFloatPin        4.8s ease-in-out infinite 2.8s; }
        .pin-float-d   { animation: lrFloatPin        7.2s ease-in-out infinite 0.7s; }
        .arrow-drift-a { animation: lrDriftUp         5.5s ease-in-out infinite; }
        .arrow-drift-b { animation: lrDriftUp         7.0s ease-in-out infinite 2.0s; }
        .arrow-drift-c { animation: lrDriftUp         4.8s ease-in-out infinite 1.2s; }
        .arrow-drift-d { animation: lrDriftUp         6.2s ease-in-out infinite 3.5s; }
        .star-cloud-a  { animation: lrStarPulse       7.0s ease-in-out infinite; }
        .star-cloud-b  { animation: lrStarPulse       8.5s ease-in-out infinite 2.5s; }
        .star-cloud-c  { animation: lrStarPulse       6.0s ease-in-out infinite 1.0s; }
        .scroll-reviews { animation: lrScrollReviews 20s  linear             infinite; }
        @keyframes pingSoft {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }
        @keyframes lrFadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lrSlideUpFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ping-soft { animation: pingSoft 2s infinite; }
        .animate-fade-in-down { animation: lrFadeInDown 0.8s ease-out forwards; }
        .animate-slide-up-fade { animation: lrSlideUpFade 0.6s ease-out both; }

        @keyframes lrBarFill {
          from { width: 0%; }
          to   { width: 96%; }
        }
        .lr-bar-fill {
          animation: lrBarFill 1.4s cubic-bezier(0.22,1,0.36,1) 0.4s both;
        }

        @keyframes lrCardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lr-card-in {
          animation: lrCardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <main className="w-full">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-6 md:px-10">
          <Header showNav brand="gam" theme="dark" />
        </div>

        {/* ── 1. HERO ─────────────────────────────────────────────── */}
        <section className="relative flex min-h-[85vh] items-center overflow-x-clip overflow-y-visible bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Soft gold glow top-right */}
          <div
            className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${GOLD}15 0%, transparent 65%)` }}
          />
          {/* Subtle dark overlay for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 50%, rgba(0,0,0,0.01) 100%)` }}
          />

          <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center lg:gap-x-12 xl:gap-x-16">

              {/* Left: Copy */}
              <LRStagger className="w-full max-w-xl space-y-8 xl:max-w-2xl" stagger={0.09}>
                {/* Product wordmark */}
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 16 }}>
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">LocalReach</span>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.35em] text-gray-500 font-semibold">
                    A review-growth engine within the LocalReach platform
                  </p>
                </motion.div>

                {/* Live badge */}
                <div className="flex items-center gap-2">
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#16a34a" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-700">
                    Live · Google Reviews Growing in Real-Time
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight text-gray-900">
                    Maximize 5-Star Growth<br />
                    from Every{" "}
                    <span className="shimmer-gold-text">Happy Guest.</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-xl">
                    Your guests already love you — LocalReach makes it effortless for them to say so on Google.
                    We surface satisfaction, route concerns privately, and compound your reputation month over month.
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-10">
                  {[
                    { val: "3×", label: "Faster Review Growth" },
                    { val: "100%", label: "Google Compliant" },
                    { val: "Zero", label: "Spam Risk" },
                  ].map(({ val, label }, i) => (
                    <motion.div
                      key={val}
                      className="flex flex-col items-start"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                    >
                      <motion.p
                        className="text-4xl sm:text-5xl font-black text-gray-900 leading-none"
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 400, damping: 14 }}
                      >{val}</motion.p>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                    <GoldButton href="/contact" large>Book a Free Demo →</GoldButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                    <Link
                      href="#how-it-works"
                      className="inline-flex items-center justify-center px-8 py-4 text-xs font-black
                        uppercase tracking-[0.2em] rounded-full border border-gray-200 text-gray-500
                        hover:border-gray-400 hover:text-gray-800 transition-colors"
                    >
                      See How It Works ↓
                    </Link>
                  </motion.div>
                </div>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["No App Required", "EN / JA / AR", "Dubai-Ready", "Google Policy Compliant"].map((t, i) => (
                    <motion.span
                      key={t}
                      className="text-sm font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1.5"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 400, damping: 18 }}
                      whileHover={{ scale: 1.05, borderColor: GOLD, color: GOLD_DARK }}
                    >
                      ✓ {t}
                    </motion.span>
                  ))}
                </div>
              </LRStagger>

              {/* ── RIGHT COLUMN: Live Review Dashboard（右半分の中央に配置してバランス調整） ── */}
              <div className="relative flex min-h-[min(520px,70vw)] w-full min-w-0 flex-col items-center justify-center lg:min-h-[min(520px,58vh)]">
                <div className="relative w-full max-w-[460px]">
                  <LiveReviewPanel />

                  {/* Google Search Card */}
                  <div className="absolute -top-3 left-0 z-[12] w-[min(222px,calc(100vw-2.5rem))] sm:-top-5 sm:left-1 md:-top-6 lg:-left-2 lg:top-0 xl:-left-4">
                    <GoogleSearchCard />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. PAIN POINTS ──────────────────────────────────────── */}
        <section className="py-20 bg-white border-t border-line">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            {/* Hero image above pain points */}
            <div className="mb-14 rounded-3xl overflow-hidden shadow-2xl relative">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85&auto=format&fit=crop"
                alt="Busy Dubai restaurant with happy customers"
                width={1400}
                height={520}
                className="w-full h-[260px] md:h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <SectionLabel light>The Challenge</SectionLabel>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  3 Walls Every Dubai<br />Restaurant Faces.
                </h2>
                <p className="mt-3 text-white/70 text-base max-w-lg">
                  Sound familiar? You&apos;re not alone — and there&apos;s a systematic solution.
                </p>
              </div>
            </div>
            <LRStagger className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
              {PAIN_POINTS.map(({ icon, title, body }) => (
                <motion.div
                  key={title}
                  className="rounded-2xl border border-line bg-white p-8 shadow-lg space-y-4"
                  whileHover={{ y: -8, boxShadow: `0 24px 60px rgba(0,0,0,0.1), 0 0 0 1.5px ${GOLD}35` }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <motion.p className="text-5xl" whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>{icon}</motion.p>
                  <h3 className="text-xl font-black text-foreground">{title}</h3>
                  <p className="text-gray-800 text-lg font-semibold leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </LRStagger>
          </div>
        </section>

        {/* ── 3. HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 bg-gray-50 border-t border-line">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="text-center mb-14">
              <SectionLabel>The Process</SectionLabel>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground">
                From QR Scan to Live Review.
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-muted mt-2">
                Under 90 Seconds.
              </p>
            </div>

            {/* Animated flow: QR → survey → AI draft → live on Google (replaces flaky stock photo URL) */}
            <div className="mb-10 overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
              <ReviewFlowHeroAnimation />
            </div>

            <LRStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.13}>
              {HOW_STEPS.map(({ n, icon, title, body }) => (
                <motion.div
                  key={n}
                  className="relative text-center space-y-4 p-7 rounded-2xl bg-white border border-line shadow-lg"
                  whileHover={{ y: -8, boxShadow: `0 24px 60px rgba(0,0,0,0.1), 0 0 0 2px ${GOLD}40` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: GOLD_BG }}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {icon}
                  </motion.div>
                  <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-muted">{n}</span>
                  <h4 className="text-base font-black text-foreground">{title}</h4>
                  <p className="text-base font-medium text-gray-700 leading-relaxed">{body}</p>
                  {n === "01" && (
                    <div className="mt-4 flex justify-center">
                      <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm overflow-hidden">
                        <Image
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://localreach.ai/demo"
                          alt="Sample QR code for LocalReach"
                          width={150}
                          height={150}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </LRStagger>

            {/* Google Maps ranking proof strip */}
            <div className="mt-10 rounded-2xl border border-line bg-white p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Fake local pack */}
                <div className="shrink-0 w-full md:w-72 space-y-2">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-3">
                    Google Maps · Local Pack
                  </p>
                  {[
                    { rank: "#1", name: "Your Restaurant", rating: "4.9", count: "247", you: true },
                    { rank: "#2", name: "Competitor A",    rating: "4.2", count: "89",  you: false },
                    { rank: "#3", name: "Competitor B",    rating: "3.8", count: "44",  you: false },
                  ].map(({ rank, name, rating, count, you }) => (
                    <div
                      key={rank}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border
                        ${you ? "bg-white shadow-md" : "bg-gray-50 border-line"}`}
                      style={you ? { borderColor: GOLD, borderWidth: 2 } : {}}
                    >
                      <span className="text-xs font-black w-6" style={you ? { color: GOLD } : { color: "#aaa" }}>{rank}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${you ? "text-foreground" : "text-muted"}`}>{name}</p>
                        <div className="flex items-center gap-1">
                          <Stars n={you ? 5 : 4} />
                          <span className="text-[9px] text-muted">{rating} ({count})</span>
                        </div>
                      </div>
                      {you && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: GOLD_BG, color: GOLD_DARK }}>
                          LocalReach
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black text-foreground">
                    More reviews = higher Google Maps ranking.
                  </h3>
                  <p className="text-muted leading-relaxed">
                    Google&apos;s local search algorithm heavily weights review volume, recency, and keyword diversity.
                    As a review-growth engine, LocalReach systematically addresses all three — giving your business a compounding
                    Local SEO advantage that grows with every customer interaction.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Review Velocity", "Keyword Diversity", "Recency Signal", "Spam-Free"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-full border"
                        style={{ borderColor: GOLD, color: GOLD_DARK, backgroundColor: GOLD_BG }}
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. FEATURES (ZIG-ZAG) ───────────────────────────────── */}
        {FEATURES.map(({ icon, tag, title, body, bullets, imageUrl }, i) => (
          <section
            key={tag}
            className={`py-24 border-t border-line ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
          >
            <div className="mx-auto max-w-6xl px-6 md:px-10">
              <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}>

                {/* Text */}
                <LRFadeUp delay={0.05} className="flex-1 space-y-6">
                  <motion.div
                    className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                    style={{ backgroundColor: GOLD_BG, color: GOLD_DARK }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                  >
                    <span className="text-base">{icon}</span>
                    {tag}
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">{title}</h2>
                  <p className="text-muted leading-relaxed text-base">{body}</p>
                  <ul className="space-y-3">
                    {bullets.map((b, bi) => (
                      <motion.li
                        key={b}
                        className="flex items-start gap-3 text-sm text-foreground"
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: bi * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.span
                          className="shrink-0 font-black mt-0.5 text-base"
                          style={{ color: GOLD }}
                          whileHover={{ scale: 1.3 }}
                        >✓</motion.span>
                        <span className="font-medium">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <GoldButton href="/contact">Get Started →</GoldButton>
                </LRFadeUp>

                {/* Photo */}
                <LRFadeUp delay={0.15} className="flex-1 w-full">
                  <motion.div
                    className="rounded-3xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02, boxShadow: `0 40px 100px rgba(0,0,0,0.18), 0 0 0 2px ${GOLD}35` }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={900}
                      height={620}
                      className="w-full h-[320px] md:h-[440px] object-cover"
                    />
                  </motion.div>
                </LRFadeUp>

              </div>
            </div>
          </section>
        ))}

        {/* ── 5. SAFETY & COMPLIANCE ──────────────────────────────── */}
        <section className="py-20 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${GOLD}08 0%, transparent 60%)` }}
          />
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <div className="grid lg:grid-cols-2 gap-14 items-start">

              {/* Left */}
              <div className="space-y-8">
                <div
                  className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: `${GOLD}18`, color: GOLD_DARK }}
                >
                  🛡️ Built for Premium Brands
                </div>
                <div>
                  <SectionLabel>Safety &amp; Compliance</SectionLabel>
                  <h2 className="text-4xl sm:text-5xl font-black leading-tight text-gray-900">
                    100% Google<br />Policy Compliant<br />
                    <span style={{ color: GOLD }}>&amp; Safe.</span>
                  </h2>
                  <p className="mt-4 text-gray-600 text-lg font-medium leading-relaxed">
                    Not just effective — built to protect your Google Business Profile
                    as a permanent digital asset for your brand.
                  </p>
                </div>
                {[
                  { n: "01", t: "Feedback-First Flow",    b: "The satisfaction survey framing is feedback collection — not review solicitation. Fully within Google's Terms of Service." },
                  { n: "02", t: "Zero Spam Signals",      b: "AI-unique text ensures no two reviews share structure or phrasing. Google's duplicate-content detection never triggers." },
                  { n: "03", t: "Enterprise Protection",  b: "Designed for chains and luxury brands where a single policy violation could damage years of carefully built reputation." },
                ].map(({ n, t, b }) => (
                  <div key={n} className="flex gap-5 items-start">
                    <span className="text-3xl font-black shrink-0 w-10 leading-none" style={{ color: GOLD, opacity: 0.35 }}>{n}</span>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 mb-1">{t}</h4>
                      <p className="text-base font-medium text-gray-600 leading-relaxed">{b}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Risk vs Solution */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 space-y-4">
                  <p className="text-[10px] font-black tracking-widest uppercase text-red-500">⚠ What Cheap Tools Do</p>
                  <p className="text-base font-medium text-gray-700 leading-relaxed">
                    Most low-cost tools direct customers straight from a QR code to the Google review screen,
                    or incentivize reviews with discounts. Both{" "}
                    <strong className="text-red-600">violate Google&apos;s review policies</strong>{" "}
                    — risking suspension of your entire Business Profile.
                  </p>
                  <ul className="space-y-3">
                    {["Direct QR → review page (solicited reviews)", "Discount or reward incentives", "Identical template text → spam flag"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-base font-medium text-red-600">
                        <span className="shrink-0 font-bold">✗</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-2xl bg-white p-6 space-y-4 shadow-sm"
                  style={{ border: `1.5px solid ${GOLD}50` }}
                >
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD_DARK }}>✓ The LocalReach Approach</p>
                  <p className="text-base font-medium text-gray-700 leading-relaxed">
                    LocalReach inserts a <strong className="text-gray-900">Customer Satisfaction Survey</strong>{" "}
                    as a buffer before the Google review screen. Feedback-first. No incentives. No direct ask.
                    Fully aligned with Google&apos;s guidelines.
                  </p>
                  <ul className="space-y-3">
                    {["Survey-first buffer — not a direct review solicitation", "AI-unique text — zero duplicate signals per submission", "No incentive schemes — organic, authentic reviews only"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-base font-medium text-gray-700">
                        <span className="shrink-0 font-bold" style={{ color: GOLD }}>✓</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="flex items-start gap-3 rounded-xl p-4 mt-2"
                    style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD}40` }}
                  >
                    <span className="text-2xl shrink-0">🛡️</span>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">Google Review Policy:</strong> &quot;Don&apos;t discourage or prohibit negative reviews
                      or selectively solicit positive reviews.&quot; LocalReach collects all feedback —
                      only satisfied customers choose to post.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 6. LEAD GEN HOOK ────────────────────────────────────── */}
        <section className="py-20 bg-gray-50 border-t border-line">
          <div className="mx-auto max-w-3xl px-6 md:px-10 text-center">
            <SectionLabel>Free Strategy Report</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
              How Visible Is Your Business<br />on Google Right Now?
            </h2>
            <p className="text-muted leading-relaxed mb-12">
              Answer 3 quick questions. Book a free consultation. Our experts will deliver a
              custom <strong>Local SEO Strategy Report</strong> for your business within 48 hours.
            </p>

            <div className="space-y-8 text-left">
              {LEAD_GEN_QUESTIONS.map(({ question, options }, qi) => (
                <div
                  key={qi}
                  className="rounded-2xl border border-line bg-white p-7 shadow-lg space-y-4"
                >
                  <p className="text-sm font-black text-foreground">
                    <span className="font-black mr-2" style={{ color: GOLD }}>0{qi + 1}.</span>
                    {question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => {
                      const selected = answers[qi] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers((prev) => ({ ...prev, [qi]: opt }))}
                          className="px-4 py-2.5 rounded-full text-xs font-bold transition-all border"
                          style={
                            selected
                              ? { backgroundColor: GOLD, borderColor: GOLD, color: "#000" }
                              : { backgroundColor: "white", borderColor: "#ececec", color: "#222" }
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {allAnswered ? (
                <>
                  <div
                    className="rounded-2xl border p-6 text-center"
                    style={{ backgroundColor: GOLD_BG, borderColor: `${GOLD}60` }}
                  >
                    <p className="text-sm font-black text-foreground mb-1">
                      ✓ Great — your answers are ready!
                    </p>
                    <p className="text-xs text-muted">
                      Book your free consultation below. Our team will prepare a personalised
                      Local SEO Strategy Report based on your responses.
                    </p>
                  </div>
                  <GoldButton href="/contact?service=local-seo-audit" large>
                    Book My Free Consultation →
                  </GoldButton>
                </>
              ) : (
                <p className="text-xs text-muted">
                  Answer all 3 questions above to unlock your free consultation.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── 7. COMPARISON TABLE ─────────────────────────────────── */}
        <section className="py-20 bg-white border-t border-line">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="text-center mb-12">
              <SectionLabel>Competitive Analysis</SectionLabel>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground">Why LocalReach Wins.</h2>
              <p className="mt-3 text-muted">
                The only solution combining AI uniqueness, passive CRM, and full Google policy compliance.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line shadow-lg">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left px-6 py-5 text-[10px] font-bold uppercase tracking-wider text-muted bg-gray-50 border-b border-line">
                      Feature
                    </th>
                    <th
                      className="px-6 py-5 text-[10px] font-bold uppercase tracking-wider text-center border-b"
                      style={{ backgroundColor: GOLD_BG, color: GOLD_DARK, borderColor: `${GOLD}40` }}
                    >
                      LocalReach
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-wider text-center text-muted bg-gray-50 border-b border-line">
                      Generic Tools
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-wider text-center text-muted bg-gray-50 border-b border-line">
                      Handwritten POP
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {COMPARISON_ROWS.map(({ feature, lr, gen, pop }) => (
                    <tr key={feature} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{feature}</td>
                      <td
                        className="px-6 py-4 text-center text-xs font-black"
                        style={{ color: GOLD_DARK, backgroundColor: `${GOLD_BG}80` }}
                      >
                        {lr}
                      </td>
                      <td className={`px-6 py-4 text-center text-xs font-semibold ${gen.startsWith("✗") ? "text-red-400" : "text-muted"}`}>
                        {gen}
                      </td>
                      <td className={`px-6 py-4 text-center text-xs font-semibold ${pop === "✗" ? "text-red-400" : "text-muted"}`}>
                        {pop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 8. PRICING ──────────────────────────────────────────── */}
        <section className="py-24 bg-gray-50 border-t border-line">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="text-center mb-14">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground">
                Simple, Transparent Pricing.
              </h2>
              <p className="mt-4 text-muted text-lg leading-relaxed max-w-xl mx-auto">
                Everything you need to dominate Local SEO, for less than the cost of a daily coffee.
              </p>
            </div>

            {/* Card centred, max-width so it doesn't stretch on wide screens */}
            <div className="mx-auto max-w-lg">
              <div
                className="rounded-3xl bg-white overflow-hidden"
                style={{
                  border: `1.5px solid ${GOLD}40`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(212,175,55,0.08)`,
                }}
              >
                {/* Gold top bar */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_DARK})` }} />

                <div className="p-10 space-y-8">

                  {/* Plan header */}
                  <div>
                    <p
                      className="text-[10px] font-black tracking-[0.35em] uppercase mb-1"
                      style={{ color: GOLD }}
                    >
                      Plan
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                      LocalReach All-in-One
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-end gap-3">
                      <span
                        className="text-7xl font-black leading-none"
                        style={{ color: GOLD }}
                      >
                        500
                      </span>
                      <div className="mb-1 space-y-0.5">
                        <span className="block text-2xl font-black text-gray-900 leading-none">AED</span>
                        <span className="block text-sm text-gray-400 font-medium">/ month</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 tracking-wide">
                      No hidden fees · Cancel anytime.
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-4 border-t border-gray-100 pt-8">
                    {[
                      { label: "Unlimited AI-Generated Reviews",                            highlight: false },
                      { label: "WhatsApp Stealth CRM",                                      highlight: false },
                      { label: "Monthly GBP Performance Report & Tips",                     highlight: true  },
                      { label: "Instant Email Review Alerts",                               highlight: false },
                      { label: "100% Google Policy Compliant & Safe",                       highlight: false },
                      { label: "Multi-Language Support (EN / AR / JA)",                     highlight: false },
                    ].map(({ label, highlight }) => (
                      <li key={label} className="flex items-start gap-3">
                        <span className="shrink-0 font-black mt-0.5 text-base" style={{ color: GOLD }}>✓</span>
                        <span className={`text-sm leading-relaxed ${highlight ? "text-gray-900 font-bold" : "text-gray-600"}`}>
                          {label}
                        </span>
                        {highlight && (
                          <span
                            className="shrink-0 self-center text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ backgroundColor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}40` }}
                          >
                            New
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="pt-2 space-y-4">
                    <Link
                      href="/contact?service=local-seo-audit"
                      className="flex items-center justify-center w-full rounded-full py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: GOLD, boxShadow: `0 8px 24px ${GOLD}50` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_DARK; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
                    >
                      Book a Free Demo →
                    </Link>
                    <p className="text-center text-[10px] text-gray-400 tracking-wide">
                      30-min live walkthrough · No commitment required
                    </p>
                  </div>

                </div>
              </div>

              {/* Social proof strip below card */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {["Google Policy Compliant", "Dubai Market Expert", "Setup in 24 Hours", "Zero Setup Fee"].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold text-muted border border-line rounded-full px-3 py-1.5"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. FINAL CTA ────────────────────────────────────────── */}
        <section className="py-24 text-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          style={{ background: `linear-gradient(160deg, #1a1a1a 0%, #000000 50%, ${GOLD}15 100%)` }}
        >
          {/* Subtle dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, ${GOLD}40 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Centre glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 60%, ${GOLD}12 0%, transparent 65%)` }}
          />
          <div className="relative mx-auto max-w-2xl px-6 space-y-8">
            <p className="text-6xl">🚀</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white">
              Ready to Dominate<br />
              <span className="shimmer-gold-text">Your Local Market?</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
              Join forward-thinking Dubai businesses already using LocalReach
              to build reviews, grow their CRM, and rank higher on Google Maps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoldButton href="/contact" large>📅 Book a Free Demo</GoldButton>
            </div>
            <p className="text-xs text-gray-400">
              No commitment · 30-min live walkthrough · Available in EN / JA / AR
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {["Google Policy Compliant", "Dubai Market Expert", "Multi-language Ready", "Zero Setup Fee"].map((b) => (
                <span key={b} className="text-[10px] font-semibold border border-gray-600 rounded-full px-3 py-1.5 text-gray-300">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

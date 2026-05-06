"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { LOCALREACH_LEAD_QUIZ_QUESTIONS, LOCALREACH_QUIZ_STORAGE_KEY } from "@/content/localReachLeadQuiz";

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
  { n: "01", icon: "📱", title: "Customer Scans QR", body: "A branded QR code at the table opens LocalReach — no app download, no friction, works on any device." },
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
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=85&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900&q=85&auto=format&fit=crop",
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

// ── Sub-components ─────────────────────────────────────────────────

function GoldButton({ href, children, large, onClick }: { href: string; children: React.ReactNode; large?: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-full
        transition-all hover:scale-105 active:scale-[0.97] shadow-lg
        ${large ? "px-12 py-5 text-sm" : "px-8 py-4 text-xs"}`}
      style={{ backgroundColor: GOLD, color: "#000" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_DARK; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
      onClick={onClick}
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
      className="absolute rounded-2xl overflow-hidden"
      style={{
        top: 44,
        right: 0,
        width: 222,
        zIndex: 3,
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
  const lastQuizCardRef = useRef<HTMLDivElement>(null);
  const wasAllAnswered = useRef(false);
  const quizLen = LOCALREACH_LEAD_QUIZ_QUESTIONS.length;
  const allAnswered = [...Array(quizLen).keys()].every((i) => Boolean(answers[i]));

  const contactHrefWithQuiz = useMemo(() => {
    const p = new URLSearchParams();
    p.set("service", "local-seo-audit");
    p.set("source", "localreach-quiz");
    if (allAnswered) {
      LOCALREACH_LEAD_QUIZ_QUESTIONS.forEach((_, i) => {
        const v = answers[i];
        if (v) p.set(`q${i}`, v);
      });
    }
    return `/contact?${p.toString()}`;
  }, [allAnswered, answers]);

  useEffect(() => {
    if (allAnswered && !wasAllAnswered.current) {
      lastQuizCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    wasAllAnswered.current = allAnswered;
  }, [allAnswered]);

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
      `}</style>

      <main className="w-full">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-6 md:px-10">
          <Header showNav brand="gam" theme="light" />
        </div>

        {/* ── 1. HERO ─────────────────────────────────────────────── */}
        <section className="bg-white relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Soft gold glow top-right */}
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${GOLD}10 0%, transparent 65%)` }}
          />

          <div className="relative mx-auto max-w-6xl px-6 md:px-10 py-16 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left: Copy */}
              <div className="flex-1 space-y-8 animate-slide-up">
                {/* Product wordmark */}
                <div className="mb-6 animate-fade-in-down">
                  <span className="text-2xl font-semibold text-gray-800 tracking-tight">Local</span>
                  <span className="text-2xl font-black tracking-tight" style={{ color: GOLD }}>Reach</span>
                </div>

                {/* Live badge */}
                <div className="flex items-center gap-2">
                  <span className="ping-soft w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#16a34a" }} />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-700">
                    Live · Google Reviews Growing in Real-Time
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-3">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight text-gray-900">
                    Maximize 5-Star Growth<br />
                    from Every{" "}
                    <span className="shimmer-gold-text">Happy Guest.</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-xl">
                    Your guests already love you — LocalReach simply makes it effortless for
                    them to say so on Google. We surface the satisfaction that already exists,
                    route private concerns away from public view, and compound your reputation
                    month over month. Built for Dubai&apos;s most competitive F&amp;B market.
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  {[
                    { val: "3×", label: "Faster Review Growth" },
                    { val: "100%", label: "Google Compliant" },
                    { val: "Zero", label: "Spam Risk" },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <p className="text-4xl font-black" style={{ color: GOLD }}>{val}</p>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <GoldButton href="/contact" large>Book a Free Demo →</GoldButton>
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-8 py-4 text-xs font-black
                      uppercase tracking-[0.2em] rounded-full border border-gray-200 text-gray-500
                      hover:border-gray-400 hover:text-gray-800 transition-all"
                  >
                    See How It Works ↓
                  </Link>
                </div>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["No App Required", "EN / JA / AR", "Dubai-Ready", "Google Policy Compliant"].map((t) => (
                    <span
                      key={t}
                      className="text-sm font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1.5"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Google Ecosystem stage (desktop only) ─────── */}
              <div
                className="hidden lg:block flex-shrink-0 relative animate-slide-up-delayed"
                style={{ width: 460, height: 600 }}
              >
                {/* ── STAGE: premium light background ────────────────────── */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none bg-gray-50 border border-gray-100 shadow-inner"
                />

                {/* ── AMBIENT GOLD GLOW ──────────────────────────────────── */}
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: 320, height: 320,
                    top: "40%", left: "24%",
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, ${GOLD}15 0%, transparent 65%)`,
                  }}
                />

                {/* ── UPWARD MOMENTUM ARROWS (behind phone, z-1) ─────────── */}
                <div className="arrow-drift-a absolute pointer-events-none" style={{ top: 108, left: 228, zIndex: 1 }}>
                  <UpArrow size={28} />
                </div>
                <div className="arrow-drift-b absolute pointer-events-none" style={{ top: 218, left: 272, zIndex: 1 }}>
                  <UpArrow size={20} />
                </div>
                <div className="arrow-drift-c absolute pointer-events-none" style={{ top: 62, left: 305, zIndex: 1 }}>
                  <UpArrow size={24} />
                </div>
                <div className="arrow-drift-d absolute pointer-events-none" style={{ top: 330, left: 250, zIndex: 1 }}>
                  <UpArrow size={16} />
                </div>

                {/* ── FLOATING GOOGLE PINS (right strip, z-4) ────────────── */}
                <div className="pin-float-a absolute" style={{ top: 52, right: 42, zIndex: 4 }}>
                  <GooglePin color={GOLD} size={36} />
                </div>
                <div className="pin-float-b absolute" style={{ top: 162, right: 18, zIndex: 4 }}>
                  <GooglePin color="#4285F4" size={28} />
                </div>
                <div className="pin-float-c absolute" style={{ top: 308, right: 46, zIndex: 4 }}>
                  <GooglePin color={GOLD} size={22} />
                </div>
                <div className="pin-float-d absolute" style={{ bottom: 148, right: 90, zIndex: 4 }}>
                  <GooglePin color="#34A853" size={20} />
                </div>

                {/* ── SEARCH RESULTS CARD (behind phone, peeks right, z-3) ─ */}
                <GoogleSearchCard />

                {/* ── iPHONE (foreground, z-10) ──────────────────────────── */}
                <div className="absolute" style={{ left: 28, top: 28, zIndex: 10 }}>
                  <IPhoneMockup />

                  {/* "New 5-star review!" toast — bottom-left of phone */}
                  <div
                    className="badge-float absolute flex items-center gap-2.5 bg-white rounded-2xl border border-gray-100"
                    style={{
                      bottom: -6,
                      left: -14,
                      zIndex: 20,
                      padding: "10px 14px 10px 12px",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                    }}
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#f0fdf4" }}
                    >
                      <span style={{ fontSize: 14 }}>⭐</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 leading-none">New 5-star review!</p>
                      <p className="text-[8.5px] text-slate-400 leading-none mt-1">Google Maps · just now</p>
                    </div>
                  </div>
                </div>

                {/* ── GOOGLE MAPS RANK BADGE (top-right of phone, z-20) ──── */}
                <div
                  className="badge-float absolute bg-white rounded-2xl border border-gray-100"
                  style={{
                    top: 22,
                    left: 272,
                    zIndex: 20,
                    padding: "10px 16px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                    animationDelay: "0.9s",
                  }}
                >
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Google Maps Rank
                  </p>
                  <p className="text-[22px] font-black leading-tight mt-0.5" style={{ color: GOLD }}>#1</p>
                </div>
              </div>

              {/* ── RIGHT COLUMN: mobile (bare phone + badges) ─────────────── */}
              <div className="lg:hidden flex-shrink-0 relative animate-slide-up-delayed">
                <IPhoneMockup />
                <div
                  className="badge-float absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-2xl px-4 py-3
                    flex items-center gap-3 border border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-base">⭐</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-800">New 5-star review!</p>
                    <p className="text-[9px] text-slate-400">Google Maps · just now</p>
                  </div>
                </div>
                <div
                  className="badge-float absolute -top-4 -right-6 bg-white rounded-2xl shadow-2xl px-4 py-3
                    border border-gray-100"
                  style={{ animationDelay: "1s" }}
                >
                  <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Google Maps Rank</p>
                  <p className="text-2xl font-black" style={{ color: GOLD }}>#1</p>
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
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85&auto=format&fit=crop"
                alt="Busy Dubai restaurant dining room"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAIN_POINTS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-line bg-white p-8 shadow-lg hover:shadow-xl
                    transition-all hover:-translate-y-1 space-y-4"
                >
                  <p className="text-5xl">{icon}</p>
                  <h3 className="text-xl font-black text-foreground">{title}</h3>
                  <p className="text-gray-800 text-lg font-semibold leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
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

            {/* Lifestyle photo: customer at cafe scanning QR */}
            <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1400&q=85&auto=format&fit=crop"
                alt="Customer at a Dubai cafe using their smartphone to scan a QR code"
                width={1400}
                height={560}
                className="w-full h-[280px] md:h-[420px] object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW_STEPS.map(({ n, icon, title, body }) => (
                <div
                  key={n}
                  className="relative text-center space-y-4 p-7 rounded-2xl bg-white border border-line
                    shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div
                    className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: GOLD_BG }}
                  >
                    {icon}
                  </div>
                  <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-muted">{n}</span>
                  <h4 className="text-base font-black text-foreground">{title}</h4>
                  <p className="text-base font-medium text-gray-700 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

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
                    LocalReach systematically addresses all three — giving your business a compounding
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
            className={`py-20 border-t border-line ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
          >
            <div className="mx-auto max-w-6xl px-6 md:px-10">
              <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-14 items-center`}>

                {/* Text */}
                <div className="flex-1 space-y-6">
                  <div
                    className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                    style={{ backgroundColor: GOLD_BG, color: GOLD_DARK }}
                  >
                    <span className="text-base">{icon}</span>
                    {tag}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">{title}</h2>
                  <p className="text-muted leading-relaxed">{body}</p>
                  <ul className="space-y-3">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="shrink-0 font-black mt-0.5" style={{ color: GOLD }}>✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <GoldButton href="/contact">Get Started →</GoldButton>
                </div>

                {/* Photo */}
                <div className="flex-1 w-full">
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={900}
                      height={620}
                      className="w-full h-[320px] md:h-[440px] object-cover"
                    />
                  </div>
                </div>

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
              {LOCALREACH_LEAD_QUIZ_QUESTIONS.map(({ question, options }, qi) => {
                const isLast = qi === quizLen - 1;
                return (
                  <div
                    key={qi}
                    ref={isLast ? lastQuizCardRef : undefined}
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
                            type="button"
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
                    {isLast && allAnswered && (
                      <div className="mt-6 space-y-4 border-t border-line pt-6 text-center">
                        <div
                          className="rounded-2xl border p-6"
                          style={{ backgroundColor: GOLD_BG, borderColor: `${GOLD}60` }}
                        >
                          <p className="text-sm font-black text-foreground mb-1">
                            ✓ Great — your answers are ready!
                          </p>
                          <p className="text-xs text-muted">
                            Continue to contact — we&apos;ll pre-fill your quiz answers in the message
                            so our team can prepare your Local SEO Strategy Report.
                          </p>
                        </div>
                        <GoldButton
                          href={contactHrefWithQuiz}
                          large
                          onClick={() => {
                            try {
                              const t0 = answers[0]?.trim();
                              const t1 = answers[1]?.trim();
                              const t2 = answers[2]?.trim();
                              if (t0 && t1 && t2) {
                                sessionStorage.setItem(
                                  LOCALREACH_QUIZ_STORAGE_KEY,
                                  JSON.stringify({ q0: t0, q1: t1, q2: t2 }),
                                );
                              }
                            } catch {
                              /* ignore */
                            }
                          }}
                        >
                          Book My Free Consultation →
                        </GoldButton>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!allAnswered && (
              <p className="mt-10 text-xs text-muted">
                Answer all 3 questions above to unlock your free consultation.
              </p>
            )}
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
        <section className="py-24 text-center relative overflow-hidden border-t border-gray-100"
          style={{ background: `linear-gradient(160deg, #fffdf5 0%, #ffffff 50%, ${GOLD_BG} 100%)` }}
        >
          {/* Subtle dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35]"
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
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-gray-900">
              Ready to Dominate<br />
              <span className="shimmer-gold-text">Your Local Market?</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto">
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
                <span key={b} className="text-[10px] font-semibold border border-gray-200 rounded-full px-3 py-1.5 text-gray-400">
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

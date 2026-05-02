"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

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

// ── iPhone Mockup ──────────────────────────────────────────────────

const MOCK_REVIEWS = [
  { initial: "A", color: "#4285F4", name: "Ahmed M.", text: "Incredible atmosphere — the salmon sashimi was flawless. Will absolutely return!", time: "2 days ago" },
  { initial: "Y", color: "#34A853", name: "Yuki T.",  text: "Best omakase in Dubai Marina. Exceptional fresh ingredients every visit.", time: "5 days ago" },
  { initial: "S", color: "#EA4335", name: "Sarah K.", text: "Staff were incredibly welcoming. Fantastic Japanese whisky selection too.", time: "1 week ago" },
];

function IPhoneMockup() {
  return (
    <div className="iphone-float relative mx-auto" style={{ width: 230, height: 470 }}>
      {/* Outer frame */}
      <div
        className="absolute inset-0 rounded-[42px] shadow-2xl"
        style={{ background: "linear-gradient(145deg, #2a2a2a, #111111)", border: "10px solid #1a1a1a" }}
      />
      {/* Dynamic Island */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-3 rounded-full"
        style={{ width: 80, height: 22, backgroundColor: "#000", zIndex: 10 }}
      />
      {/* Screen */}
      <div
        className="absolute rounded-[34px] overflow-hidden bg-white"
        style={{ inset: 10, top: 10 }}
      >
        {/* Google Maps header bar */}
        <div className="px-3 py-2" style={{ backgroundColor: "#4285F4" }}>
          <p className="text-[9px] font-bold text-white tracking-wider">Google Maps · Your Business</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Stars n={5} />
            <span className="text-[9px] text-white/80 ml-1">4.9 · 247 reviews</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="divide-y divide-gray-100 overflow-hidden">
          {MOCK_REVIEWS.map(({ initial, color, name, text, time }) => (
            <div key={name} className="px-3 py-2.5 bg-white">
              <div className="flex items-start gap-2">
                <div
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ fontSize: 9, backgroundColor: color }}
                >
                  {initial}
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#222" }}>{name}</p>
                  <Stars n={5} />
                  <p style={{ fontSize: 8, color: "#666", lineHeight: 1.4, marginTop: 2 }} className="line-clamp-2">
                    {text}
                  </p>
                  <p style={{ fontSize: 7, color: "#aaa", marginTop: 2 }}>{time} · <span style={{ color: "#4285F4" }}>Google</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="w-20 h-1 rounded-full bg-gray-300" />
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
        .iphone-float        { animation: lrFloatPhone  4s ease-in-out infinite; }
        .badge-float         { animation: lrFloatBadge  3s ease-in-out infinite 0.5s; }
        .shimmer-gold-text {
          background: linear-gradient(90deg, #D4AF37 0%, #F5E3A0 45%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lrShimmer 3s linear infinite;
        }
        .live-dot { animation: lrPulse 1.8s ease-in-out infinite; }
      `}</style>

      <main className="w-full">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="bg-foreground px-6 md:px-10">
          <Header showNav brand="localreach" />
        </div>

        {/* ── 1. HERO ─────────────────────────────────────────────── */}
        <section className="bg-foreground text-white relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Gold glow */}
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${GOLD}18 0%, transparent 65%)` }}
          />

          <div className="relative mx-auto max-w-6xl px-6 md:px-10 py-24 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left: Copy */}
              <div className="flex-1 space-y-8 animate-slide-up">
                {/* Live badge */}
                <div className="flex items-center gap-2">
                  <span className="live-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#4ADE80" }} />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-400">
                    Live · Google Reviews Growing in Real-Time
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-3">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight">
                    Turn Every Visit<br />
                    Into a{" "}
                    <span className="shimmer-gold-text">5-Star Review.</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed max-w-xl">
                    LocalReach&apos;s AI generates a unique, spam-proof Google review for every customer —
                    while quietly building your WhatsApp contact list in the background.
                    Built specifically for Dubai&apos;s competitive market.
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
                      <p className="text-sm font-bold text-white/80 uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <GoldButton href="/contact" large>Book a Free Demo →</GoldButton>
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-8 py-4 text-xs font-black
                      uppercase tracking-[0.2em] rounded-full border border-white/20 text-white/70
                      hover:border-white/50 hover:text-white transition-all"
                  >
                    See How It Works ↓
                  </Link>
                </div>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["No App Required", "EN / JA / AR", "Dubai-Ready", "Google Policy Compliant"].map((t) => (
                    <span
                      key={t}
                      className="text-sm font-semibold text-white/75 border border-white/25 rounded-full px-3 py-1.5"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: iPhone Mockup */}
              <div className="flex-shrink-0 relative animate-slide-up-delayed">
                <IPhoneMockup />

                {/* Floating badge: new review notification */}
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

                {/* Floating badge: ranking */}
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
        <section className="py-20 bg-foreground text-white border-t border-white/10 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${GOLD}15 0%, transparent 60%)` }}
          />
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <div className="grid lg:grid-cols-2 gap-14 items-start">

              {/* Left */}
              <div className="space-y-8">
                <div
                  className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: `${GOLD}20`, color: GOLD }}
                >
                  🛡️ Built for Premium Brands
                </div>
                <div>
                  <SectionLabel light>Safety &amp; Compliance</SectionLabel>
                  <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                    100% Google<br />Policy Compliant<br />
                    <span style={{ color: GOLD }}>&amp; Safe.</span>
                  </h2>
                  <p className="mt-4 text-white/90 text-lg font-medium leading-relaxed">
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
                    <span className="text-3xl font-black opacity-20 shrink-0 w-10 leading-none" style={{ color: GOLD }}>{n}</span>
                    <div>
                      <h4 className="text-lg font-black text-white mb-1">{t}</h4>
                      <p className="text-base font-medium text-white/80 leading-relaxed">{b}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Risk vs Solution */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-red-800/40 bg-red-950/30 p-6 space-y-4">
                  <p className="text-[10px] font-black tracking-widest uppercase text-red-400">⚠ What Cheap Tools Do</p>
                  <p className="text-lg font-medium text-gray-100 leading-relaxed">
                    Most low-cost tools direct customers straight from a QR code to the Google review screen,
                    or incentivize reviews with discounts. Both{" "}
                    <strong className="text-red-300">violate Google&apos;s review policies</strong>{" "}
                    — risking suspension of your entire Business Profile.
                  </p>
                  <ul className="space-y-3">
                    {["Direct QR → review page (solicited reviews)", "Discount or reward incentives", "Identical template text → spam flag"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-base font-medium text-red-200">
                        <span className="shrink-0 font-bold">✗</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-2xl p-6 space-y-4"
                  style={{ backgroundColor: "#12110A", border: `1.5px solid ${GOLD}50` }}
                >
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>✓ The LocalReach Approach</p>
                  <p className="text-lg font-medium text-gray-100 leading-relaxed">
                    LocalReach inserts a <strong className="text-white">Customer Satisfaction Survey</strong>{" "}
                    as a buffer before the Google review screen. Feedback-first. No incentives. No direct ask.
                    Fully aligned with Google&apos;s guidelines.
                  </p>
                  <ul className="space-y-3">
                    {["Survey-first buffer — not a direct review solicitation", "AI-unique text — zero duplicate signals per submission", "No incentive schemes — organic, authentic reviews only"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-base font-medium" style={{ color: "#F5E3A0" }}>
                        <span className="shrink-0 font-bold" style={{ color: GOLD }}>✓</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="flex items-start gap-3 rounded-xl p-4 mt-2"
                    style={{ backgroundColor: `${GOLD}12`, border: `1px solid ${GOLD}30` }}
                  >
                    <span className="text-2xl shrink-0">🛡️</span>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                      <strong className="text-white">Google Review Policy:</strong> &quot;Don&apos;t discourage or prohibit negative reviews
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
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{ background: "linear-gradient(155deg, #111111 0%, #1a1a1a 100%)", border: "1.5px solid rgba(255,255,255,0.08)" }}
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
                    <h3 className="text-2xl font-black text-white leading-tight">
                      LocalReach All-in-One
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="border-t border-white/10 pt-8">
                    <div className="flex items-end gap-3">
                      <span
                        className="text-7xl font-black leading-none"
                        style={{ color: GOLD }}
                      >
                        500
                      </span>
                      <div className="mb-1 space-y-0.5">
                        <span className="block text-2xl font-black text-white leading-none">AED</span>
                        <span className="block text-sm text-white/40 font-medium">/ month</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-white/35 tracking-wide">
                      No hidden fees · Cancel anytime.
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-4 border-t border-white/10 pt-8">
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
                        <span className={`text-sm leading-relaxed ${highlight ? "text-white font-bold" : "text-white/75"}`}>
                          {label}
                        </span>
                        {highlight && (
                          <span
                            className="shrink-0 self-center text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ backgroundColor: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}40` }}
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
                      className="flex items-center justify-center w-full rounded-full py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: GOLD }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_DARK; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
                    >
                      Book a Free Demo →
                    </Link>
                    <p className="text-center text-[10px] text-white/25 tracking-wide">
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
        <section className="py-24 bg-foreground text-white text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 50%, ${GOLD}15 0%, transparent 60%)` }}
          />
          <div className="relative mx-auto max-w-2xl px-6 space-y-8">
            <p className="text-6xl">🚀</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              Ready to Dominate<br />
              <span className="shimmer-gold-text">Your Local Market?</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg mx-auto">
              Join forward-thinking Dubai businesses already using LocalReach
              to build reviews, grow their CRM, and rank higher on Google Maps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoldButton href="/contact" large>📅 Book a Free Demo</GoldButton>
            </div>
            <p className="text-xs text-white/30">
              No commitment · 30-min live walkthrough · Available in EN / JA / AR
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {["Google Policy Compliant", "Dubai Market Expert", "Multi-language Ready", "Zero Setup Fee"].map((b) => (
                <span key={b} className="text-[10px] font-semibold border border-white/10 rounded-full px-3 py-1.5 text-white/30">
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

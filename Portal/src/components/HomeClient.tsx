"use client";

import React from "react";
import Link from "next/link";
import Header from "./Header";
import {
  ArrowRight, Star, Shield, Zap, Globe, MapPin,
  CheckCircle, Gift, Target, MessageCircle, Phone
} from "lucide-react";

const GOLD = "#D4AF37";
const GOLD_HOVER = "#B8961C";

/* ─────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────── */
function GoldButton({
  href,
  children,
  large,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-black uppercase tracking-[0.15em] text-black transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5
        ${large ? "px-10 py-4 text-[13px]" : "px-7 py-3 text-[11px]"}`}
      style={{ backgroundColor: GOLD }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_HOVER; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
    >
      {children}
    </Link>
  );
}

function Check({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-gray-700">
      <span
        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
        style={{ backgroundColor: GOLD }}
      >✓</span>
      <span className="font-semibold leading-snug">{text}</span>
    </li>
  );
}

function Chip({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return gold ? (
    <span
      className="inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-widest border"
      style={{ borderColor: `${GOLD}60`, color: GOLD, backgroundColor: `${GOLD}10` }}
    >
      {children}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-widest border border-gray-200 bg-white text-gray-500">
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Hero: mirAIreach Bridge Visual
───────────────────────────────────────────────────── */
function PlatformNode({ label, icon, bg, fg }: { label: string; icon: string; bg: string; fg: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md"
        style={{ backgroundColor: bg, color: fg, border: `1.5px solid ${fg}30` }}
      >
        {icon}
      </div>
      <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap tracking-wide">{label}</span>
    </div>
  );
}

function BridgeVisual() {
  const nodes = [
    { label: "Google Business", icon: "G",  bg: "#EAF1FB", fg: "#4285F4", top: "13%", left: "13%", cls: "animate-float"    },
    { label: "Instagram",       icon: "IG", bg: "#FDE8EF", fg: "#E1306C", top: "13%", left: "87%", cls: "animate-float-d1" },
    { label: "Apple Maps",      icon: "A",  bg: "#F2F2F2", fg: "#444444", top: "87%", left: "13%", cls: "animate-float-d2" },
    { label: "ChatGPT",         icon: "AI", bg: "#E8F8F4", fg: "#10A37F", top: "87%", left: "87%", cls: "animate-float-d3" },
  ];
  const lines = [
    { x1: 14, y1: 14, x2: 42, y2: 42 },
    { x1: 86, y1: 14, x2: 58, y2: 42 },
    { x1: 14, y1: 86, x2: 42, y2: 58 },
    { x1: 86, y1: 86, x2: 58, y2: 58 },
  ];
  return (
    <div className="relative w-full max-w-[380px] mx-auto" style={{ aspectRatio: "1 / 1" }}>
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="11" fill="none" stroke="#D4AF37" strokeWidth="0.6" className="animate-ring-1" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="#D4AF37" strokeWidth="0.6" className="animate-ring-2" />
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#D4AF3785" strokeWidth="0.9" strokeDasharray="4 3" strokeLinecap="round"
            className="animate-march" style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {[{ cx: 28, cy: 28 }, { cx: 72, cy: 28 }, { cx: 28, cy: 72 }, { cx: 72, cy: 72 }].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="1.4" fill="#D4AF37" opacity="0.5" />
        ))}
      </svg>
      <div className="absolute z-10 animate-glow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <div className="px-4 py-2.5 rounded-xl font-black text-sm tracking-wide bg-white shadow-xl whitespace-nowrap"
          style={{ border: `2px solid ${GOLD}`, color: GOLD }}>
          mir<span className="text-gray-900">AI</span>reach
        </div>
      </div>
      {nodes.map((n) => (
        <div key={n.label} className={`absolute z-10 ${n.cls}`}
          style={{ top: n.top, left: n.left, transform: "translate(-50%, -50%)" }}>
          <PlatformNode label={n.label} icon={n.icon} bg={n.bg} fg={n.fg} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Bento Grid — mirAIreach Platform Showcase
───────────────────────────────────────────────────── */
const SYNC_PLATFORMS = [
  { init: "G", name: "Google Business",  status: "Synced",    color: "#4285F4" },
  { init: "A", name: "Apple Maps",       status: "Synced",    color: "#444444" },
  { init: "Y", name: "Yelp",             status: "Updating…", color: "#D32323" },
  { init: "T", name: "TripAdvisor",      status: "Synced",    color: "#00AF87" },
  { init: "F", name: "Foursquare",       status: "Synced",    color: "#F94877" },
  { init: "+", name: "+95 more",         status: "All synced",color: "#9CA3AF" },
];

function BentoGrid() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">
            The mirAIreach Platform
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
            Enterprise-Grade Power.<br />
            <span style={{ color: GOLD }}>Centralized in One Dashboard.</span>
          </h2>
        </div>

        {/* Bento: 3-col on desktop, stacked on mobile */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── Card 1: GEO (large, bright/light) — spans 2 cols × 2 rows ── */}
          <div
            className="lg:col-span-2 lg:row-span-2 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden flex flex-col justify-between p-8 md:p-10 hover:shadow-2xl transition-shadow duration-300"
            style={{ background: "linear-gradient(145deg, #ffffff 0%, #faf9f4 100%)" }}
          >
            {/* Neural Network SVG Background */}
            <svg className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-[0.06] pointer-events-none animate-float" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,20 L30,40 L60,10 L90,50 L70,80 L40,70 L20,90 Z" fill="none" stroke="#000" strokeWidth="0.8" />
              <circle cx="10" cy="20" r="3" fill="#000" />
              <circle cx="30" cy="40" r="4" fill="#000" />
              <circle cx="60" cy="10" r="3" fill="#000" />
              <circle cx="90" cy="50" r="5" fill="#000" />
              <circle cx="70" cy="80" r="4" fill="#000" />
              <circle cx="40" cy="70" r="3" fill="#000" />
              <circle cx="20" cy="90" r="3" fill="#000" />
              <path d="M30,40 L40,70 M60,10 L70,80 M90,50 L40,70 M10,20 L60,10" fill="none" stroke="#000" strokeWidth="0.4" strokeDasharray="2 2" />
            </svg>
            
            {/* Soft gold glow — top right */}
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.13] blur-3xl"
              style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />

            {/* Text block */}
            <div className="relative z-10 mb-6">
              <span
                className="inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-widest border mb-3 shadow-sm"
                style={{ borderColor: `${GOLD}60`, color: GOLD, backgroundColor: `${GOLD}10` }}
              >
                Core Technology
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Generative Engine<br />Optimization (GEO)
              </h3>
              <p className="mt-2 text-gray-600 font-medium text-base leading-relaxed max-w-lg">
                Our data-structuring engine aligns your brand precisely with what AI systems
                expect — making ChatGPT, Google AI Overviews, and Perplexity recommend you
                first, every time.
              </p>
            </div>

            {/* AI Search visual */}
            <div className="relative z-10 flex-1 flex flex-col justify-end space-y-4">
              {/* Stylised search bar & Score */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-md relative overflow-hidden flex-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 via-purple-400 to-amber-400" />
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-pulse" />
                  </div>
                  <span className="text-sm md:text-base text-gray-800 font-bold flex-1 truncate">
                    &quot;best restaurant in Dubai&quot;
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse hidden sm:inline-block">Analyzing...</span>
                </div>
                
                {/* Live Confidence Score */}
                <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-md flex items-center justify-between sm:flex-col sm:justify-center shrink-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 sm:mb-1">AI Confidence</p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-xl md:text-2xl font-black text-green-500 leading-none">98%</span>
                    <div className="flex gap-0.5 pb-1">
                       <div className="w-1 h-2 bg-green-200 rounded-sm"></div>
                       <div className="w-1 h-3 bg-green-300 rounded-sm"></div>
                       <div className="w-1 h-4 bg-green-500 rounded-sm animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI response cards — side by side */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-green-50/80 backdrop-blur-sm border border-green-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">✨</span>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Google AI Overview</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    <strong className="text-gray-900">GAM Solutions</strong> with{" "}
                    <strong style={{ color: GOLD }}>mirAIreach</strong> is highly
                    recommended for Dubai businesses…
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50/80 backdrop-blur-sm border border-gray-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black" style={{ color: "#10A37F" }}>AI</span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ChatGPT</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    For AI-optimised marketing in Dubai, I recommend{" "}
                    <strong className="text-gray-900">mirAIreach</strong>-powered
                    businesses…
                  </p>
                </div>
              </div>

              {/* Trusted & Cited By */}
              <div className="pt-4 mt-2 relative z-10 border-t border-gray-200/60">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center sm:text-left">
                  Trusted &amp; Cited By
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  {[
                    { name: "Google Gemini", color: "from-blue-500 to-purple-500" },
                    { name: "ChatGPT", color: "from-[#10A37F] to-[#0d8a6a]" },
                    { name: "Perplexity AI", color: "from-cyan-500 to-blue-500" },
                    { name: "Apple Intelligence", color: "from-gray-800 to-black" },
                    { name: "Bing Search", color: "from-blue-500 to-teal-400" },
                  ].map((ai) => (
                    <div key={ai.name} className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform">
                       <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${ai.color}`} />
                       <span className="text-[11px] font-bold text-gray-800">{ai.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2: 100+ Platform Sync — FULL merged dashboard ── */}
          <div className="rounded-3xl border border-gray-200 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden">
            {/* Text header */}
            <div className="px-6 pt-6 pb-4">
              <Chip>100+ Platforms</Chip>
              <h3 className="mt-3 text-xl font-black text-gray-900 leading-tight">Global Platform Sync</h3>
              <p className="mt-1.5 text-sm text-gray-500 font-medium leading-snug">
                Update once — instantly sync across 100+ directories via Synup.
              </p>
            </div>

            {/* Mac-window style list — full detail */}
            <div className="mx-5 mb-5 rounded-2xl border border-gray-100 overflow-hidden flex-1">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-300" />
                  <div className="w-2 h-2 rounded-full bg-yellow-300" />
                  <div className="w-2 h-2 rounded-full bg-green-300" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-600">Live</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {SYNC_PLATFORMS.map((p) => (
                  <div key={p.name} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: `${p.color}18`, color: p.color }}>
                        {p.init}
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{p.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${p.status === "Updating…" ? "text-amber-500" : "text-green-600"}`}>
                      {p.status === "Updating…" ? "⟳ " : "✓ "}{p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Card 3: Omnichannel Auto-Posting ── */}
          <div className="rounded-3xl p-7 shadow-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            <Chip>Automation</Chip>
            <h3 className="mt-4 text-xl font-black text-gray-900 leading-tight">Omnichannel Auto-Posting</h3>
            <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
              Publish on Instagram and cascade to Google Business Profile automatically.
              One post, every platform.
            </p>

            {/* IG → GBP animated flow */}
            <div className="mt-auto pt-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md shrink-0"
                  style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
                >IG</div>
                <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-gray-100">
                  <div className="h-full animate-shimmer-right" />
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-md shrink-0 border border-blue-100"
                  style={{ backgroundColor: "#EAF1FB", color: "#4285F4" }}
                >GBP</div>
              </div>
              <p className="mt-3 text-[11px] text-gray-400 font-medium">
                Content flows automatically to all connected channels
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Feature 1 visual: iPhone + Google ecosystem
───────────────────────────────────────────────────── */
const ALL_REVIEWS = [
  { initials: "SM", bg: "#EA4335", name: "Sarah M.",   stars: 5, text: "Absolutely amazing — best in Dubai! Will tell everyone." },
  { initials: "AK", bg: "#34A853", name: "Ahmed K.",   stars: 5, text: "Great service, definitely returning next weekend." },
  { initials: "LW", bg: "#9C27B0", name: "Li Wei",     stars: 5, text: "Fantastic food and welcoming staff! 10/10 experience." },
  { initials: "FN", bg: "#4285F4", name: "Fatima N.",  stars: 5, text: "Premium quality, impeccable hospitality. Highly recommend." },
  { initials: "RP", bg: "#FF9800", name: "Ravi P.",    stars: 5, text: "Best omakase in the Marina. Exceptional every visit." },
  { initials: "CN", bg: "#00BCD4", name: "Carlos N.",  stars: 5, text: "Incredible atmosphere and freshest ingredients." },
];
// doubled for seamless infinite scroll
const SCROLL_REVIEWS = [...ALL_REVIEWS, ...ALL_REVIEWS];

function ReviewCard({ initials, bg, name, text }: { initials: string; bg: string; name: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 mb-2.5 shrink-0">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ background: bg }}>
          {initials}
        </div>
        <span className="text-[11px] font-bold text-gray-800">{name}</span>
        <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${GOLD}20`, color: GOLD }}>AI ✓</span>
      </div>
      <div className="text-yellow-400 text-[10px] mb-1">★★★★★</div>
      <p className="text-[10px] text-gray-600 leading-relaxed">{text}</p>
      <p className="text-[8px] text-blue-500 mt-1 font-semibold">Google</p>
    </div>
  );
}

function GoogleMapsPin({ color = GOLD, size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 24 32" fill="none">
      <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 23 9 23s9-16.25 9-23c0-4.97-4.03-9-9-9z" fill={color}
        style={{ filter: `drop-shadow(0 3px 8px ${color}80)` }} />
      <circle cx="12" cy="9" r="3.5" fill="white" />
    </svg>
  );
}

function ReviewCardsVisual() {
  return (
    <div className="w-full lg:w-1/2 flex justify-center relative py-8">

      {/* ── ambient glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}22 0%, transparent 65%)`, filter: "blur(40px)" }} />

      {/* ── floating Google Maps pins ── */}
      <div className="absolute top-[8%] right-[14%] animate-float-d1 z-20 pointer-events-none">
        <GoogleMapsPin color={GOLD} size={32} />
      </div>
      <div className="absolute top-[28%] right-[5%] animate-float-d2 z-20 pointer-events-none">
        <GoogleMapsPin color="#4285F4" size={24} />
      </div>
      <div className="absolute bottom-[22%] right-[10%] animate-float-d3 z-20 pointer-events-none">
        <GoogleMapsPin color="#34A853" size={20} />
      </div>

      {/* ── floating rating badge ── */}
      <div className="absolute top-[4%] left-[6%] z-20 pointer-events-none animate-float-d2
        bg-white rounded-2xl px-3 py-2 shadow-xl"
        style={{ border: `1.5px solid ${GOLD}40` }}>
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none">Google Maps</p>
        <p className="text-xl font-black leading-tight" style={{ color: GOLD }}>#1</p>
      </div>

      {/* ── "New review!" notification badge ── */}
      <div className="absolute bottom-[8%] left-[4%] z-20 pointer-events-none animate-float
        bg-white rounded-2xl px-3 py-2.5 shadow-xl flex items-center gap-2"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
        <div>
          <p className="text-[10px] font-black text-gray-800 leading-none">New 5-star review!</p>
          <p className="text-[8px] text-gray-400 mt-0.5">just now · Google Maps</p>
        </div>
      </div>

      {/* ── Google G logo badge ── */}
      <div className="absolute top-[38%] left-[2%] z-20 pointer-events-none animate-float-d3">
        <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-base font-black"
          style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <span className="text-[18px] font-black tracking-tight">
            <span style={{ color: "#4285F4" }}>G</span>
          </span>
        </div>
      </div>

      {/* ── iPhone frame ── */}
      <div className="relative w-[270px] h-[560px] rounded-[3rem] z-10 animate-float shadow-2xl"
        style={{
          background: "linear-gradient(150deg, #2e2e2e 0%, #0f0f0f 100%)",
          border: "10px solid #141414",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}>

        {/* Left edge highlight */}
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 45%)" }} />

        {/* Dynamic Island */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 12, width: 84, height: 24, background: "#000", borderRadius: 12, zIndex: 10 }} />

        {/* Screen */}
        <div className="absolute rounded-[2.25rem] overflow-hidden flex flex-col"
          style={{ inset: 8, background: "#fff" }}>

          {/* Google Maps top bar */}
          <div className="shrink-0 px-3 pt-8 pb-3" style={{ background: "#4285F4" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[7px] font-bold text-white/70 tracking-widest uppercase">Google Maps</p>
                <p className="text-[12px] font-black text-white leading-tight mt-0.5">Your Business</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-px">
                  {[0,1,2,3,4].map(i => <span key={i} style={{ color: "#FBBC04", fontSize: 8 }}>★</span>)}
                </div>
                <p className="text-[8px] font-semibold text-white/80 mt-0.5">5.0 · 247 reviews</p>
              </div>
            </div>
          </div>

          {/* Review count bar */}
          <div className="shrink-0 px-3 py-2 border-b border-gray-100" style={{ background: "#f8f9fa" }}>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full rounded-full" style={{ width: "94%", background: `linear-gradient(90deg, ${GOLD}, #f5e3a0)` }} />
              </div>
              <span className="text-[8px] font-bold" style={{ color: GOLD }}>↑ Growing</span>
            </div>
          </div>

          {/* Continuous scrolling reviews */}
          <div className="flex-1 overflow-hidden" style={{ background: "#f8f9fa" }}>
            <div className="px-2.5 pt-2 scroll-reviews-home">
              {SCROLL_REVIEWS.map(({ initials, bg, name, text }, idx) => (
                <ReviewCard key={idx} initials={initials} bg={bg} name={name} text={text} />
              ))}
            </div>
          </div>

          {/* Home indicator */}
          <div className="shrink-0 flex justify-center py-2" style={{ background: "#fff" }}>
            <div className="w-14 h-[3px] rounded-full" style={{ background: "#d0d0d0" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* SyncDashboardVisual removed — merged into BentoGrid Card 2 */

/* ─────────────────────────────────────────────────────
   Feature 3 visual: Ads growth chart
───────────────────────────────────────────────────── */
function AdsChartVisual() {
  const bars = [
    { month: "Jan", h: 22 },
    { month: "Feb", h: 36 },
    { month: "Mar", h: 50 },
    { month: "Apr", h: 65 },
    { month: "May", h: 82 },
    { month: "Jun", h: 100 },
  ];
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ad ROI — 6 month trend</p>
          <p className="text-4xl font-black text-gray-900">+247%</p>
        </div>
        <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">▲ AI Optimized</div>
      </div>
      <div className="flex items-end gap-2 h-28 mb-4">
        {bars.map((b, i) => (
          <div key={b.month} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-lg animate-bar-grow"
              style={{ height: `${b.h}%`, backgroundColor: i === bars.length - 1 ? GOLD : `${GOLD}50`, animationDelay: `${i * 0.12}s` }}
            />
            <span className="text-[10px] font-bold text-gray-400">{b.month}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
        {[
          { label: "CPC Reduction", val: "−62%" },
          { label: "Conversion ▲",  val: "+89%" },
          { label: "Audience Match", val: "96%"  },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-base font-black text-gray-900">{s.val}</p>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function HomeClient() {
  return (
    <div className="w-full bg-white text-gray-900 selection:bg-amber-100">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes floatD1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes floatD2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatD3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        @keyframes scrollReviewsHome {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes shimmerRight {
          0%   { transform: translateX(-100%); background: linear-gradient(90deg, transparent, #D4AF37, transparent); }
          100% { transform: translateX(200%); background: linear-gradient(90deg, transparent, #D4AF37, transparent); }
        }
        @keyframes barGrow { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
        @keyframes ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes march { to { stroke-dashoffset: -20; } }
        @keyframes pingGlow { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.15); opacity: 0.4; } }

        .animate-float    { animation: float    6s ease-in-out infinite; }
        .animate-float-d1 { animation: floatD1  5s ease-in-out infinite 0.6s; }
        .animate-float-d2 { animation: floatD2  7s ease-in-out infinite 1.2s; }
        .animate-float-d3 { animation: floatD3  5.5s ease-in-out infinite 0.3s; }
        .animate-glow     { animation: pingGlow 3s ease-in-out infinite; }
        .animate-ring-1   { animation: ring 2.5s ease-out infinite; }
        .animate-ring-2   { animation: ring 2.5s ease-out infinite 1.25s; }
        .animate-march    { stroke-dashoffset: 0; animation: march 2s linear infinite; }
        .animate-shimmer-right { width: 60%; height: 100%; background: linear-gradient(90deg, transparent, #D4AF3770, transparent); animation: shimmerRight 1.6s ease-in-out infinite; }
        .animate-bar-grow { animation: barGrow 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .scroll-reviews-home { animation: scrollReviewsHome 22s linear infinite; }
      `}} />

      {/* ── STICKY HEADER ─────────────────────────────── */}
      <div className="px-6 md:px-10 bg-white/90 sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md">
        <Header showNav brand="gam" theme="light" />
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1 · HERO
      ══════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-white">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#B8961C] text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                Dubai&apos;s #1 AI Marketing Infrastructure
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                The Ultimate AI <br/>
                <span className="text-[#D4AF37]">Marketing Infrastructure.</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                mirAIreach is Dubai&apos;s most advanced Generative Engine Optimization (GEO) platform. Sync your business across 100+ global networks, automate reviews, and dominate AI search results.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#B8961C] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-[#D4AF37]/30 flex items-center justify-center gap-2">
                  BOOK A CONSULTATION <span className="text-xl">→</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 font-bold rounded-full transition-all shadow-sm">
                  See the Platform
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000" 
                  alt="Dubai Modern Cafe Lifestyle" 
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Glassmorphism Floating Dashboard */}
                <div className="absolute bottom-6 left-6 right-6 animate-float">
                  <div className="bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">mirAIreach Sync Active</h3>
                        <p className="text-sm text-gray-600 font-medium">AI generating reviews &amp; syncing data...</p>
                      </div>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 border border-gray-100">
                        <span className="text-blue-500">G</span> Google: Synced
                      </span>
                      <span className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 border border-gray-100">
                        <span className="text-pink-500">IG</span> AI-Powered Instagram Post
                      </span>
                      <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
                        + 98 Networks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────── */}
      <div className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 text-center">
          {[
            { stat: "100+",     label: "Platforms Synced"   },
            { stat: "500+",     label: "Dubai Brands"       },
            { stat: "1M+",      label: "Reviews Managed"    },
            { stat: "AI-Native",label: "Infrastructure"     },
          ].map((s) => (
            <div key={s.stat} className="px-4 py-2 flex flex-col items-center justify-center">
              <p className="text-xl font-black text-gray-900">{s.stat}</p>
              <div className="w-6 h-0.5 mt-1.5 mb-2" style={{ backgroundColor: GOLD }}></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 2 · BENTO GRID
      ══════════════════════════════════════════════ */}
      <div id="bento">
        <BentoGrid />
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 3 · FEATURES (zig-zag)
      ══════════════════════════════════════════════ */}
      <section id="features">

        {/* ── Feature 1: mirAIreach / Google Reviews ── */}
        <div className="py-16 md:py-24 bg-gray-50 border-t border-gray-100 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">
              {/* Product wordmark */}
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">mirAIreach</span>
                </div>
                {/* #1 rank badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest"
                  style={{ backgroundColor: `${GOLD}15`, color: GOLD, border: `1.5px solid ${GOLD}50` }}
                >
                  <MapPin size={11} strokeWidth={3} />
                  #1 Google Maps Rank
                </div>
              </div>

              <Chip gold>Entry Package · High Volume</Chip>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
                Automated<br />
                <span style={{ color: GOLD }}>Google Reviews.</span>
              </h2>

              {/* Price block */}
              <div className="rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: GOLD, backgroundColor: `${GOLD}06` }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-5xl font-black text-gray-900">500</span>
                  <span className="text-2xl font-black text-gray-700">AED</span>
                  <span className="text-lg font-bold text-gray-400">/ month</span>
                </div>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                  No hidden fees · Full automation · Less than the cost of a daily coffee
                </p>
              </div>

              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Turn satisfied customers into 5-star Google reviews automatically. Smart QR
                codes and intelligent feedback routing capture the good and shield you from
                the bad — zero manual effort required.
              </p>

              <ul className="space-y-3">
                {[
                  "Negative feedback routed privately — never goes public",
                  "One-tap Google review redirects via QR code",
                  "Works for restaurants, cafés, retail & hospitality",
                  "Private internal feedback CRM included",
                ].map((t) => <Check key={t} text={t} />)}
              </ul>

              {/* Social Proof Badge */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"><Star size={12} className="text-gray-400"/></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"><Globe size={12} className="text-gray-500"/></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center"><CheckCircle size={12} className="text-gray-600"/></div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trusted by Dubai&apos;s Top</p>
                    <p className="text-xs font-bold text-gray-800">F&amp;B Groups &amp; Retailers</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <GoldButton href="/contact">
                  Get Started — 500 AED/mo <ArrowRight size={13} />
                </GoldButton>
                <Link
                  href="/localreach"
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Explore Full Features <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <ReviewCardsVisual />
          </div>
        </div>

        {/* ── Feature 2: AI Google Ads ─────────────────── */}
        <div className="py-16 md:py-24 bg-gray-50 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">
              <Chip>Paid Acquisition</Chip>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                <Target size={22} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
                AI-Managed<br />
                <span style={{ color: GOLD }}>Google Ads.</span>
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Traditional agencies guess. Our AI optimizes every dirham of your ad spend
                in real time — targeting the right audience at the right moment with the
                right message. ROI that manual campaign managers simply can&apos;t match.
              </p>
              <ul className="space-y-3">
                {[
                  "AI bid optimization & precision audience targeting",
                  "Real-time performance monitoring & auto-adjustments",
                  "Conversion-focused ad creative generation",
                  "Fully transparent ROI reporting dashboard",
                ].map((t) => <Check key={t} text={t} />)}
              </ul>
              <GoldButton href="/contact">
                Maximize My Ad Spend <ArrowRight size={13} />
              </GoldButton>
            </div>

            <AdsChartVisual />
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 · FREE AUDIT HOOK
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">

          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm"
            style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
            <Gift size={28} />
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-gray-400 mb-4">
            Zero Risk · Zero Commitment
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            See Your Business Through<br />
            <span style={{ color: GOLD }}>the Eyes of AI.</span>
          </h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            We&apos;ll audit your digital presence and deliver a Free AI-Ready Audit &amp; Strategy
            Blueprint — showing exactly where AI search engines can&apos;t find you.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-12 text-left max-w-3xl mx-auto">
            {[
              {
                icon: <CheckCircle size={18} />,
                title: "Free AI Audit",
                desc: "Full analysis of your AI search visibility, Google presence, and listing health.",
              },
              {
                icon: <CheckCircle size={18} />,
                title: "Strategy Blueprint",
                desc: "Custom roadmap showing your top 3 growth opportunities, clearly prioritized.",
              },
              {
                icon: <CheckCircle size={18} />,
                title: "No Obligation",
                desc: "Take the insights and decide freely. No pressure, no contracts, no catch.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
                <span style={{ color: GOLD }}>{c.icon}</span>
                <p className="font-black text-gray-900 text-sm">{c.title}</p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <GoldButton href="/contact" large>
            Book a Free Consultation <ArrowRight size={15} />
          </GoldButton>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 · CORPORATE PROFILE
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">Corporate Profile</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">GAM Solutions LLC FZ</h2>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              A Dubai-based AI marketing and digital infrastructure agency bridging AI
              innovation with practical business execution — building measurable, lasting
              digital presences that drive real-world growth.
            </p>
            <div className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <MapPin size={20} style={{ color: GOLD }} className="shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                Meydan Grandstand, 6th Floor — Al Meydan Rd<br />
                Nad Al Sheba, Dubai, U.A.E.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
            <div className="relative space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-900">Mission</h3>
              <p className="text-lg font-medium leading-relaxed text-gray-600 italic">
                &quot;Democratizing enterprise-grade AI for brick-and-mortar businesses —
                turning a sophisticated digital presence into measurable offline success.&quot;
              </p>
              <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start gap-4">
                <GoldButton href="/contact">
                  Book a Consultation <ArrowRight size={13} />
                </GoldButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors py-3"
                >
                  Contact Us <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

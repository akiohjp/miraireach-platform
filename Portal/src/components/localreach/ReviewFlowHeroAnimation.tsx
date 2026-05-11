"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, MapPin, Copy, Globe, ExternalLink } from "lucide-react";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8961C";
const NAVY = "#0F172A";
const STAR_FILL = "#FBBF24";
const PAGE_BG = "#F8FAFC";
const STEP_COUNT = 5;
const INTERVAL_MS = 4200;

const STEP_LABELS = ["Scan QR", "Rate", "Keywords", "Review", "Posted"] as const;

function FakeQrBlock({ className }: { className?: string }) {
  const pattern = useMemo(() => {
    const cells: boolean[] = [];
    for (let i = 0; i < 64; i++) {
      cells.push((i * 17 + (i % 7) * 3) % 5 !== 0);
    }
    return cells;
  }, []);

  return (
    <div
      className={`grid grid-cols-8 gap-0.5 rounded-lg bg-white p-2 shadow-inner ${className ?? ""}`}
      style={{ border: `2px solid ${GOLD}35` }}
    >
      {pattern.map((on, i) => (
        <div key={i} className={`aspect-square rounded-[1px] ${on ? "bg-gray-900" : "bg-white"}`} />
      ))}
    </div>
  );
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto rounded-[1.75rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl"
      style={{ width: "min(46vw, 220px)", aspectRatio: "9 / 18" }}
    >
      <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-800" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.05rem] bg-white">{children}</div>
    </div>
  );
}

function DemoChromeFooter() {
  return (
    <p className="shrink-0 pb-1.5 pt-0.5 text-center text-[5px] font-bold uppercase tracking-[0.2em] text-gray-400">
      Powered by LocalReach
    </p>
  );
}

function DemoTopBar({ right }: { right: string }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-1 px-2 pt-2">
      <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-gray-400">LocalReach</span>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-gray-400">Review Platform</span>
        <span className="text-[7px] font-black text-gray-900">{right}</span>
      </div>
    </div>
  );
}

function ProgressSegs({ filled }: { filled: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i < filled ? "bg-[#0F172A]" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function ScanPhase() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-8 md:flex-row md:gap-14 md:py-12">
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: GOLD_DARK }}>
          Table touchpoint
        </p>
        <div className="rounded-2xl bg-white px-6 py-5 shadow-xl" style={{ border: `1px solid rgba(212,175,55,0.25)` }}>
          <p className="text-center text-xs font-black text-gray-800">Tap to leave a review</p>
          <FakeQrBlock className="mt-3 w-[112px] md:w-[128px]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <PhoneShell>
          <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 p-3">
            <FakeQrBlock className="w-24" />
            <motion.div
              className="pointer-events-none absolute inset-x-2 top-10 h-[2px] rounded-full opacity-90"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD}, transparent)`,
                boxShadow: `0 0 12px ${GOLD}`,
              }}
              animate={{ top: ["18%", "62%", "18%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="absolute bottom-3 text-[9px] font-bold text-gray-500">Camera · scanning</p>
          </div>
        </PhoneShell>
      </motion.div>
    </div>
  );
}

/** Step 2 in real demo: rating card (SHARE YOUR EXPERIENCE … Continue) */
function RatingDemoPhase() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-8 md:py-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
        <PhoneShell>
          <div className="flex h-full flex-col" style={{ backgroundColor: PAGE_BG }}>
            <DemoTopBar right="1 / 3" />
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-md">
                <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-gray-400">Share your experience</p>
                <p className="mt-1 text-[11px] font-black leading-tight" style={{ color: NAVY }}>
                  Dubai Marina Sushi
                </p>
                <div className="my-2 h-px bg-gray-100" />
                <div className="flex gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: NAVY }}
                  >
                    <span className="text-[10px] text-white">☆</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black" style={{ color: NAVY }}>
                      Dubai Marina Sushi
                    </p>
                    <p className="mt-0.5 text-[7px] font-medium leading-snug text-gray-500">
                      Thank you for dining with us! Your feedback means the world to us.
                    </p>
                  </div>
                </div>
                <p className="mb-1.5 mt-3 text-[6px] font-bold uppercase tracking-[0.2em] text-gray-400">Rate your experience</p>
                <div className="flex justify-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="inline-flex rounded px-0.5 text-[18px] leading-none"
                      style={{ color: STAR_FILL }}
                      initial={{ opacity: 0.25, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        boxShadow:
                          i === 4
                            ? [
                                "0 0 0 0px transparent",
                                `0 0 0 2px ${NAVY}`,
                                `0 0 0 2px ${NAVY}`,
                              ]
                            : "0 0 0 0px transparent",
                      }}
                      transition={{
                        opacity: { delay: 0.25 + i * 0.12, duration: 0.2 },
                        scale: { delay: 0.25 + i * 0.12, type: "spring", stiffness: 420, damping: 14 },
                        boxShadow: { delay: 0.82, duration: 0.35, times: [0, 0.45, 1] },
                      }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  className="mt-1 text-center text-[9px] font-black"
                  style={{ color: STAR_FILL }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.3 }}
                >
                  Excellent
                </motion.p>
                <motion.button
                  type="button"
                  className="mt-3 w-full rounded-lg py-2 text-[8px] font-black text-white"
                  style={{ backgroundColor: NAVY }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
                  transition={{
                    opacity: { delay: 1.1, duration: 0.25 },
                    y: { delay: 1.1, duration: 0.25 },
                    scale: { delay: 1.35, duration: 0.6, times: [0, 0.5, 1] },
                  }}
                >
                  Continue
                </motion.button>
              </div>
            </div>
            <DemoChromeFooter />
          </div>
        </PhoneShell>
      </motion.div>
    </div>
  );
}

/** Interleaved like the real flow: plain chips + selected (animated) */
const KEYWORD_LAYOUT: { label: string; selected: boolean; selIndex: number }[] = [
  { label: "Omakase", selected: false, selIndex: -1 },
  { label: "Fresh Seafood", selected: true, selIndex: 0 },
  { label: "Chef's Table", selected: false, selIndex: -1 },
  { label: "Friendly Staff", selected: true, selIndex: 1 },
  { label: "Dubai Marina", selected: false, selIndex: -1 },
  { label: "Cozy Atmosphere", selected: true, selIndex: 2 },
  { label: "Date Night", selected: false, selIndex: -1 },
  { label: "Hidden Gem", selected: true, selIndex: 3 },
  { label: "Fast Service", selected: false, selIndex: -1 },
  { label: "Authentic Japanese", selected: true, selIndex: 4 },
];

/** Step 2 — Keywords (tag cloud + Generate Review) */
function KeywordsDemoPhase() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-8 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <PhoneShell>
          <div className="flex h-full flex-col" style={{ backgroundColor: PAGE_BG }}>
            <DemoTopBar right="2 / 3" />
            <div className="px-2 pb-1">
              <p className="text-[8px] font-black text-gray-900">Dubai Marina Sushi</p>
              <div className="mt-1.5">
                <ProgressSegs filled={2} />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
              <div className="rounded-xl border border-gray-200/80 bg-white p-2.5 shadow-md">
                <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-gray-400">Step 2 — Keywords</p>
                <p className="mt-1 text-[10px] font-black text-gray-900">What stood out?</p>
                <p className="mt-0.5 text-[7px] font-medium leading-snug text-gray-500">
                  Select all that apply. We&apos;ll craft your review automatically.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {KEYWORD_LAYOUT.map(({ label, selected, selIndex }) =>
                    selected ? (
                      <motion.span
                        key={label}
                        className="inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[6.5px] font-bold"
                        style={{ backgroundColor: NAVY, borderColor: NAVY, color: "white" }}
                        initial={{ opacity: 0.35, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + selIndex * 0.22, type: "spring", stiffness: 380, damping: 20 }}
                      >
                        <span style={{ color: STAR_FILL }}>✓</span>
                        {label}
                      </motion.span>
                    ) : (
                      <span
                        key={label}
                        className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[6.5px] font-semibold text-gray-800"
                      >
                        {label}
                      </span>
                    ),
                  )}
                </div>
                <motion.p
                  className="mt-2 border-t border-gray-100 pt-2 text-center text-[6px] font-semibold text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.45, duration: 0.25 }}
                >
                  5 selected
                </motion.p>
                <motion.button
                  type="button"
                  className="mt-2 w-full rounded-lg py-2 text-[8px] font-black text-white"
                  style={{ backgroundColor: NAVY }}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                  transition={{ opacity: { delay: 1.55, duration: 0.2 }, scale: { delay: 1.75, duration: 0.5 } }}
                >
                  Generate Review
                </motion.button>
              </div>
            </div>
            <DemoChromeFooter />
          </div>
        </PhoneShell>
      </motion.div>
    </div>
  );
}

const SAMPLE_REVIEW =
  "Hidden gem in Dubai Marina — authentic Japanese with friendly staff and a cozy atmosphere. The omakase was outstanding.";

/** Step 4 — Ready to post (draft + Post on Google) */
function ReadyToPostDemoPhase() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-8 md:py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <PhoneShell>
          <div className="flex h-full flex-col" style={{ backgroundColor: PAGE_BG }}>
            <DemoTopBar right="3 / 3" />
            <div className="px-2 pb-1">
              <p className="text-[8px] font-black text-gray-900">Dubai Marina Sushi</p>
              <div className="mt-1.5">
                <ProgressSegs filled={3} />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
              <div className="rounded-xl border border-gray-200/80 bg-white p-2.5 shadow-md">
                <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-gray-400">Step 4 — Your review</p>
                <p className="mt-1 text-[10px] font-black text-gray-900">Ready to post</p>
                <p className="text-[7px] font-medium text-gray-500">Edit freely before submitting.</p>
                <motion.div
                  className="mt-2 max-h-[68px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <motion.p
                    className="text-[6.5px] font-medium leading-relaxed text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                  >
                    {SAMPLE_REVIEW}
                    <motion.span
                      className="ml-0.5 inline-block h-2.5 w-px translate-y-0.5 bg-gray-400"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  </motion.p>
                  <p className="mt-1 text-right text-[5.5px] font-semibold text-gray-400">603</p>
                </motion.div>

                <div className="mt-2 grid grid-cols-2 gap-1">
                  <motion.span
                    className="flex items-center justify-center gap-0.5 rounded-md border border-gray-200 bg-white py-1.5 text-[6px] font-bold text-gray-600"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                  >
                    <Copy className="h-2.5 w-2.5" strokeWidth={2.2} />
                    Copy
                  </motion.span>
                  <motion.span
                    className="flex items-center justify-center gap-0.5 rounded-md border border-gray-200 bg-white py-1.5 text-[6px] font-bold text-gray-600"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95 }}
                  >
                    <Globe className="h-2.5 w-2.5" strokeWidth={2.2} />
                    Translate
                  </motion.span>
                </div>

                <motion.button
                  type="button"
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-[8px] font-black text-white"
                  style={{ backgroundColor: NAVY }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, boxShadow: ["0 0 0 0 rgba(15,23,42,0)", "0 0 0 3px rgba(15,23,42,0.25)", "0 0 0 0 rgba(15,23,42,0)"] }}
                  transition={{
                    opacity: { delay: 1.05, duration: 0.25 },
                    y: { delay: 1.05, duration: 0.25 },
                    boxShadow: { delay: 1.2, duration: 2, repeat: Infinity, repeatDelay: 0.5 },
                  }}
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                  Post on Google
                </motion.button>
              </div>
            </div>
            <DemoChromeFooter />
          </div>
        </PhoneShell>
      </motion.div>
    </div>
  );
}

/** Posted live + owner ping (completion) */
function PostedPhase() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
        <PhoneShell>
          <div className="relative flex h-full flex-col items-center bg-white p-4 pt-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
            >
              <CheckCircle2 className="h-14 w-14 text-green-500" strokeWidth={2.2} />
            </motion.div>
            <p className="mt-3 text-center text-xs font-black text-gray-900">Live on Google Maps</p>
            <div className="mt-3 flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-[9px] font-bold text-gray-600">New 5-star review</span>
            </div>
            <div className="mt-4 w-full rounded-xl border border-gray-100 bg-gray-50/80 p-3 text-left">
              <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">Owner alert</p>
              <p className="mt-1 text-[10px] font-bold text-gray-800">Owner notified instantly ✉</p>
            </div>
            <motion.div
              className="absolute right-3 top-14 flex items-center gap-1 rounded-lg px-2 py-1 text-[8px] font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
            >
              <span className="text-[10px]">★★★★★</span> Posted
            </motion.div>
          </div>
        </PhoneShell>
      </motion.div>
    </div>
  );
}

export default function ReviewFlowHeroAnimation() {
  const prefersReducedMotion = useReducedMotion() === true;
  const [step, setStep] = useState(0);

  const lastStepIndex = STEP_COUNT - 1;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEP_COUNT);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  const active = prefersReducedMotion ? lastStepIndex : step;

  return (
    <div
      className="relative min-h-[280px] w-full overflow-hidden md:min-h-[420px]"
      role="region"
      aria-label="Animated preview: QR scan through posting a Google review"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 20%, ${GOLD}18 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 50%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {active === 0 && (
          <motion.div key="s0" className="relative z-[1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ScanPhase />
          </motion.div>
        )}
        {active === 1 && (
          <motion.div key="s1" className="relative z-[1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <RatingDemoPhase />
          </motion.div>
        )}
        {active === 2 && (
          <motion.div key="s2" className="relative z-[1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <KeywordsDemoPhase />
          </motion.div>
        )}
        {active === 3 && (
          <motion.div key="s3" className="relative z-[1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ReadyToPostDemoPhase />
          </motion.div>
        )}
        {active === 4 && (
          <motion.div key="s4" className="relative z-[1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <PostedPhase />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 z-[2] flex flex-wrap justify-center gap-x-1.5 gap-y-1 px-2 md:bottom-5">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              className="h-2 rounded-full transition-[width] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: i === active ? 24 : 7,
                backgroundColor: i === active ? GOLD : "rgba(0,0,0,0.12)",
                outlineColor: GOLD,
              }}
              aria-label={`Step ${i + 1}: ${label}`}
              aria-current={i === active ? "step" : undefined}
              onClick={() => setStep(i)}
            />
            <span className={`hidden text-[7px] font-bold uppercase tracking-wider lg:block ${i === active ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>

      <p className="sr-only">
        Step {active + 1} of {STEP_COUNT}: {STEP_LABELS[active]}
      </p>
    </div>
  );
}

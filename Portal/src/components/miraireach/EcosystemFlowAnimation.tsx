"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, FolderTree, MapPin, Sparkles, Star } from "lucide-react";

/** lucide-react 旧版に Instagram が無いため簡易アイコン */
function InstagramGlyph({
  className,
  strokeWidth = 1.75,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GlobeGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    </svg>
  );
}

const GOLD = "#D4AF37";
const INK = "#1a1714";

function ConnectorAcross({ active }: { active: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center py-0.5 text-[#D4AF37]/80 sm:py-0 sm:px-1 md:px-2"
      aria-hidden
    >
      <motion.div
        animate={active ? { opacity: [0.45, 1, 0.45] } : { opacity: 0.5 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        <ArrowDown className="h-5 w-5 sm:hidden" strokeWidth={2.25} />
        <ArrowRight className="hidden h-5 w-5 sm:block md:h-6 md:w-6" strokeWidth={2.25} />
      </motion.div>
    </div>
  );
}

function ConnectorDown({ active }: { active: boolean }) {
  return (
    <div className="flex justify-center py-2 text-[#D4AF37]/80 md:py-2.5" aria-hidden>
      <motion.div
        animate={active ? { opacity: [0.45, 1, 0.45] } : { opacity: 0.5 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        className="flex items-center justify-center"
      >
        <ArrowDown className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.25} />
      </motion.div>
    </div>
  );
}

/**
 * メイン SNS（Instagram）→ mirAIreach（サイテーション）→ Google 統合
 * → サインアップ後のグローバル引用網・オープンウェブまでを一直線で可視化。
 * カードは重ねず、常に全文が読めるレイアウト。
 */
export default function EcosystemFlowAnimation({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const showMotion = active && !reduce;

  return (
    <div
      className="relative mx-auto w-full max-w-5xl select-none px-1"
      role="img"
      aria-label="Two-row flow: Instagram, mirAIreach, and Google in the top row; below, global reach across about one hundred platforms including AI search, maps, and directories, feeding Google Search and AI Overviews."
    >
      <div className="flex flex-col items-stretch">
        {/* Row 1: steps 1 → 2 → 3 (vertical on xs, horizontal from sm) */}
        <div className="flex flex-col items-stretch sm:flex-row sm:items-stretch sm:justify-center sm:gap-2 md:gap-3 lg:gap-4">
          {/* 1 · Instagram */}
          <motion.div
            className="w-full min-w-0 sm:max-w-[240px] sm:flex-1 md:max-w-[260px] lg:max-w-[280px]"
            initial={false}
            animate={showMotion ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="h-full rounded-2xl border-2 px-4 py-4 shadow-lg md:px-5 md:py-5"
              style={{
                borderColor: `${GOLD}55`,
                background: "linear-gradient(165deg, rgba(225,48,108,0.1) 0%, rgba(255,255,255,0.97) 55%)",
                boxShadow: "0 14px 36px -18px rgba(225,48,108,0.22)",
              }}
            >
              <p
                className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700 md:text-[11px]"
                style={{ color: "#9a7b18" }}
              >
                1 · Input · Main social
              </p>
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl md:h-[52px] md:w-[52px]"
                  style={{
                    background: "linear-gradient(145deg, #f58529, #dd2a7b, #8134af)",
                  }}
                >
                  <InstagramGlyph className="h-7 w-7 text-white md:h-8 md:w-8" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] font-bold tracking-wide text-gray-900 md:text-[15px]">Instagram</span>
                <span className="text-[11px] font-medium leading-normal text-gray-700 md:text-[12px]">
                  Posts &amp; stories become structured signals.
                </span>
              </div>
            </div>
          </motion.div>

          <ConnectorAcross active={active} />

          {/* 2 · mirAIreach hub */}
          <motion.div
            className="w-full min-w-0 sm:max-w-[280px] sm:flex-1 md:max-w-[300px] lg:max-w-[320px]"
            initial={false}
            animate={showMotion ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="h-full rounded-2xl border-2 px-5 py-5 shadow-xl md:px-6 md:py-6"
              style={{
                borderColor: GOLD,
                background: "linear-gradient(180deg, #fffef9 0%, #faf6ea 100%)",
                boxShadow: `0 22px 50px -22px rgba(212,175,55,0.42), inset 0 1px 0 rgba(255,255,255,0.9)`,
              }}
            >
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-600 md:text-[11px]">
                2 · Citation spine
              </p>
              <p className="font-serif text-2xl font-semibold tracking-tight md:text-3xl" style={{ color: INK }}>
                mir<span style={{ color: GOLD }}>AI</span>reach
              </p>
              <p className="mt-2.5 text-[11px] font-medium leading-relaxed text-gray-700 md:text-[13px]">
                Unifies Instagram content with GBP-ready data: hours, services, and review responses — one spine, no
                copy-paste drift.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                <span className="rounded-full bg-[#1a1714] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white md:text-[10px]">
                  Auto sign-up
                </span>
                <span className="rounded-full border-2 border-[#D4AF37]/55 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-800 md:text-[10px]">
                  Directory sync
                </span>
              </div>
            </div>
          </motion.div>

          <ConnectorAcross active={active} />

          {/* 3 · Google */}
          <div className="w-full min-w-0 sm:max-w-[240px] sm:flex-1 md:max-w-[260px] lg:max-w-[280px]">
            <div className="h-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 shadow-md md:px-5 md:py-5">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a73e8] md:text-[11px]">
                3 · Google layer
              </p>
              <div className="flex items-start gap-2.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[15px] font-black text-white md:h-11 md:w-11"
                  style={{ backgroundColor: "#4285F4" }}
                >
                  G
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-snug text-gray-900 md:text-[15px]">Google</p>
                  <p className="mt-1 text-[11px] font-medium leading-normal text-gray-700 md:text-[12px]">
                    Business Profile, Maps &amp; Search stay aligned as you post.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current md:h-[18px] md:w-[18px]" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-[11px] font-semibold leading-snug text-gray-700 md:text-[12px]">
                  Reviews flow back cleanly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ConnectorDown active={active} />

        {/* Row 2: step 4 — full width */}
        <div className="w-full">
          <div
            className="rounded-2xl border-2 px-4 py-4 shadow-md md:px-6 md:py-6"
            style={{
              borderColor: `${GOLD}50`,
              background: "linear-gradient(160deg, rgba(212,175,55,0.1) 0%, #ffffff 72%)",
            }}
          >
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] md:text-[11px]" style={{ color: "#9a7b18" }}>
              4 · Global reach
            </p>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-4">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#1a1714] md:h-12 md:w-12"
                    style={{ background: `${GOLD}18` }}
                  >
                    <GlobeGlyph className="h-6 w-6 md:h-[26px] md:w-[26px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-base font-bold leading-snug tracking-tight text-gray-900 md:text-lg">
                      ~100 platforms worldwide
                    </p>
                    <p className="mt-1 text-[11px] font-medium leading-normal text-gray-700 md:text-[12px]">
                      Automated sign-up and citation sync publish one spine to a global network — not only a single
                      provider.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:pl-2">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-600 md:text-[11px]">
                  Surfaces wired in
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 [&>svg]:h-4 [&>svg]:w-4">
                      <Sparkles aria-hidden strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-900 md:text-[12px]">AI search &amp; answer engines</p>
                      <p className="text-[10px] font-medium leading-normal text-gray-700 md:text-[11px]">
                        Next-gen discovery layers that synthesize businesses from trusted, structured feeds.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 [&>svg]:h-4 [&>svg]:w-4">
                      <MapPin aria-hidden strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-900 md:text-[12px]">Maps &amp; geo</p>
                      <p className="text-[10px] font-medium leading-normal text-gray-700 md:text-[11px]">
                        Consistent location and category signals across mapping surfaces.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-900 [&>svg]:h-4 [&>svg]:w-4">
                      <FolderTree aria-hidden strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-900 md:text-[12px]">Local &amp; industry directories</p>
                      <p className="text-[10px] font-medium leading-normal text-gray-700 md:text-[11px]">
                        Consumer directories, vertical registries, and citation hubs local businesses depend on.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                className="mt-2 rounded-xl border-2 px-3 py-2.5 lg:col-span-2"
                style={{
                  borderColor: `${GOLD}45`,
                  background: "linear-gradient(135deg, rgba(26,23,20,0.05) 0%, rgba(212,175,55,0.08) 100%)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-700 md:text-[11px]">
                  Google Search &amp; AI Overviews
                </p>
                <p className="mt-1.5 text-[10px] font-medium leading-normal text-gray-800 md:text-[11px]">
                  The same enriched citations feed <strong className="font-semibold">classic Google Search</strong> and{" "}
                  <strong className="font-semibold">AI-generated summaries</strong>. Investing here lifts both traditional
                  rankings and the answers users see above the fold.
                </p>
              </div>

              <p className="mt-3 border-t border-gray-200 pt-3 text-[10px] font-medium leading-normal text-gray-700 md:text-[11px] lg:col-span-2">
                <span className="font-bold text-gray-900">AI-ready data:</span> systems reward brands they can verify the
                same way everywhere — making you easier to <strong className="font-semibold text-gray-900">trust</strong>,{" "}
                <strong className="font-semibold text-gray-900">select</strong>, and{" "}
                <strong className="font-semibold text-gray-900">recommend</strong> when models decide who to surface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * iPhone + Google Maps レビュー演出（旧 HomeClient ReviewCardsVisual と同等）。
 * globals.css の .scroll-reviews-home / フロート系アニメを利用。
 */

const GOLD = "#D4AF37";

const ALL_REVIEWS = [
  { initials: "SM", bg: "#EA4335", name: "Sarah M.", text: "Absolutely amazing — best in Dubai! Will tell everyone." },
  { initials: "AK", bg: "#34A853", name: "Ahmed K.", text: "Great service, definitely returning next weekend." },
  { initials: "LW", bg: "#9C27B0", name: "Li Wei", text: "Fantastic food and welcoming staff! 10/10 experience." },
  { initials: "FN", bg: "#4285F4", name: "Fatima N.", text: "Premium quality, impeccable hospitality. Highly recommend." },
  { initials: "RP", bg: "#FF9800", name: "Ravi P.", text: "Best omakase in the Marina. Exceptional every visit." },
  { initials: "CN", bg: "#00BCD4", name: "Carlos N.", text: "Incredible atmosphere and freshest ingredients." },
];
const SCROLL_REVIEWS = [...ALL_REVIEWS, ...ALL_REVIEWS];

function ReviewCard({
  initials,
  bg,
  name,
  text,
}: {
  initials: string;
  bg: string;
  name: string;
  text: string;
}) {
  return (
    <div className="mb-2.5 shrink-0 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
          style={{ background: bg }}
        >
          {initials}
        </div>
        <span className="text-[11px] font-bold text-gray-800">{name}</span>
        <span
          className="ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-bold"
          style={{ background: `${GOLD}20`, color: GOLD }}
        >
          AI ✓
        </span>
      </div>
      <div className="mb-1 text-[10px] text-yellow-400">★★★★★</div>
      <p className="text-[10px] leading-relaxed text-gray-600">{text}</p>
      <p className="mt-1 text-[8px] font-semibold text-blue-500">Google</p>
    </div>
  );
}

function GoogleMapsPin({ color = GOLD, size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 24 32" fill="none" aria-hidden>
      <path
        d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 23 9 23s9-16.25 9-23c0-4.97-4.03-9-9-9z"
        fill={color}
        style={{ filter: `drop-shadow(0 3px 8px ${color}80)` }}
      />
      <circle cx="12" cy="9" r="3.5" fill="white" />
    </svg>
  );
}

export default function LocalReachShowcase() {
  return (
    <div className="relative flex w-full justify-center py-6 md:py-8">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${GOLD}22 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute top-[8%] right-[14%] z-20 animate-float-d1">
        <GoogleMapsPin color={GOLD} size={32} />
      </div>
      <div className="pointer-events-none absolute top-[28%] right-[5%] z-20 animate-float-d2">
        <GoogleMapsPin color="#4285F4" size={24} />
      </div>
      <div className="pointer-events-none absolute bottom-[22%] right-[10%] z-20 animate-float-d3">
        <GoogleMapsPin color="#34A853" size={20} />
      </div>

      <div
        className="pointer-events-none absolute top-[4%] left-[6%] z-20 animate-float-d2 rounded-2xl bg-white px-3 py-2 shadow-xl"
        style={{ border: `1.5px solid ${GOLD}40` }}
      >
        <p className="text-[8px] font-bold leading-none tracking-wider text-gray-400 uppercase">Google Maps</p>
        <p className="text-xl font-black leading-tight" style={{ color: GOLD }}>
          #1
        </p>
      </div>

      <div
        className="pointer-events-none absolute bottom-[8%] left-[4%] z-20 flex animate-float items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-xl"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
        <div>
          <p className="text-[10px] leading-none font-black text-gray-800">New 5-star review!</p>
          <p className="mt-0.5 text-[8px] text-gray-400">just now · Google Maps</p>
        </div>
      </div>

      <div className="pointer-events-none absolute top-[38%] left-[2%] z-20 animate-float-d3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-black shadow-xl"
          style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}
        >
          <span className="text-[18px] font-black tracking-tight" style={{ color: "#4285F4" }}>
            G
          </span>
        </div>
      </div>

      <div
        className="relative z-10 h-[480px] w-[230px] animate-float rounded-[3rem] shadow-2xl sm:h-[520px] sm:w-[250px] md:h-[560px] md:w-[270px]"
        style={{
          background: "linear-gradient(150deg, #2e2e2e 0%, #0f0f0f 100%)",
          border: "10px solid #141414",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
          style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 45%)" }}
        />
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 rounded-[12px] bg-black"
          style={{ top: 12, width: 84, height: 24 }}
        />
        <div className="absolute inset-[8px] flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-[2.25rem] bg-white">
          <div className="shrink-0 px-3 pt-8 pb-3" style={{ background: "#4285F4" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[7px] font-bold tracking-widest text-white/70 uppercase">Google Maps</p>
                <p className="mt-0.5 text-[12px] leading-tight font-black text-white">Your Business</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-px">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} style={{ color: "#FBBC04", fontSize: 8 }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-0.5 text-[8px] font-semibold text-white/80">5.0 · 247 reviews</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-b border-gray-100 px-3 py-2" style={{ background: "#f8f9fa" }}>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full"
                  style={{ width: "94%", background: `linear-gradient(90deg, ${GOLD}, #f5e3a0)` }}
                />
              </div>
              <span className="text-[8px] font-bold" style={{ color: GOLD }}>
                ↑ Growing
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden" style={{ background: "#f8f9fa" }}>
            <div className="scroll-reviews-home px-2.5 pt-2">
              {SCROLL_REVIEWS.map(({ initials, bg, name, text }, idx) => (
                <ReviewCard key={`${initials}-${idx}`} initials={initials} bg={bg} name={name} text={text} />
              ))}
            </div>
          </div>

          <div className="flex shrink-0 justify-center bg-white py-2">
            <div className="h-[3px] w-14 rounded-full" style={{ background: "#d0d0d0" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

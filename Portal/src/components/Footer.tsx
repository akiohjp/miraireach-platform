"use client";

import Link from "next/link";

const DARK = "#1a1714";
const GOLD = "#D4AF37";

const NAV_COLUMNS = [
  {
    heading: "services",
    links: [
      { label: "mirAIreach", href: "/" },
      { label: "LocalReach", href: "/localreach" },
      { label: "Google AI Ads", href: "/#google-ai-ads" },
    ],
  },
  {
    heading: "company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: DARK }} className="w-full">

      {/* ── Main footer body ─────────────────────────────── */}
      <div className="grid min-h-[480px] md:min-h-[520px] md:grid-cols-2">

        {/* Left panel — flagship product + company mark */}
        <div
          className="relative flex min-h-[min(56vh,560px)] flex-col justify-between gap-12 overflow-hidden px-8 py-12 md:min-h-[480px] md:px-12 md:py-14 lg:min-h-[520px]"
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Flagship mirAIreach — dominant block */}
          <Link
            href="/lp/miraireach"
            className="group relative z-10 flex w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-black/20 p-8 shadow-[0_28px_80px_-34px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] transition-[border-color,box-shadow] hover:border-[#D4AF37]/45 hover:shadow-[0_32px_90px_-30px_rgba(212,175,55,0.12)] md:p-10 md:pb-11"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.32em] md:text-[11px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Flagship product
            </span>
            <span className="mt-4 block font-serif text-[clamp(2.25rem,6vw,3.5rem)] font-medium leading-[1.02] tracking-tight">
              <span style={{ color: "rgba(247,245,240,0.96)" }}>mir</span>
              <span style={{ color: GOLD }}>AI</span>
              <span style={{ color: "rgba(247,245,240,0.96)" }}>reach</span>
            </span>
            <span
              className="mt-3 max-w-[20rem] text-sm font-light leading-relaxed md:text-[0.95rem]"
              style={{ color: "rgba(255,255,255,0.42)" }}
            >
              AI marketing platform — reputation, GEO, and discovery in one spine.
            </span>
            <span
              className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: GOLD }}
            >
              Platform overview
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
                ↗
              </span>
            </span>
          </Link>

          {/* Company wordmark — secondary anchor, sized to defer to flagship */}
          <Link
            href="/"
            aria-label="GAM solutions — home"
            className="relative z-[1] mr-0 mt-auto flex flex-col items-end self-end text-right transition-opacity hover:opacity-90 select-none"
          >
            <span
              className="font-serif font-black tracking-tight"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                lineHeight: 0.92,
                color: "rgba(247,245,240,0.96)",
              }}
            >
              GAM
            </span>
            <span
              className="font-serif font-semibold tracking-tight"
              style={{
                fontSize: "clamp(1.35rem, 3.25vw, 2.15rem)",
                lineHeight: 0.92,
                color: GOLD,
              }}
            >
              solutions
            </span>
          </Link>
        </div>

        {/* Right panel — wordmark + sitemap */}
        <div className="px-10 py-10 flex flex-col justify-between">
          {/* Brand wordmark + tagline */}
          <div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="font-serif text-white text-2xl tracking-wide">mirAIreach</span>
              <span
                className="text-[11px] tracking-[0.08em] font-light leading-relaxed"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                The AI that puts your business everywhere.
              </span>
            </div>

            {/* Sitemap columns */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {NAV_COLUMNS.map((col) => (
                <div key={col.heading}>
                  <p
                    className="text-[10px] tracking-[0.22em] uppercase mb-4 font-light"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-[12px] font-light transition-colors"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                        >
                          — {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Book CTA */}
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 text-black text-[11px] tracking-[0.18em] uppercase font-bold px-8 py-4 hover:opacity-85 transition-opacity"
              style={{ backgroundColor: GOLD }}
            >
              Book a consultation <span className="text-base">+</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 px-10 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <p
            className="text-[10px] tracking-[0.18em] uppercase font-light"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            © 2026 GAM solutions L.L.C-FZ. All rights reserved.
          </p>
          <p
            className="text-[10px] font-light hidden md:block"
            style={{ color: "rgba(255,255,255,0.12)" }}
          >
            Meydan Grandstand · 6th Floor · Dubai
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-[10px] tracking-[0.18em] uppercase font-light transition-colors"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; }}
          >
            privacy policy
          </Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <Link
            href="/terms"
            className="text-[10px] tracking-[0.18em] uppercase font-light transition-colors"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; }}
          >
            terms
          </Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <button
            className="text-[10px] tracking-[0.18em] uppercase font-light transition-colors cursor-pointer"
            style={{ color: GOLD }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            page top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

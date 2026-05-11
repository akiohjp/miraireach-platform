"use client";

import Link from "next/link";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8961C";

interface HeaderProps {
  showNav?: boolean;
  brand?: "gam" | "localreach";
  theme?: "light" | "dark";
}

export default function Header({ showNav = true, brand = "gam", theme = "dark" }: HeaderProps) {
  const isLight = theme === "light";
  const textMain = isLight ? "text-gray-900" : "text-white";
  const textSub = isLight ? "text-gray-400" : "text-white/30";
  const navBase = isLight
    ? "text-gray-500 hover:text-gray-900"
    : "text-white/40 hover:text-white";

  return (
    <header className="flex items-center justify-between py-5">
      <Link
        href="/"
        className={
          brand === "gam"
            ? "inline-flex items-baseline flex-wrap gap-x-1.5 gap-y-1 hover:opacity-90 transition-opacity"
            : "inline-flex flex-col gap-0.5 group"
        }
      >
        {brand === "localreach" ? (
          <>
            <span className={`text-2xl font-bold tracking-tight leading-none ${textMain}`}>
              Local<span style={{ color: GOLD }}>Reach</span>
            </span>
            <span className={`text-[10px] tracking-[0.25em] uppercase font-medium ${textSub}`}>
              by GAM Solutions
            </span>
          </>
        ) : (
          <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0 leading-none">
            <span className={`text-xl font-black tracking-tight md:text-2xl ${textMain}`}>GAM</span>
            <span className="text-xl font-bold tracking-tight md:text-2xl" style={{ color: GOLD }}>
              solutions
            </span>
          </span>
        )}
      </Link>

      {showNav && (
        <div className="flex items-center gap-6">
          <nav className={`hidden md:flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${navBase}`}>
            <Link href="/" className="hover:transition-colors">
              mirAIreach
            </Link>
            <Link href="/about" className="hover:transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:transition-colors">
              Contact
            </Link>
          </nav>
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105"
            style={{ backgroundColor: GOLD }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD_DARK; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = GOLD; }}
          >
            Book a Consultation
          </Link>
        </div>
      )}
    </header>
  );
}

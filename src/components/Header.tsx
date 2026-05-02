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
      <Link href="/" className={brand === "gam" ? "flex items-center gap-1.5 hover:opacity-90 transition-opacity" : "inline-flex flex-col gap-0.5 group"}>
        {brand === "localreach" ? (
          <>
            <span className={`text-2xl font-bold tracking-tight leading-none ${textMain}`}>
              Local<span style={{ color: GOLD }}>Reach</span>
            </span>
            <span className={`text-[10px] tracking-[0.25em] uppercase font-medium ${textSub}`}>
              Powered by GAM Solutions L.L.C-FZ
            </span>
          </>
        ) : (
          <>
            <span className={`text-2xl md:text-3xl font-black tracking-tight leading-none ${textMain}`}>
              GAM
            </span>
            <span className="text-2xl md:text-3xl font-bold tracking-tight leading-none" style={{ color: GOLD }}>
              solutions
            </span>
          </>
        )}
      </Link>

      {showNav && (
        <div className="flex items-center gap-6">
          <nav className={`hidden md:flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${navBase}`}>
            <Link href="/localreach" className="hover:transition-colors">
              LocalReach
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

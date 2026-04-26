"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface HeaderProps {
  showNav?: boolean;
}

export default function Header({ showNav = true }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="mb-14 flex items-center justify-between border-b border-line pb-8">
      <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-foreground">
        mirAIreach <span className="text-primary italic">NEWS</span>
      </Link>
      
      <div className="flex items-center gap-6">
        {showNav && (
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-[0.18em] text-muted uppercase">
            <a href="/#latest" className="hover:text-foreground">
              Latest
            </a>
            <a href="/#trending" className="hover:text-foreground">
              Ranking
            </a>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
        )}
        
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center rounded-md border border-line px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
          aria-label="Toggle Language"
        >
          {language === "en" ? (
            <>
              <span className="text-foreground">EN</span>
              <span className="mx-1 opacity-40">/</span>
              <span className="opacity-50">AR</span>
            </>
          ) : (
            <>
              <span className="opacity-50">EN</span>
              <span className="mx-1 opacity-40">/</span>
              <span className="text-foreground">AR</span>
            </>
          )}
        </button>

      </div>
    </header>
  );
}

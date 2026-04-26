"use client";

import Link from "next/link";

interface HeaderProps {
  showNav?: boolean;
}

export default function Header({ showNav = true }: HeaderProps) {
  return (
    <header className="mb-14 flex items-center justify-between border-b border-line pb-8">
      <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-foreground">
        mirAIreach <span className="text-primary">NEWS</span>
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
      </div>
    </header>
  );
}

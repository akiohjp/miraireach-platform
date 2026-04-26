"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-white py-20 px-6 md:px-10 mt-24 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl flex flex-col items-center space-y-16">
        
        {/* Top: Brand & Action */}
        <div className="flex flex-col items-center space-y-10 w-full">
          <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-white">
            mirAIreach NEWS
          </Link>
          
          <div className="flex flex-col items-center space-y-6">
            <Link 
              href="/contact"
              className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-black transition-all bg-white rounded-full hover:bg-primary"
            >
              <span className="relative text-[10px] sm:text-xs uppercase tracking-[0.4em] text-black group-hover:text-white transition-colors">
                Book a strategic meeting
              </span>
            </Link>
            <a 
              href="mailto:info.ae@miraireach.marketing"
              className="text-sm sm:text-base font-medium tracking-[0.1em] text-white/40 hover:text-primary transition-colors lowercase"
            >
              info.ae@miraireach.marketing
            </a>
          </div>
        </div>

        {/* Middle: 3 Core Offers (Condensed but Readable) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 w-full border-y border-white/[0.05] py-14">
          <Link 
            href="/contact?service=aio-diagnostic"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-primary transition-colors">01</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
              AI Search Audit
            </span>
          </Link>

          <Link 
            href="/contact?service=free-design"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-primary transition-colors">02</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
              Web Design Offer
            </span>
          </Link>

          <Link 
            href="/contact?service=pr-outreach"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-primary transition-colors">03</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
              AI PR Outreach
            </span>
          </Link>
        </div>

        {/* Bottom: Legal & Copyright */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase">
            &copy; 2026 mirAIreach NEWS. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] sm:text-xs tracking-[0.2em] uppercase hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] sm:text-xs tracking-[0.2em] uppercase hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

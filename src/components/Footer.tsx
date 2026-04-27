"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-white py-8 px-6 md:px-10 mt-8 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl flex flex-col items-center space-y-6">
        
        {/* Top: Brand & Action */}
        <div className="flex flex-col items-center space-y-4 w-full">
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
              className="text-sm sm:text-base font-medium tracking-[0.1em] text-white/60 hover:text-primary transition-colors lowercase"
            >
              info.ae@miraireach.marketing
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full border-y border-white/[0.05] py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 w-full">
          <Link 
            href="/contact?service=aio-diagnostic"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">01</span>
            <span className="text-base sm:text-lg font-black uppercase tracking-[0.2em] leading-relaxed text-white">
              AI Search Audit
            </span>
          </Link>

          <Link 
            href="/contact?service=free-design"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">02</span>
            <span className="text-base sm:text-lg font-black uppercase tracking-[0.2em] leading-relaxed text-white">
              Web Design Offer
            </span>
          </Link>

          <Link 
            href="/contact?service=pr-outreach"
            className="flex flex-col items-center text-center space-y-3 group"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">03</span>
            <span className="text-base sm:text-lg font-black uppercase tracking-[0.2em] leading-relaxed text-white">
              AI PR Outreach
            </span>
          </Link>
          </div>
        </div>

        {/* Platform Description */}
        <div className="w-full text-center max-w-4xl border-t border-white/[0.05] pt-8">
          <p className="text-sm tracking-[0.2em] leading-relaxed text-gray-400 uppercase font-light">
            mirAIreach NEWS is a premier intelligence platform provided by mirAIreach, <br />
            a leader in AI-driven business infrastructure and GEO (Generative Engine Optimization).
          </p>
        </div>

        {/* Bottom: Legal & Copyright */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 opacity-70">
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

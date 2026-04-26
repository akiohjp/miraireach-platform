"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-24 px-6 md:px-10 mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl flex flex-col items-center space-y-20">
        
        {/* Brand */}
        <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-white">
          mirAIreach NEWS
        </Link>

        {/* Top CTA: Strategic Meeting */}
        <div className="w-full flex justify-center">
          <Link 
            href="/contact"
            className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-black transition-all bg-white rounded-full hover:bg-primary"
          >
            <span className="relative text-[10px] uppercase tracking-[0.4em] text-black group-hover:text-white transition-colors">
              Book a strategic meeting
            </span>
          </Link>
        </div>

        {/* 3 Core Offers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full max-w-5xl border-y border-white/5 py-16">
          <Link 
            href="/contact?service=aio-diagnostic"
            className="flex flex-col items-center text-center space-y-4 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666] group-hover:text-primary transition-colors">01</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] leading-loose">
              Start Free AI Search Audit
            </span>
          </Link>

          <Link 
            href="/contact?service=free-design"
            className="flex flex-col items-center text-center space-y-4 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666] group-hover:text-primary transition-colors">02</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] leading-loose">
              Claim Free Web Design Offer
            </span>
          </Link>

          <Link 
            href="/contact?service=pr-outreach"
            className="flex flex-col items-center text-center space-y-4 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666] group-hover:text-primary transition-colors">03</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] leading-loose">
              AI PR Outreach
            </span>
          </Link>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666]">Direct Line</p>
          <a 
            href="mailto:info.ae@miraireach.marketing"
            className="text-sm font-medium tracking-widest hover:text-primary transition-colors"
          >
            info.ae@miraireach.marketing
          </a>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="w-full pt-16 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 opacity-40">
          <p className="text-[10px] tracking-[0.2em] uppercase">
            &copy; 2026 mirAIreach NEWS. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] tracking-[0.2em] uppercase hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] tracking-[0.2em] uppercase hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

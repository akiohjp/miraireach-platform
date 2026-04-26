"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#999] py-24 px-6 md:px-10 mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl flex flex-col items-center space-y-16">
        {/* Brand */}
        <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-white">
          mirAIreach <span className="text-primary">NEWS</span>
        </Link>

        {/* 3 Core CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
          <Link 
            href="/contact?service=aio-diagnostic"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-colors text-center"
          >
            {isAr ? "بدء تدقيق البحث بالذكاء الاصطناعي" : "Start Free AI Search Audit"}
          </Link>
          <Link 
            href="/contact?service=free-design"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-colors text-center"
          >
            {isAr ? "طلب تصميم ويب مجاني" : "Claim Free Web Design Offer"}
          </Link>
          <a 
            href="mailto:info.ae@miraireach.marketing"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-colors text-center"
          >
            {isAr ? "اتصل بنا" : "Contact Us"}
          </a>
        </div>

        {/* Copyright */}
        <div className="w-full pt-16 border-t border-white/5 flex flex-col items-center">
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
            &copy; 2026 mirAIreach NEWS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

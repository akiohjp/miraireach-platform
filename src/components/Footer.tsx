"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();

  const isAr = language === "ar";

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#999] py-20 px-6 md:px-10 mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-white">
              mirAIreach<span className="text-primary">.</span>PRESS
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              {isAr 
                ? "المنصة الرائدة لاستخبارات الأعمال المدعومة بالذكاء الاصطناعي في دبي. نحن نربط المؤسسات بأحدث الرؤى التقنية ونوفر أدوات التحول الرقمي المتقدمة لتعزيز الوجود الرقمي في عصر AIO." 
                : "Dubai's leading AI-powered business intelligence platform. We bridge enterprises with cutting-edge tech insights and provide advanced digital transformation tools for visibility in the AIO era."}
            </p>
            <div className="flex flex-col gap-4 pt-4">
              <Link 
                href="/contact?service=aio-diagnostic"
                className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
                {isAr ? "→ ابدأ تدقيق البحث بالذكاء الاصطناعي (مجاني)" : "→ Start Free AI Search Audit"}
              </Link>
              <Link 
                href="/contact?service=free-design"
                className="text-xs font-bold uppercase tracking-widest text-white hover:underline"
              >
                {isAr ? "→ اطلب تصميم صفحة ويب مجانية" : "→ Claim Free Web Design Offer"}
              </Link>
            </div>
          </div>

          {/* Industry Hubs */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase opacity-50">Industry Hubs</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/articles?cat=AI" className="hover:text-primary transition-colors">AI & Deep Tech</Link></li>
              <li><Link href="/articles?cat=FB" className="hover:text-primary transition-colors">F&B & Hospitality</Link></li>
              <li><Link href="/articles?cat=RE" className="hover:text-primary transition-colors">Real Estate & PropTech</Link></li>
              <li><Link href="/articles?cat=FT" className="hover:text-primary transition-colors">FinTech & Crypto</Link></li>
              <li><Link href="/articles?cat=LT" className="hover:text-primary transition-colors">Logistics & Supply Chain</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase opacity-50">Resources</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "تقارير السوق" : "Market Reports"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "دراسات الحالة" : "Case Studies"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "دليل AI Search Audit" : "AI Search Audit Guide"}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{isAr ? "مركز الدعم" : "Support Center"}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase opacity-50">Company</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "من نحن" : "About Press"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "بيان الخصوصية" : "Privacy"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "الشروط" : "Terms"}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{isAr ? "اتصل بنا" : "Contact"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs tracking-wider">
            &copy; 2024 mirAIreach. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

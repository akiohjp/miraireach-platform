"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();

  const isAr = language === "ar";

  return (
    <footer className="w-full bg-[#111] text-[#999] py-16 px-6 md:px-10 mt-20 border-t border-line/20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tighter text-white">
              mirAIreach
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {isAr 
                ? "منصة تسويق ورؤى مدعومة بالذكاء الاصطناعي للمؤسسات (B2B) مقرها دبي." 
                : "Dubai-based AI marketing and insight platform for B2B enterprises."}
            </p>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "من نحن (About Us)" : "About Us"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "الأخبار (News)" : "News"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "الوظائف (Careers)" : "Careers"}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">mirAIreach Insight</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Enterprise AI Solutions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Marketing AIO</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "شروط الخدمة" : "Terms of Service"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{isAr ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 lg:col-span-1 col-span-2 md:col-span-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">{isAr ? "اتصل بنا (Contact Us)" : "Contact Us"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
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

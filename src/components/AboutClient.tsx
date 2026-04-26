"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

export default function AboutClient() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              {isAr ? "عن mirAIreach NEWS" : "About mirAIreach NEWS"}
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              {isAr 
                ? "سد الفجوة بين استخبارات الذكاء الاصطناعي والتميز في الأعمال في دبي."
                : "Bridging the gap between AI intelligence and business excellence in Dubai."}
            </p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {isAr ? "مهمتنا" : "Our Mission"}
              </h2>
              <p>
                {isAr 
                  ? "في mirAIreach NEWS، مهمتنا هي تمكين الشركات في دبي ودولة الإمارات العربية المتحدة من التنقل في المشهد الرقمي سريع التطور. نحن نجمع بين تقنيات الذكاء الاصطناعي المتطورة والرؤى العميقة للسوق المحلي لدفع النمو والابتكار والوضوح."
                  : "At mirAIreach NEWS, our mission is to empower businesses in Dubai and the UAE to navigate the rapidly evolving digital landscape. We combine cutting-edge AI technologies with deep local market insights to drive growth, innovation, and visibility."}
              </p>
              <p>
                {isAr
                  ? "نحن نؤمن بأن المستقبل ينتمي إلى أولئك الذين يمكنهم تسخير قوة الذكاء الاصطناعي لتحويل العمليات التقليدية في قطاعات مثل الأغذية والمشروبات والعقارات والتكنولوجيا العميقة إلى نماذج أعمال ذكية ومستدامة."
                  : "We believe the future belongs to those who can harness the power of AI to transform traditional operations in sectors like F&B, Real Estate, and Deep Tech into intelligent, sustainable business models."}
              </p>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {isAr ? "من نحن" : "Who We Are"}
              </h2>
              <p>
                {isAr
                  ? "mirAIreach NEWS هي منصة استخبارات أعمال متميزة مقرها دبي. نحن فريق من خبراء التكنولوجيا والاستراتيجيين والمبدعين المكرسين لتقديم محتوى عالي الجودة وحلول عملية."
                  : "mirAIreach NEWS is a premium business intelligence platform based in Dubai. We are a team of technologists, strategists, and creatives dedicated to providing high-quality content and actionable solutions."}
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {isAr ? "منصة استخبارات" : "Intelligence Platform"}
                  </h3>
                  <p className="text-sm text-muted">
                    {isAr
                      ? "نوفر تحليلات عميقة وتقارير حصرية حول اتجاهات الذكاء الاصطناعي وتأثيرها على الاقتصاد المحلي في دول مجلس التعاون الخليجي."
                      : "We provide deep analytics and exclusive reports on AI trends and their impact on the local GCC economy."}
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {isAr ? "حلول AIO" : "AIO Solutions"}
                  </h3>
                  <p className="text-sm text-muted">
                    {isAr
                      ? "من خلال خدمة AI Search Audit، نساعد العلامات التجارية على تحسين ظهورها في محركات البحث التوليدية مثل ChatGPT وGemini."
                      : "Through our AI Search Audit service, we help brands optimize their visibility in generative search engines like ChatGPT and Gemini."}
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {isAr ? "رؤيتنا لعام 2026" : "Our Vision for 2026"}
              </h2>
              <p>
                {isAr
                  ? "بحلول عام 2026، نهدف إلى أن نكون المصدر الموثوق الأول في الشرق الأوسط للأعمال التي تسعى إلى دمج الذكاء الاصطناعي في استراتيجياتها الأساسية. نحن لا ننشر الأخبار فحسب؛ بل نشكل المستقبل."
                  : "By 2026, we aim to be the Middle East's primary trusted source for businesses seeking to integrate AI into their core strategies. We don't just report the news; we shape the future."}
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

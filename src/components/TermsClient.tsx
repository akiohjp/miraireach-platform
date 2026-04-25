"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

export default function TermsClient() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-5xl uppercase">
              {isAr ? "شروط الخدمة" : "Terms of Service"}
            </h1>
            <p className="text-sm text-muted uppercase tracking-widest">
              {isAr ? "آخر تحديث: أبريل 2026" : "Last Updated: April 2026"}
            </p>
          </div>

          <div className="prose prose-invert prose-base max-w-none prose-headings:text-white prose-p:text-muted prose-li:text-muted">
            <p>
              {isAr 
                ? "باستخدامك لموقع mirAIreach، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية."
                : "By accessing and using mirAIreach, you agree to comply with and be bound by the following terms and conditions. Please read them carefully."}
            </p>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "1. استخدام المحتوى" : "1. Content Usage"}</h2>
              <p>
                {isAr
                  ? "جميع المواد المنشورة على mirAIreach، بما في ذلك المقالات والتقارير والرسوم البيانية، هي ملكية فكرية للمنصة أو شركائها. لا يجوز إعادة إنتاج المحتوى دون إذن خطي مسبق."
                  : "All materials published on mirAIreach, including articles, reports, and graphics, are the intellectual property of the platform or its partners. Content may not be reproduced without prior written permission."}
              </p>
              <p>
                {isAr
                  ? "بالنسبة للمحتوى المنسق (Curated Content)، نحن نحترم حقوق المصادر الأصلية ونقدم دائماً روابط واضحة للمادة الأصلية. يقتصر استخدامنا لهذا المحتوى على التحليل والتعليق العادل."
                  : "For Curated Content, we respect the rights of original sources and always provide clear attribution. Our use of such content is limited to fair analysis and strategic commentary."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "2. الملكية الفكرية" : "2. Intellectual Property"}</h2>
              <p>
                {isAr
                  ? "إن 'mirAIreach' و 'AI Search Audit' هي علامات تجارية محمية. أي استخدام غير مصرح به لهذه العلامات أو الشعارات المرتبطة بها محظور تماماً."
                  : "'mirAIreach' and 'AI Search Audit' are protected trademarks. Any unauthorized use of these marks or associated logos is strictly prohibited."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "3. إخلاء المسؤولية" : "3. Disclaimer of Liability"}</h2>
              <p>
                {isAr
                  ? "تُقدم الرؤى والتقارير والتحليلات الناتجة عن الذكاء الاصطناعي على mirAIreach لأغراض معلوماتية فقط. نحن نسعى جاهدين لتحقيق الدقة، ولكننا لا نضمن اكتمال أو صحة البيانات المقدمة."
                  : "The AI-generated insights, reports, and analytics on mirAIreach are provided for informational purposes only. We strive for accuracy but do not guarantee the completeness or correctness of the data provided."}
              </p>
              <p>
                {isAr
                  ? "لن تكون mirAIreach مسؤولة عن أي خسائر تجارية أو قرارات استثمارية تُتخذ بناءً على المعلومات المتاحة على المنصة."
                  : "mirAIreach shall not be held liable for any business losses or investment decisions made based on information available on the platform."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "4. القانون الواجب التطبيق" : "4. Governing Law"}</h2>
              <p>
                {isAr
                  ? "تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين مركز دبي المالي العالمي (DIFC) ودولة الإمارات العربية المتحدة."
                  : "These terms and conditions are governed by and construed in accordance with the laws of the Dubai International Financial Centre (DIFC) and the UAE."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "5. تعديل الشروط" : "5. Modifications"}</h2>
              <p>
                {isAr
                  ? "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يعتبر استمرارك في استخدام الموقع بعد التغييرات بمثابة موافقة على الشروط الجديدة."
                  : "We reserve the right to modify these terms at any time. Your continued use of the site following changes constitutes acceptance of the new terms."}
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

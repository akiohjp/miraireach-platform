"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

export default function PrivacyClient() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-5xl uppercase">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="text-sm text-muted uppercase tracking-widest">
              {isAr ? "آخر تحديث: أبريل 2026" : "Last Updated: April 2026"}
            </p>
          </div>

          <div className="prose prose-invert prose-base max-w-none prose-headings:text-white prose-p:text-muted prose-li:text-muted">
            <p>
              {isAr 
                ? "تلتزم mirAIreach بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا وخدماتنا."
                : "mirAIreach is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform and services."}
            </p>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "1. المعلومات التي نجمعها" : "1. Information We Collect"}</h2>
              <p>{isAr ? "نحن نجمع المعلومات التي تقدمها لنا مباشرة، بما في ذلك:" : "We collect information you provide directly to us, including:"}</p>
              <ul>
                <li>{isAr ? "الاسم الكامل وعنوان البريد الإلكتروني" : "Full name and email address"}</li>
                <li>{isAr ? "اسم الشركة والمسمى الوظيفي" : "Company name and job title"}</li>
                <li>{isAr ? "تفاصيل الاستفسارات والطلبات عبر نماذج الاتصال" : "Inquiry details submitted via contact forms"}</li>
                <li>{isAr ? "البيانات التقنية المتعلقة بـ AI Search Audit (اختياري)" : "Technical data related to AI Search Audits (Optional)"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "2. كيف نستخدم معلوماتك" : "2. How We Use Your Information"}</h2>
              <p>{isAr ? "نستخدم المعلومات التي نجمعها للأغراض التالية:" : "We use the information we collect for the following purposes:"}</p>
              <ul>
                <li>{isAr ? "تقديم خدمات تشخيص الذكاء الاصطناعي وإعداد التقارير" : "Providing AI diagnostic services and reports"}</li>
                <li>{isAr ? "إرسال النشرات الإخبارية وتحديثات الصناعة (يمكنك إلغاء الاشتراك في أي وقت)" : "Sending newsletters and industry updates (you can opt-out at any time)"}</li>
                <li>{isAr ? "الرد على استفساراتك وتقديم الدعم الفني" : "Responding to your inquiries and providing support"}</li>
                <li>{isAr ? "تحسين أداء منصتنا وتجربة المستخدم" : "Improving our platform performance and user experience"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "3. ملفات تعريف الارتباط (Cookies)" : "3. Cookies and Tracking"}</h2>
              <p>
                {isAr
                  ? "نستخدم ملفات تعريف الارتباط لتحليل حركة المرور على الموقع وتخصيص المحتوى. يمكنك التحكم في استخدام ملفات تعريف الارتباط من خلال إعدادات متصفحك."
                  : "We use cookies to analyze site traffic and personalize content. You can control the use of cookies through your browser settings."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "4. الامتثال القانوني" : "4. Legal Compliance"}</h2>
              <p>
                {isAr
                  ? "تتوافق ممارساتنا مع قانون حماية البيانات الشخصية في دولة الإمارات العربية المتحدة والمعايير الدولية مثل GDPR لضمان أعلى مستويات الأمان لبياناتك."
                  : "Our practices comply with the UAE Personal Data Protection Law and international standards like GDPR to ensure the highest levels of security for your data."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{isAr ? "5. اتصل بنا" : "5. Contact Us"}</h2>
              <p>
                {isAr
                  ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على: info.ae@miraireach.marketing"
                  : "If you have any questions about this Privacy Policy, please contact us at: info.ae@miraireach.marketing"}
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

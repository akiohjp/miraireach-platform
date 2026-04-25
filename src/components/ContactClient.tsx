"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

function ContactForm() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isAr = language === "ar";
  
  const [service, setService] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const s = searchParams.get("service");
    if (s) setService(s);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  if (status === "success") {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl">✓</div>
        <h2 className="text-3xl font-black">{isAr ? "تم إرسال الرسالة بنجاح" : "Message Sent Successfully"}</h2>
        <p className="text-muted">{isAr ? "سنتواصل معك قريباً جداً." : "We will get back to you very shortly."}</p>
        <button onClick={() => setStatus("idle")} className="text-xs font-black uppercase tracking-widest underline underline-offset-8">
          {isAr ? "إرسال رسالة أخرى" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isAr ? "الاسم الكامل" : "Full Name"}</label>
            <input required type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
            <input required type="email" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isAr ? "الخدمة المطلوبة" : "Interested Service"}</label>
          <select 
            value={service} 
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors appearance-none"
          >
            <option value="">{isAr ? "اختر الخدمة" : "Select a Service"}</option>
            <option value="aio-diagnostic">{isAr ? "تدقيق البحث بالذكاء الاصطناعي (مجاني)" : "Free AI Search Audit"}</option>
            <option value="free-design">{isAr ? "تصميم ويب متميز (مجاني)" : "Free Premium Web Design"}</option>
            <option value="consultancy">{isAr ? "استشارات الذكاء الاصطناعي" : "AI Strategic Consultancy"}</option>
            <option value="other">{isAr ? "أخرى" : "Other Inquiry"}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isAr ? "الرسالة" : "Message"}</label>
          <textarea rows={5} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors resize-none" />
        </div>

        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full rounded-lg bg-primary py-4 text-xs font-black uppercase tracking-widest text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? (isAr ? "جارٍ الإرسال..." : "Sending...") : (isAr ? "إرسال الطلب" : "Send Request")}
        </button>
      </form>
    </div>
  );
}

export default function ContactClient() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-12 space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              {isAr ? "تواصل معنا" : "Work with mirAIreach"}
            </h1>
            <p className="mx-auto max-w-xl text-muted leading-relaxed">
              {isAr 
                ? "ابدأ رحلة التحول الرقمي اليوم. فريقنا مستعد لمساعدتك في التميز في عصر الذكاء الاصطناعي."
                : "Initiate your digital transformation today. Our team is ready to help you dominate in the AI-driven landscape."}
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <ContactForm />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}

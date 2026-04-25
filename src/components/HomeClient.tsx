"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import { useLanguage } from "./LanguageProvider";
import { Article, fallbackImage, formatDate } from "@/lib/articles";
import { Search, Send, Layout, ArrowRight, Database, Cpu, TrendingUp } from "lucide-react";

interface HomeClientProps {
  articles: Article[];
  featured: Article;
  latestInsights: Article[];
  trending: Article[];
}

export default function HomeClient({ articles, featured, latestInsights, trending }: HomeClientProps) {
  const { language } = useLanguage();
  const [loadedArticles, setLoadedArticles] = useState<Article[]>(latestInsights);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(latestInsights.length >= 10);

  const isAr = language === "ar";

  const loadMore = async () => {
    setLoading(true);
    try {
      const offset = loadedArticles.length;
      const res = await fetch(`/api/articles?limit=10&offset=${offset}`);
      if (res.ok) {
        const newArticles = await res.json();
        if (newArticles.length < 10) {
          setHasMore(false);
        }
        setLoadedArticles((prev) => [...prev, ...newArticles]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (article?: Article) => {
    if (!article) return "";
    if (isAr && article.title_ar?.trim()) return article.title_ar;
    if (article.title?.trim()) return article.title;
    return isAr ? "عنوان غير متوفر" : "No Title Available";
  };

  const getExcerpt = (article?: Article) => {
    if (!article) return "";
    if (isAr && article.excerpt_ar?.trim()) return article.excerpt_ar;
    if (article.excerpt?.trim()) return article.excerpt;
    return isAr ? "لا يوجد ملخص متاح لهذا المقال." : "No excerpt available for this article.";
  };

  // Industry categories for grid
  const categories = [
    "AI & Deep Tech",
    "F&B & Hospitality",
    "Real Estate & PropTech",
    "FinTech & Crypto",
    "Gourmet & Dining",
    "Lifestyle & Travel",
    "Local Guide",
    "Trend Curation"
  ];

  return (
    <div className="mx-auto min-h-screen w-full bg-white selection:bg-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <Header showNav={true} />

        <main className="mt-12 space-y-32 pb-24">
          {/* 1. HERO SECTION (PR TIMES Style) */}
          <section className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="group relative h-[450px] overflow-hidden rounded-3xl lg:h-[600px] shadow-sm">
                <Link href={featured ? `/articles/${featured.id}` : "#"}>
                  <Image
                    src={featured?.image_url || fallbackImage}
                    alt={getTitle(featured)}
                    fill
                    className="object-cover transition duration-1000 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 p-8 text-white md:p-12 space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {featured?.category}
                      </span>
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] backdrop-blur-md bg-white/10 px-4 py-1 rounded-full border border-white/20">
                        {featured?.original_source_name || featured?.company_name}
                      </span>
                    </div>
                    <h1 className="text-3xl font-black leading-tight md:text-5xl tracking-tighter">
                      {getTitle(featured)}
                    </h1>
                    <p className="line-clamp-2 text-sm text-white/80 max-w-2xl leading-relaxed">
                      {getExcerpt(featured)}
                    </p>
                  </div>
                </Link>
              </article>
            </div>

            {/* ACCESS RANKING (Side Column) */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8 bg-primary" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
                  {isAr ? "الأكثر قراءة" : "Access Ranking"}
                </h2>
              </div>
              <div className="space-y-8">
                {trending.slice(0, 5).map((item, index) => (
                  <article key={item.id} className="flex gap-6 group">
                    <span className="text-4xl font-black text-foreground/5 transition-colors group-hover:text-primary/10">0{index + 1}</span>
                    <div className="space-y-2">
                      <Link href={`/articles/${item.id}`}>
                        <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {getTitle(item)}
                        </h3>
                      </Link>
                      <div className="text-[10px] text-muted uppercase font-black tracking-widest opacity-40">
                        {item.company_name}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 2. THE FOUNDATION: AI IDENTITY AGGREGATION (CORE SYSTEM) */}
          <section className="space-y-16 py-12">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-foreground text-background px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                {isAr ? "النظام الأساسي" : "The Core System"}
              </div>
              <h2 className="text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
                {isAr ? "الأساس: تجميع هوية الذكاء الاصطناعي" : "The Foundation: AI Identity Aggregation"}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-muted/80 font-medium">
                {isAr 
                  ? "توقف عن ترك الذكاء الاصطناعي يخمن قيمتك. يقوم mirAIreach بدمج معلومات عملك المشتتة في مصدر واحد عالي الدقة، مما يضمن فهم الذكاء الاصطناعي لعلامتك التجارية والتوصية بها بدقة 100٪."
                  : "Stop letting AI guess your value. mirAIreach integrates your scattered business information into a single 'High-Precision Source,' ensuring AI understands and recommends your brand with 100% accuracy."}
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><Database size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  {isAr ? "إشارة بيانات موحدة" : "Unified Data Signal"}
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  {isAr 
                    ? "تجميع بيانات SNS ومعلومات Google Business لإرسال إشارة متسقة وقوية لأنظمة الذكاء الاصطناعي."
                    : "Aggregate SNS and Google Business info to send a consistent, high-authority signal to AI systems globally."}
                </p>
              </div>

              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><Cpu size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  {isAr ? "فهم دقيق للذكاء الاصطناعي" : "Precision AI Understanding"}
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  {isAr 
                    ? "إنشاء بيانات منظمة يسهل على ChatGPT و Gemini استهلاكها، مما يثبت علامتك التجارية كمصدر موثوق."
                    : "Generate structured data that ChatGPT and Gemini crave, establishing your brand as a 'Verified Source' in their training sets."}
                </p>
              </div>

              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><TrendingUp size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  {isAr ? "التموضع الاستراتيجي" : "Strategic Positioning"}
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  {isAr 
                    ? "تعظيم معدل الاقتباس داخل إجابات الذكاء الاصطناعي، لتصبح أنت الإجابة بدلاً من مجرد رابط بحث."
                    : "Maximize your citation rate within AI answers. Move beyond being a search link to becoming the 'AI's Direct Answer' itself."}
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-6 rounded-full bg-foreground px-12 py-5 text-xs font-black uppercase tracking-[0.3em] text-background transition hover:bg-primary hover:text-white"
              >
                {isAr ? "احجز اجتماعاً استراتيجياً" : "Book a Strategic Meeting"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          {/* 3. THREE FREE SERVICES (STANDALONE TOOLS) */}
          <section className="space-y-20 bg-muted/5 rounded-[4rem] p-12 md:p-20 border border-line/5">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">
                {isAr ? "هل أنت غير مستعد للتكامل الكامل؟" : "Not ready for a full system integration?"}
              </p>
              <h2 className="text-3xl font-black tracking-tighter md:text-5xl">
                {isAr ? "جرب أدواتنا المستقلة المجانية أولاً" : "Try our free standalone tools first."}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Tool 1: AI PR Outreach */}
              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Send size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">{isAr ? "التواصل الإعلامي بالذكاء الاصطناعي" : "AI PR Outreach"}</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      {isAr ? "أتمتة إرسال رسائل العلاقات العامة لوسائل الإعلام المستهدفة." : "Automated PR outreach to target media outlets and high-authority journalists."}
                    </p>
                  </div>
                  <Link href="/contact?service=ai-pr" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{isAr ? "ابدأ التجربة" : "Start Free Trial"}</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Tool 2: AI Search Visibility Diagnosis */}
              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Search size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">{isAr ? "تشخيص وضوح البحث" : "AI Search Visibility Diagnosis"}</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      {isAr ? "تقرير مجاني حول كيفية ظهور علامتك التجارية في نتائج البحث التوليدي." : "Free audit report on how your brand is perceived by generative search engines."}
                    </p>
                  </div>
                  <Link href="/contact?service=ai-audit" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{isAr ? "ابدأ التجربة" : "Start Free Trial"}</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Tool 3: AI Website/LP Creation */}
              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Layout size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">{isAr ? "بناء صفحات هبوط احترافية" : "AI Website/LP Creation"}</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      {isAr ? "تصميم صفحة هبوط مخصصة ومحسنة للتحويل مجاناً لعملك." : "Get a high-converting, professionally designed landing page built for free."}
                    </p>
                  </div>
                  <Link href="/contact?service=free-lp" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{isAr ? "ابدأ التجربة" : "Start Free Trial"}</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. LATEST NEWS TIMELINE */}
          <section className="space-y-12">
            <div className="flex items-end justify-between border-b border-line/10 pb-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{isAr ? "التحديثات" : "Timeline"}</p>
                <h2 className="text-3xl font-black tracking-tight">{isAr ? "آخر أخبار الصناعة" : "Latest Industry Insights"}</h2>
              </div>
              <Link href="/articles" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-primary transition-colors">
                {isAr ? "عرض كل التقارير" : "Explore All Intelligence"}
              </Link>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {loadedArticles.slice(0, 20).map((item) => (
                <article key={`latest-${item.id}`} className="group flex gap-8">
                  <Link href={`/articles/${item.id}`} className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-2xl bg-muted/10 md:w-40">
                    <Image
                      src={item.image_url || fallbackImage}
                      alt={getTitle(item)}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>
                  <div className="flex flex-col justify-center space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary">{item.category}</span>
                      <span className="h-1 w-1 rounded-full bg-line" />
                      <span className="text-muted/50">{item.original_source_name || item.company_name}</span>
                    </div>
                    <Link href={`/articles/${item.id}`}>
                      <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                        {getTitle(item)}
                      </h3>
                    </Link>
                    <time className="text-[10px] font-black text-muted/30 tracking-widest">{formatDate(item.created_at)}</time>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {hasMore && (
            <div className="flex justify-center pt-12">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="group relative flex items-center gap-6 rounded-full border border-line px-16 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition hover:bg-foreground hover:text-background disabled:opacity-50"
              >
                {loading ? (isAr ? "جارٍ التحميل..." : "Loading...") : (isAr ? "عرض المزيد من البيانات" : "Load More Intelligence")}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import { useLanguage } from "./LanguageProvider";
import { Article, fallbackImage, formatDate } from "@/lib/articles";

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
    "Logistics & Supply Chain",
    "Retail & E-commerce"
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-8">
      <Header showNav={true} />

      <main className="mt-6 space-y-12">
        {/* 1. HERO SECTION (PR TIMES Style) */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <article className="group relative h-[400px] overflow-hidden rounded-xl lg:h-[500px]">
              <Link href={featured ? `/articles/${featured.id}` : "#"}>
                <Image
                  src={featured?.image_url || fallbackImage}
                  alt={getTitle(featured)}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white md:p-10 space-y-4">
                  <div className="flex gap-2">
                    <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {featured?.category}
                    </span>
                    <span className="text-[10px] font-medium text-white/80 uppercase tracking-widest">
                      {featured?.company_name}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold leading-tight md:text-4xl">
                    {getTitle(featured)}
                  </h1>
                  <p className="line-clamp-2 text-sm text-white/70 max-w-2xl">
                    {getExcerpt(featured)}
                  </p>
                </div>
              </Link>
            </article>
          </div>

          {/* ACCESS RANKING (Side Column for density) */}
          <div className="space-y-4">
            <h2 className="border-b-2 border-foreground pb-2 text-sm font-bold uppercase tracking-widest">
              {isAr ? "الأكثر قراءة" : "Access Ranking"}
            </h2>
            <div className="space-y-4">
              {trending.slice(0, 5).map((item, index) => (
                <article key={item.id} className="flex gap-4 group">
                  <span className="text-2xl font-black text-foreground/10 italic">0{index + 1}</span>
                  <div className="space-y-1">
                    <Link href={`/articles/${item.id}`}>
                      <h3 className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {getTitle(item)}
                      </h3>
                    </Link>
                    <div className="text-[9px] text-muted uppercase font-semibold">
                      {item.company_name} | {formatDate(item.created_at)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 2. CORE SERVICES (LP HYBRID SECTION) */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 border border-primary/20 transition hover:border-primary/40">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                {isAr ? "خدمة مجانية" : "Free Service"}
              </div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                {isAr ? "تدقيق البحث بالذكاء الاصطناعي" : "AI Search Audit"}
              </h2>
              <p className="text-sm leading-relaxed text-muted max-w-sm">
                {isAr 
                  ? "اكتشف كيف تصف أنظمة الذكاء الاصطناعي (مثل ChatGPT و Gemini) شركتك. احصل على تقرير تشخيصي مجاني لتقييم مدى جاهزيتك لعصر البحث التوليدي."
                  : "Discover how AI systems (ChatGPT, Gemini, etc.) talk about your brand. Get a free diagnostic report to evaluate your readiness for the generative search era."}
              </p>
              <Link 
                href="/contact?service=aio-diagnostic"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105"
              >
                {isAr ? "ابدأ التشخيص المجاني" : "Start Free Diagnostic"}
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-[#111] p-8 border border-white/5 transition hover:border-white/10 text-white">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                {isAr ? "عرض محدود" : "Limited Offer"}
              </div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl text-white">
                {isAr ? "تصميم صفحة ويب احترافية مجانية" : "Free Professional Web Design"}
              </h2>
              <p className="text-sm leading-relaxed text-white/60 max-w-sm">
                {isAr 
                  ? "نقوم بتصميم صفحة هبوط متميزة لعملك مجانًا. لفترة محدودة، نساعد الشركات في دبي على تحسين حضورها الرقمي بأحدث التقنيات."
                  : "We design a premium landing page for your business at zero cost. For a limited time, helping Dubai brands elevate their digital footprint."}
              </p>
              <Link 
                href="/contact?service=free-design"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:scale-105"
              >
                {isAr ? "احصل على عرضك الآن" : "Claim Offer Now"}
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors" />
          </div>
        </section>

        {/* 3. LATEST TIMELINE (High Density List) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="h-4 w-1 bg-primary" />
              {isAr ? "آخر الأخبار" : "Latest Releases"}
            </h2>
            <Link href="/articles" className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-foreground">
              {isAr ? "عرض الكل" : "View All"}
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            {loadedArticles.slice(0, 12).map((item) => (
              <article key={`latest-${item.id}`} className="group flex gap-4 border-b border-line pb-6 last:border-0 md:last:border-b">
                <Link href={`/articles/${item.id}`} className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-muted/10 md:h-24 md:w-40">
                  <Image
                    src={item.image_url || fallbackImage}
                    alt={getTitle(item)}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                </Link>
                <div className="flex flex-col justify-between py-0.5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
                      <span className="text-primary">{item.category}</span>
                      <span className="h-2 w-[1px] bg-line" />
                      <span className="text-muted">{item.company_name}</span>
                    </div>
                    <Link href={`/articles/${item.id}`}>
                      <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
                        {getTitle(item)}
                      </h3>
                    </Link>
                  </div>
                  <time className="text-[9px] text-muted/60">{formatDate(item.created_at)}</time>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. INDUSTRY CATEGORY GRID */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em]">{isAr ? "استكشاف حسب الصناعة" : "Explore by Industry"}</h2>
            <div className="mx-auto h-0.5 w-12 bg-primary" />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const catArticles = loadedArticles.filter(a => a.category === cat).slice(0, 3);
              if (catArticles.length === 0) return null;
              return (
                <div key={cat} className="rounded-xl border border-line bg-muted/5 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">{cat}</h3>
                    <span className="text-[10px] font-bold text-muted/50">{catArticles.length}+</span>
                  </div>
                  <div className="space-y-4">
                    {catArticles.map((item, idx) => (
                      <article key={item.id} className="group space-y-1 border-t border-line/50 pt-4 first:border-0 first:pt-0">
                        <Link href={`/articles/${item.id}`}>
                          <h4 className="text-xs font-semibold leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                            {getTitle(item)}
                          </h4>
                        </Link>
                        <div className="text-[8px] text-muted uppercase font-medium">
                          {item.company_name} | {formatDate(item.created_at)}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center pt-8">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="group flex items-center gap-3 rounded-full border-2 border-foreground px-12 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {loading ? (isAr ? "جارٍ التحميل..." : "Loading...") : (isAr ? "تحميل المزيد من التقارير" : "Load More Reports")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

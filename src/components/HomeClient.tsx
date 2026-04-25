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
    // If Arabic is selected and title_ar exists, use it.
    if (isAr && article.title_ar?.trim()) return article.title_ar;
    // Otherwise, fall back to English title if it exists.
    if (article.title?.trim()) return article.title;
    // Last resort fallback
    return isAr ? "عنوان غير متوفر" : "No Title Available";
  };

  const getExcerpt = (article?: Article) => {
    if (!article) return "";
    // If Arabic is selected and excerpt_ar exists, use it.
    if (isAr && article.excerpt_ar?.trim()) return article.excerpt_ar;
    // Otherwise, fall back to English excerpt if it exists.
    if (article.excerpt?.trim()) return article.excerpt;
    // Last resort fallback
    return isAr ? "لا يوجد ملخص متاح لهذا المقال." : "No excerpt available for this article.";
  };


  // Group loaded articles by category for the parallel grid layout
  const categories = Array.from(new Set(loadedArticles.map(a => a.category)));
  const topCategories = categories.slice(0, 3); // Display top 3 categories in parallel columns

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 md:px-10">
      <Header showNav={true} />

      <main className="mt-8 space-y-16">
        {/* 1. FEATURED INSIGHT */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-widest uppercase">
              {isAr ? "رؤى مميزة" : "Featured Insight"}
            </h2>
          </div>
          <article className="group relative overflow-hidden rounded-2xl bg-foreground/5">
            <Link href={featured ? `/articles/${featured.id}` : "#"} className="block lg:grid lg:grid-cols-2">
              <div className="relative h-[300px] lg:h-[450px]">
                <Image
                  src={featured?.image_url || fallbackImage}
                  alt={getTitle(featured) || "Dubai skyline"}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6">
                <div className="inline-block rounded-full bg-foreground text-background px-3 py-1 text-xs font-semibold tracking-wider uppercase w-fit">
                  {featured?.category || "Top Story"}
                </div>
                <h1 className="text-2xl font-bold leading-[1.3] md:text-4xl group-hover:text-foreground/80 transition-colors">
                  {getTitle(featured)}
                </h1>
                <p className="text-muted leading-relaxed max-w-xl">
                  {getExcerpt(featured)}
                </p>
                <div className="text-xs font-medium tracking-widest text-muted/70 uppercase">
                  {featured ? formatDate(featured.created_at) : "Latest Update"} | {featured?.source_name}
                </div>
              </div>
            </Link>
          </article>
        </section>

        {/* 2. WEEKLY ACCESS RANKING (Grid Layout) */}
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <h2 className="text-lg font-bold tracking-widest uppercase">
              {isAr ? "الأكثر قراءة هذا الأسبوع" : "Weekly Access Ranking"}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trending.slice(0, 4).map((item, index) => (
              <article key={item.id} className="group flex flex-col space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Link href={`/articles/${item.id}`}>
                    <Image
                      src={item.image_url || fallbackImage}
                      alt={getTitle(item)}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center bg-background/90 text-sm font-bold shadow backdrop-blur-sm">
                    {index + 1}
                  </span>
                </div>
                <Link href={`/articles/${item.id}`}>
                  <h3 className="text-sm font-semibold leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors">
                    {getTitle(item)}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* 3. CATEGORY PARALLEL GRIDS */}
        {topCategories.length > 0 && (
          <section className="grid gap-8 lg:grid-cols-3">
            {topCategories.map((cat) => {
              const catArticles = loadedArticles.filter(a => a.category === cat).slice(0, 4);
              return (
                <div key={cat} className="space-y-6">
                  <div className="border-b-2 border-foreground pb-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider">{cat}</h2>
                  </div>
                  <div className="space-y-5">
                    {catArticles.map((item, index) => (
                      <article key={item.id} className={`group flex gap-4 ${index !== 0 ? 'pt-5 border-t border-line/50' : ''}`}>
                        <Link href={`/articles/${item.id}`} className="shrink-0 relative h-20 w-24 overflow-hidden rounded bg-muted/10">
                          <Image
                            src={item.image_url || fallbackImage}
                            alt={getTitle(item)}
                            fill
                            className="object-cover transition duration-300 group-hover:opacity-80"
                          />
                        </Link>
                        <div className="flex flex-col justify-between py-0.5">
                          <Link href={`/articles/${item.id}`}>
                            <h3 className="text-sm font-medium leading-snug line-clamp-3 group-hover:underline decoration-1 underline-offset-2">
                              {getTitle(item)}
                            </h3>
                          </Link>
                          <span className="text-[10px] uppercase tracking-wider text-muted/60">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <hr className="border-line" />

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* 4. LATEST TIMELINE */}
          <section className="space-y-6">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-lg font-bold tracking-widest uppercase">
                {isAr ? "أحدث الأخبار" : "Latest Timeline"}
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {loadedArticles.map((item) => (
                <article key={`latest-${item.id}`} className="group relative overflow-hidden rounded-xl border border-line bg-muted/5 transition hover:bg-muted/10 hover:shadow-sm flex flex-col">
                  <Link href={`/articles/${item.id}`} className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={item.image_url || fallbackImage}
                      alt={getTitle(item)}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-widest uppercase text-muted">
                        <span className="text-foreground">{item.category}</span>
                        <span>|</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      <Link href={`/articles/${item.id}`}>
                        <h3 className="text-base font-semibold leading-relaxed group-hover:text-foreground/80 line-clamp-2">
                          {getTitle(item)}
                        </h3>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <div className="pt-8 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="rounded-full bg-foreground px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (isAr ? "جارٍ التحميل..." : "Loading...") : (isAr ? "تحميل المزيد" : "Load More")}
                </button>
              </div>
            )}
          </section>

          {/* 5. SIDEBAR (CTA Hook) */}
          <aside className="space-y-8">
            <section className="sticky top-8 overflow-hidden rounded-xl bg-[#111] text-white p-8">
              <div className="space-y-5 relative z-10">
                <div className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                  {isAr ? "عرض لفترة محدودة" : "Limited Offer"}
                </div>
                <h2 className="text-xl font-bold leading-tight">
                  {isAr 
                    ? "مواقع إلكترونية متميزة بالذكاء الاصطناعي لقطاع المطاعم في دبي 'بدون تكلفة'."
                    : "Zero-Cost Premium AI Websites for Dubai F&B."}
                </h2>
                <p className="text-sm leading-relaxed text-gray-400">
                  {isAr
                    ? "نحن نبني وندير مواقع إلكترونية متخصصة في جذب العملاء (AIO) باستخدام أحدث تقنيات الذاء الاصطناعي، بدون أي تكاليف أولية."
                    : "Claim your professionally designed, AIO-optimized website built entirely for you—with zero upfront cost."}
                </p>
                <div className="pt-2">
                  <Link href="/lp/fb-automation" className="block text-center rounded bg-white text-black px-6 py-3 text-sm font-bold tracking-wide transition-opacity hover:opacity-90">
                    {isAr ? "احصل على موقعك المجاني" : "Claim Your Free Site"}
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

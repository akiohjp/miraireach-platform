"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import { Article, fallbackImage, formatDate } from "@/lib/articles";
import { Search, Send, Layout, ArrowRight, Database, Cpu, TrendingUp } from "lucide-react";

interface HomeClientProps {
  articles: Article[];
  featured: Article;
  latestInsights: Article[];
  trending: Article[];
}

export default function HomeClient({ articles, featured, latestInsights, trending }: HomeClientProps) {
  const [loadedArticles, setLoadedArticles] = useState<Article[]>(latestInsights);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(latestInsights.length >= 10);

  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return loadedArticles;
    return loadedArticles.filter(a => a.category === selectedCategory);
  }, [loadedArticles, selectedCategory]);

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
    return article.title || "No Title Available";
  };

  const getExcerpt = (article?: Article) => {
    if (!article) return "";
    return article.excerpt || "No excerpt available for this article.";
  };

  const categories = [
    "UAE AI Strategy",
    "AI x Hospitality",
    "AI x Real Estate",
    "AI x Corporate",
    "AI Tools & Tactics",
    "AI Starter Guide"
  ];

  return (
    <div className="mx-auto w-full bg-white selection:bg-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <Header showNav={true} />

        <main className="mt-4 pb-24">
          <section className="grid gap-12 lg:grid-cols-3 items-start border-b border-transparent">
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

            <div className="h-fit">
              <aside className="sticky top-24 space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-8 bg-primary" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
                      Access Ranking
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

                <div className="rounded-3xl bg-foreground p-8 text-background space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Free Audit</p>
                    <h3 className="text-xl font-black leading-tight tracking-tighter">
                      Free AI Search Audit
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-background/60 font-medium">
                    Discover how AI systems perceive and describe your business in generative results.
                  </p>
                  <Link 
                    href="/contact?service=audit" 
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Audit Now
                  </Link>
                </div>
              </aside>
            </div>
          </section>

          <section className="space-y-20 bg-muted/5 rounded-[4rem] p-12 md:p-20 border border-line/5 my-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">
                Not ready for a full system integration?
              </p>
              <h2 className="text-3xl font-black tracking-tighter md:text-5xl">
                Try our free standalone tools first.
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Send size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">AI PR Outreach</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      Automated PR outreach to target media outlets and high-authority journalists.
                    </p>
                  </div>
                  <Link href="/contact?service=ai-pr" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Search size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">AI Search Visibility Diagnosis</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      Free audit report on how your brand is perceived by generative search engines.
                    </p>
                  </div>
                  <Link href="/contact?service=ai-audit" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-2 duration-500">
                <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Layout size={24} /></div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black">AI Website/LP Creation</h3>
                    <p className="text-xs leading-relaxed text-muted/70 font-medium">
                      Get a high-converting, professionally designed landing page built for free.
                    </p>
                  </div>
                  <Link href="/contact?service=free-lp" className="flex items-center justify-between group/link">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8 pt-16">
            <header className="mb-10 flex items-center justify-between border-b border-line pb-8">
              <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-foreground">
                mirAIreach <span className="text-primary">NEWS</span>
              </Link>
              <div className="space-y-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Timeline</p>
                <h2 className="text-3xl font-black tracking-tight">Latest Industry Insights</h2>
              </div>
              <Link href="/articles" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-primary transition-colors">
                Explore All Intelligence
              </Link>
            </header>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link 
                href="/"
                scroll={false}
                className={`rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  !selectedCategory 
                    ? "bg-foreground text-background border-foreground" 
                    : "border-line text-muted hover:border-primary hover:text-primary hover:bg-primary/5"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <Link 
                    key={cat} 
                    href={`/?category=${encodeURIComponent(cat)}`}
                    scroll={false}
                    className={`rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive 
                        ? "bg-foreground text-background border-foreground" 
                        : "border-line text-muted hover:border-primary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {filteredArticles.slice(0, 30).map((item) => (
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
                {loading ? "Loading..." : "Load More Intelligence"}
              </button>
            </div>
          )}
        </main>
      </div>

      <section className="w-full py-16 bg-white border-t border-line/5">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="space-y-16">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-foreground text-background px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                The Core System
              </div>
              <h2 className="text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
                The Foundation: AI Identity Aggregation
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-muted/80 font-medium">
                Stop letting AI guess your value. mirAIreach integrates your scattered business information into a single 'High-Precision Source,' ensuring AI understands and recommends your brand with 100% accuracy.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><Database size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  Unified Data Signal
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  Aggregate SNS and Google Business info to send a consistent, high-authority signal to AI systems globally.
                </p>
              </div>

              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><Cpu size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  Precision AI Understanding
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  Generate structured data that ChatGPT and Gemini crave, establishing your brand as a 'Verified Source' in their training sets.
                </p>
              </div>

              <div className="space-y-6 border-l border-line/10 pl-8 relative">
                <div className="text-primary"><TrendingUp size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black tracking-tight">
                  Strategic Positioning
                </h3>
                <p className="text-sm leading-relaxed text-muted/70">
                  Maximize your citation rate within AI answers. Move beyond being a search link to becoming the 'AI's Direct Answer' itself.
                </p>
              </div>

              <div className="space-y-6 border-l border-primary/20 pl-8 relative bg-primary/5 p-8 rounded-2xl md:col-span-3">
                <div className="flex items-center gap-4">
                  <div className="text-primary"><TrendingUp size={32} strokeWidth={2.5} /></div>
                  <div className="rounded-full bg-primary px-3 py-1 text-[8px] font-black uppercase text-white">Exclusive Add-on</div>
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  Growth Acceleration (Exclusive AI Ads)
                </h3>
                <p className="text-base leading-relaxed text-muted/80 font-medium">
                  Accelerate the visibility of your structured AI Identity through specialized ad campaigns for generative search engines. We leverage NotebookLM to ensure your organic signal matches your promotional messaging perfectly.
                </p>
                <p className="text-[10px] font-bold text-primary italic">
                  ※ This feature is an exclusive upgrade plan for clients who have already implemented mirAIreach Identity Aggregation.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-6 rounded-full bg-foreground px-12 py-5 text-xs font-black uppercase tracking-[0.3em] text-background transition hover:bg-primary hover:text-white"
              >
                Book a Strategic Meeting
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

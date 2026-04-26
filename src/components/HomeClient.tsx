"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import { Article, fallbackImage, formatDate } from "@/lib/articles";
import { Search, Send, Layout, ArrowRight, Database, Cpu, TrendingUp, Zap, Shield, MessageCircle, RefreshCw } from "lucide-react";
import WebDesignOffer from "./WebDesignOffer";

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

          <section className="space-y-12 bg-muted/5 rounded-[3rem] p-8 md:p-14 border border-line/5 my-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Not ready for a full system integration?
              </p>
              <h2 className="text-2xl font-black tracking-tighter md:text-3xl">
                Try our free standalone tools first.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Tool 1 */}
              <div className="group bg-white rounded-3xl p-8 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="space-y-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Send size={20} /></div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black leading-tight">AI PR Outreach</h3>
                    <p className="text-[10px] leading-relaxed text-muted/90 font-medium">
                      Automated PR outreach to target media outlets and journalists.
                    </p>
                  </div>
                  <Link href="/contact?service=ai-pr" className="flex items-center justify-between group/link">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={12} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Tool 2 */}
              <div className="group bg-white rounded-3xl p-8 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="space-y-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Search size={20} /></div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black leading-tight">AI Search Visibility</h3>
                    <p className="text-[10px] leading-relaxed text-muted/90 font-medium">
                      Audit how your brand is perceived by generative search engines.
                    </p>
                  </div>
                  <Link href="/contact?service=ai-audit" className="flex items-center justify-between group/link">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={12} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Tool 3 */}
              <div className="group bg-white rounded-3xl p-8 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="space-y-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Layout size={20} /></div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black leading-tight">AI Website Creation</h3>
                    <p className="text-[10px] leading-relaxed text-muted/90 font-medium">
                      Get a high-converting, professionally designed landing page built for free.
                    </p>
                  </div>
                  <Link href="/contact?service=free-lp" className="flex items-center justify-between group/link">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Start Free Trial</span>
                    <ArrowRight size={12} className="group-hover/link:translate-x-2 transition-transform" />
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

            <div className="grid gap-12 sm:gap-16 md:grid-cols-2">
              {filteredArticles.slice(0, 30).map((item) => (
                <article key={`latest-${item.id}`} className="group space-y-5">
                  <Link href={`/articles/${item.id}`} className="block overflow-hidden rounded-sm">
                    <div className="relative aspect-[16/9] bg-muted/10">
                      <Image
                        src={item.image_url || fallbackImage}
                        alt={getTitle(item)}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-light uppercase tracking-[0.25em] text-primary">
                          {item.category}
                        </span>
                        <time className="text-[10px] font-medium text-muted/50 tracking-widest uppercase">
                          {formatDate(item.created_at)}
                        </time>
                      </div>
                      <Link href={`/articles/${item.id}`}>
                        <h3 className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                          {getTitle(item)}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-sm text-muted/90 leading-relaxed line-clamp-2 font-medium">
                      {getExcerpt(item)}
                    </p>
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

      {/* SECTION 1: THE NEW SEARCH REALITY */}
      <section className="w-full py-14 bg-white border-t border-line/5">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="space-y-12">
            
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1]">
                Don't just rank on Google. <br />
                <span className="text-primary">Be the one AI recommends.</span>
              </h2>
              <p className="text-sm md:text-base text-muted/90 leading-relaxed font-medium">
                Traditional SEO and GEO are the new industry standards. mirAIreach ensures your business is readable and trusted by the AI assistants your customers use every day.
                <br /><span className="text-[10px] opacity-60 uppercase tracking-widest font-bold">GEO: Generative Engine Optimization: Ensuring your business is the top recommendation for AI assistants.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center py-10 border-y border-line/5">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The New Reality</p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">50% of the screen is now AI-driven.</h3>
                <p className="text-sm text-muted/80 leading-relaxed">
                  AI Overviews and Maps now dominate mobile search real estate. If you aren't optimized for generative responses, you are invisible to half of your potential market.
                </p>
              </div>
              <div className="space-y-4 md:border-l md:border-line/10 md:pl-12">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">The Shift</p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">AI is your first salesperson.</h3>
                <p className="text-sm text-muted/80 leading-relaxed">
                  Customers no longer scroll through lists; they ask for the "best." mirAIreach positions your brand as the definitive answer across all major LLMs.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-foreground text-background px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                  The Four Pillars of AI Dominance
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">
                  Powered by the mirAIreach System
                </span>
              </div>
              
              <div className="grid gap-px md:grid-cols-2 border border-line/5 rounded-3xl overflow-hidden">
                <div className="p-8 bg-muted/5 space-y-4 border-b border-r border-line/5">
                  <div className="text-primary"><Zap size={20} strokeWidth={2.5} /></div>
                  <h4 className="text-base font-black tracking-tight">Instagram-to-Everywhere Automation</h4>
                  <p className="text-xs text-muted/90 leading-relaxed">Post once to update Google, TikTok, Threads, and Voice Assistants instantly.</p>
                </div>

                <div className="p-8 bg-muted/5 space-y-4 border-b border-line/5">
                  <div className="text-primary"><Shield size={20} strokeWidth={2.5} /></div>
                  <h4 className="text-base font-black tracking-tight">Secure Google Profile Management</h4>
                  <p className="text-xs text-muted/90 leading-relaxed">Centralized control for 20+ locations against unauthorized edits and spam.</p>
                </div>

                <div className="p-8 bg-muted/5 space-y-4 border-r border-line/5">
                  <div className="text-primary"><MessageCircle size={20} strokeWidth={2.5} /></div>
                  <h4 className="text-base font-black tracking-tight">AI-Powered Review Engine</h4>
                  <p className="text-xs text-muted/90 leading-relaxed">Smart, empathetic replies to boost your visibility across AI-driven search and maps automatically.</p>
                </div>

                <div className="p-8 bg-muted/5 space-y-4">
                  <div className="text-primary"><RefreshCw size={20} strokeWidth={2.5} /></div>
                  <h4 className="text-base font-black tracking-tight">Synup Global Citation Sync</h4>
                  <p className="text-xs text-muted/90 leading-relaxed">Instant sync across 57+ platforms including Apple Maps and ChatGPT.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-8 text-center">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Competitive Edge</p>
                <p className="text-sm font-bold">AI Trust Equals Market Share</p>
              </div>
              <div className="h-8 w-px bg-line/10 hidden md:block"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Proven Speed</p>
                <p className="text-sm font-bold">Zero History to AI-Recommended in Weeks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PREDICTABLE GROWTH */}
      <section className="w-full py-14 bg-[#fafafa] border-t border-line/5">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="space-y-12">
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Performance Marketing 2.0</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1]">
                Predictable Growth: <br />
                The Google AI Ads Acquisition System
              </h2>
              <p className="text-sm md:text-base text-muted/90 leading-relaxed font-medium">
                Stop wasting budget in the "Auction Trap". mirAIreach shifts your Google Ads from a reactive cost to a fixed, predictable growth engine.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-red-500/10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-700/80">The Auction Trap (Traditional)</p>
                <h3 className="text-xl font-black">Unpredictable & Rising Costs</h3>
                <p className="text-sm text-muted/80 leading-relaxed">
                  Traditional agencies thrive on your spend. As competition heats up in Dubai, your CPC skyrockets, leading to structural waste and diminishing returns.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-primary/10 space-y-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Integrated Solution (mirAIreach)</p>
                <h3 className="text-xl font-black">Visibility Foundation + AI Interception</h3>
                <p className="text-sm text-muted/80 leading-relaxed">
                  We combine fixed-cost infrastructure with "Competitor Name Interception." We don't just bid on keywords; we capture high-intent leads before they even reach the auction.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-line/5 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line/5 bg-muted/5">
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-muted/60">Feature</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-red-700/80">Traditional Ads</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Integrated AI Ads</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-line/5">
                    <td className="p-5 font-bold">Cost Structure</td>
                    <td className="p-5 text-muted/80 italic">Auction / Variable</td>
                    <td className="p-5 font-black">Fixed Monthly Fee</td>
                  </tr>
                  <tr className="border-b border-line/5">
                    <td className="p-5 font-bold">Targeting</td>
                    <td className="p-5 text-muted/80 italic">Pay for all impressions</td>
                    <td className="p-5 font-black">Focused on high-intent leads</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold">Strategic Edge</td>
                    <td className="p-5 text-muted/80 italic">None (Reactive)</td>
                    <td className="p-5 font-black">Foundation + Competitor Interception</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center space-y-8 pt-8">
              <p className="text-lg font-black tracking-tight">Ready to start your predictable growth journey?</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-6 rounded-full bg-primary px-10 py-4 text-xs font-black uppercase tracking-[0.3em] text-white transition hover:bg-black"
              >
                BOOK A 15-MINUTE STRATEGIC DIAGNOSIS
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WebDesignOffer />
    </div>
  );
}

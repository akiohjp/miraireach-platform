"use client";

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

  const getTitle = (article?: Article) => {
    if (!article) return "";
    return language === "ja" && article.title_ja ? article.title_ja : article.title;
  };

  const getExcerpt = (article?: Article) => {
    if (!article) return "";
    return language === "ja" && article.excerpt_ja ? article.excerpt_ja : article.excerpt;
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-12 md:px-10">
      <Header showNav={true} />

      <main className="grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-12">
          <article className="space-y-6">
            <Link href={featured ? `/articles/${featured.id}` : "#"} className="block">
              <Image
                src={featured?.image_url || fallbackImage}
                alt={getTitle(featured) || "Dubai skyline and modern business towers"}
                width={1600}
                height={900}
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </Link>
            <div className="space-y-4">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Featured Insight |{" "}
                {featured ? formatDate(featured.created_at) : "Latest Update"}
              </p>
              <Link href={featured ? `/articles/${featured.id}` : "#"}>
                <h1 className="max-w-4xl text-3xl font-medium leading-[1.35] tracking-[0.01em] md:text-5xl md:leading-[1.28] hover:opacity-80">
                  {getTitle(featured) ||
                    "Enterprise AI Marketing in Dubai Enters a Precision Era as B2B Buyers Demand Account-Level Intelligence."}
                </h1>
              </Link>
              <p className="max-w-3xl text-base leading-8 tracking-[0.01em] text-muted md:text-lg">
                {getExcerpt(featured) ||
                  "Regional decision-makers are reallocating media budgets toward data-centric programs that unify intent signals, multilingual personalization, and revenue attribution across complex stakeholder journeys."}
              </p>
            </div>
          </article>

          {/* Promotional CTA Banner (Freemium Hook) */}
          <section className="relative overflow-hidden rounded-xl border border-line bg-muted/5 p-8 md:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-foreground/5 blur-3xl"></div>
            <div className="relative z-10 space-y-5">
              <div className="inline-block rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-xs font-medium tracking-widest text-foreground uppercase">
                {language === "ja" ? "限定オファー" : "Limited Offer"}
              </div>
              <h2 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                {language === "ja" 
                  ? "AI時代、ドバイの飲食店に『無料で』プロ級サイトを。"
                  : "Zero-Cost Premium AI Websites for Dubai F&B."}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                {language === "ja"
                  ? "「自分で作る時間がない」「安っぽくなるのが嫌だ」。そんな悩みはもう過去のものです。最新AI技術で制作コストをゼロ化し、集客（AIO）に特化したウェブサイトを初期費用無料で構築・代行します。"
                  : "No time? Worried about a cheap look? We've eliminated production costs using advanced AI. Claim your professionally designed, AIO-optimized website built entirely for you—with zero upfront cost."}
              </p>
              <div className="pt-2">
                <Link href="/lp/fb-automation">
                  <button className="rounded bg-foreground px-6 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90">
                    {language === "ja" ? "詳細を見る" : "Claim Your Free Site"}
                  </button>
                </Link>
              </div>
            </div>
          </section>

          <section id="latest" className="space-y-2">
            <h2 className="pb-4 text-xl font-medium tracking-[0.08em] uppercase">
              Latest Timeline
            </h2>
            <div className="space-y-0">
              {latestInsights.map((item, index) => (
                <article
                  key={item.id}
                  className={`space-y-2 py-6 ${
                    index !== 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-[0.14em] text-muted uppercase">
                    <span>{formatDate(item.created_at)}</span>
                    <span>{item.category}</span>
                  </div>
                  <Link href={`/articles/${item.id}`}>
                    <h3 className="text-xl leading-8 tracking-[0.005em] md:text-2xl hover:opacity-80">
                      {getTitle(item)}
                    </h3>
                  </Link>
                  <p className="text-sm tracking-[0.08em] text-muted uppercase">
                    {item.source_name}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside id="trending" className="space-y-4 lg:pt-[4.5rem]">
          <h2 className="pb-2 text-sm tracking-[0.16em] text-muted uppercase">
            Weekly Access Ranking
          </h2>
          <div className="space-y-5">
            {trending.map((item, index) => (
              <article key={item.id} className="group space-y-3">
                <div className="relative overflow-hidden">
                  <Link href={`/articles/${item.id}`}>
                    <Image
                      src={item.image_url || fallbackImage}
                      alt={getTitle(item)}
                      width={1200}
                      height={675}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <span className="absolute left-3 top-3 text-3xl font-medium leading-none tracking-tight text-white/95 drop-shadow-md">
                    {index + 1}
                  </span>
                </div>
                <Link href={`/articles/${item.id}`}>
                  <h3 className="text-base leading-7 tracking-[0.01em] hover:opacity-80">
                    {getTitle(item)}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

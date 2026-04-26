"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Header from "./Header";
import { Article, fallbackImage, formatDate } from "@/lib/articles";

interface ArticleClientProps {
  article: Article;
}

export default function ArticleClient({ article }: ArticleClientProps) {
  const title = article.title || "No Title Available";
  const content = article.content || "";
  const excerpt = article.excerpt || "No excerpt available for this article.";

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 md:px-10">
      <Header showNav={false} />

      <article className="space-y-8 mt-4 text-left" dir="ltr">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">
              {article.category} | {formatDate(article.created_at)} |{" "}
              {article.source_name}
            </p>
            {article.is_curated && article.original_url && (
              <a 
                href={article.original_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/20 transition-colors"
              >
                Source: {article.original_source_name}
              </a>
            )}
          </div>
          <h1 className="max-w-4xl text-3xl font-medium leading-[1.3] tracking-[0.01em] md:text-5xl">
            {title}
          </h1>
        </div>

        <Image
          src={article.image_url || fallbackImage}
          alt={title}
          width={1800}
          height={1000}
          className="h-[360px] w-full object-cover md:h-[520px]"
          priority
        />

        <div className="prose prose-lg max-w-3xl prose-headings:tracking-[0.01em] prose-headings:text-foreground prose-p:leading-8 prose-p:text-foreground/90 prose-strong:font-semibold prose-li:leading-8 text-left">
          <ReactMarkdown>
            {content?.trim() ||
              `## Market Context\n\n${excerpt}\n\n## Why It Matters\n\nDubai's B2B ecosystem is rapidly aligning content strategy with measurable pipeline performance.`}
          </ReactMarkdown>
        </div>

        {/* EXECUTIVE ACTION CTA (LP HYBRID) */}
        <div className="mt-20 rounded-3xl bg-[#0a0a0a] p-10 border border-white/5 space-y-12" dir="ltr">
          <div className="space-y-4 text-left">
            <div className="inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              Executive Action
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              Turn Insights into Advantage
            </h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
              Following the trends in this report, we recommend Dubai enterprises verify their brand visibility within the AI ecosystem immediately.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link 
              href="/contact?service=aio-diagnostic"
              className="group flex flex-col gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-primary/40 transition-all hover:bg-primary/[0.02] text-left"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Service 01</span>
              <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">Free AI Search Audit</span>
              <span className="text-xs text-white/60 leading-relaxed">Audit how generative search engines perceive and describe your brand.</span>
            </Link>

            <Link 
              href="/contact?service=free-design"
              className="group flex flex-col gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02] text-left"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Service 02</span>
              <span className="text-lg font-bold text-white group-hover:text-white/80 transition-colors">Premium Web Design (Free)</span>
              <span className="text-xs text-white/60 leading-relaxed">Get a bespoke, AI-optimized landing page built for your business.</span>
            </Link>

            <Link 
              href="/contact?service=ai-pr"
              className="group flex flex-col gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-primary/40 transition-all hover:bg-primary/[0.02] text-left"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Service 03</span>
              <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">AI PR Outreach (Free)</span>
              <span className="text-xs text-white/60 leading-relaxed">Automate high-authority media outreach to boost your brand's AI credibility instantly.</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-white/5">
            <Link 
              href="/contact"
              className="flex items-center justify-between group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors">
                Talk to a Strategist
              </span>
              <span className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                →
              </span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Header from "./Header";
import { useLanguage } from "./LanguageProvider";
import { Article, fallbackImage, formatDate } from "@/lib/articles";

interface ArticleClientProps {
  article: Article;
}

export default function ArticleClient({ article }: ArticleClientProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const title = (isAr && article.title_ar?.trim() ? article.title_ar : article.title) || (isAr ? "عنوان غير متوفر" : "No Title Available");
  
  const content = (isAr && article.content_ar?.trim() ? article.content_ar : article.content) || "";
  
  const excerpt = (isAr && article.excerpt_ar?.trim() ? article.excerpt_ar : article.excerpt) || (isAr ? "لا يوجد ملخص متاح لهذا المقال." : "No excerpt available for this article.");



  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 md:px-10">
      <Header showNav={false} />

      <article className="space-y-8 mt-4">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">
            {article.category} | {formatDate(article.created_at)} |{" "}
            {article.source_name}
          </p>
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

        <div className="prose prose-lg max-w-3xl prose-headings:tracking-[0.01em] prose-headings:text-foreground prose-p:leading-8 prose-p:text-foreground/90 prose-strong:font-semibold prose-li:leading-8">
          <ReactMarkdown>
            {content?.trim() ||
              `## Market Context\n\n${excerpt}\n\n## Why It Matters\n\nDubai's B2B ecosystem is rapidly aligning content strategy with measurable pipeline performance.`}
          </ReactMarkdown>
        </div>

        {/* EXECUTIVE ACTION CTA (LP HYBRID) */}
        <div className="mt-20 rounded-3xl bg-[#0a0a0a] p-10 border border-white/5 space-y-10">
          <div className="space-y-4">
            <div className="inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              {isAr ? "خطوات تنفيذية" : "Executive Action"}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              {isAr ? "تحويل الرؤى إلى ميزة تنافسية" : "Turn Insights into Advantage"}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
              {isAr 
                ? "بناءً على هذا التقرير، نوصي الشركات الرائدة في دبي بالتحقق من مدى وضوح علامتها التجارية في أنظمة الذكاء الاصطناعي."
                : "Following the trends in this report, we recommend Dubai enterprises verify their brand visibility within the AI ecosystem immediately."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link 
              href="/contact?service=aio-diagnostic"
              className="group flex flex-col gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-primary/40 transition-all hover:bg-primary/[0.02]"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Service 01</span>
              <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">{isAr ? "تشخيص AIO المجاني" : "Free AIO Diagnostic"}</span>
              <span className="text-xs text-white/40 leading-relaxed">{isAr ? "اكتشف كيف يراك ChatGPT و Gemini و Perplexity." : "Discover how ChatGPT, Gemini, and Perplexity perceive your brand."}</span>
            </Link>
            <Link 
              href="/contact?service=free-design"
              className="group flex flex-col gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02]"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Service 02</span>
              <span className="text-lg font-bold text-white group-hover:text-white/80 transition-colors">{isAr ? "تصميم ويب متميز (مجاني)" : "Premium Web Design (Free)"}</span>
              <span className="text-xs text-white/40 leading-relaxed">{isAr ? "احصل على صفحة هبوط مخصصة محسنة للذكاء الاصطناعي." : "Get a bespoke, AI-optimized landing page built for your business."}</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link 
              href="/contact"
              className="flex items-center justify-between group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors">
                {isAr ? "تحدث مع خبير استراتيجي" : "Talk to a Strategist"}
              </span>
              <span className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                {isAr ? "←" : "→"}
              </span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

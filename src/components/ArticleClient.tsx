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

  const title = language === "ar" && article.title_ar ? article.title_ar : article.title;
  const content = language === "ar" && article.content_ar ? article.content_ar : article.content;
  const excerpt = language === "ar" && article.excerpt_ar ? article.excerpt_ar : article.excerpt;


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
      </article>
    </div>
  );
}

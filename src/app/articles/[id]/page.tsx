import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 0;

import ReactMarkdown from "react-markdown";
import { fallbackImage, fetchArticleById, formatDate } from "@/lib/articles";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const article = await fetchArticleById(numericId);
  if (!article) notFound();

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 md:px-10">
      <header className="mb-10 border-b border-line pb-5">
        <Link
          href="/"
          className="text-xs tracking-[0.18em] text-muted uppercase hover:text-foreground"
        >
          Back to Top
        </Link>
      </header>

      <article className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">
            {article.category} | {formatDate(article.created_at)} |{" "}
            {article.source_name}
          </p>
          <h1 className="max-w-4xl text-3xl font-medium leading-[1.3] tracking-[0.01em] md:text-5xl">
            {article.title}
          </h1>
        </div>

        <Image
          src={article.image_url || fallbackImage}
          alt={article.title}
          width={1800}
          height={1000}
          className="h-[360px] w-full object-cover md:h-[520px]"
          priority
        />

        <div className="prose prose-lg max-w-3xl prose-headings:tracking-[0.01em] prose-headings:text-foreground prose-p:leading-8 prose-p:text-foreground/90 prose-strong:font-semibold prose-li:leading-8">
          <ReactMarkdown>
            {article.content?.trim() ||
              `## Market Context

${article.excerpt}

## Why It Matters

Dubai's B2B ecosystem is rapidly aligning content strategy with measurable pipeline performance. Enterprise teams are combining AI-driven audience insights with multilingual editorial programs to improve decision velocity across procurement-heavy buying committees.

## Strategic Actions

- Build sector-specific editorial clusters for F&B and retail operators.
- Align campaign reporting to account-level revenue outcomes.
- Standardize operational workflows across marketing, sales, and partnerships.`}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

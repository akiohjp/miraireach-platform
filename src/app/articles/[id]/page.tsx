import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

        <div className="max-w-3xl space-y-6 text-base leading-8 tracking-[0.01em] text-foreground/90 md:text-lg">
          <p>{article.excerpt}</p>
          <p>
            Dubai&apos;s B2B ecosystem is increasingly focused on measurable growth,
            where brand storytelling, demand generation, and account-level media
            analytics are tightly integrated. Executive teams are prioritizing
            strategies that connect content performance to commercial outcomes
            across hospitality, retail, and enterprise services.
          </p>
          <p>
            As competition intensifies across the Gulf, organizations are investing
            in precision marketing workflows that improve cross-functional alignment
            between marketing, sales, and procurement stakeholders.
          </p>
        </div>
      </article>
    </div>
  );
}

import { notFound } from "next/navigation";
import { fetchArticleById } from "@/lib/articles";
import ArticleClient from "@/components/ArticleClient";

export const revalidate = 0;

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

  return <ArticleClient article={article} />;
}

import { fetchPublishedArticles } from "@/lib/articles";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0;

export default async function Home() {
  const articles = await fetchPublishedArticles();
  const featured = articles[0];
  const latestInsights = articles.slice(0, 10);
  const trending = articles.slice(0, 3);

  return (
    <HomeClient 
      articles={articles}
      featured={featured}
      latestInsights={latestInsights}
      trending={trending}
    />
  );
}

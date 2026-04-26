import { fetchPublishedArticles } from "@/lib/articles";
import HomeClient from "@/components/HomeClient";
import { Suspense } from "react";

export const revalidate = 0;

export default async function Home() {
  const articles = await fetchPublishedArticles();
  const featured = articles[0];
  const latestInsights = articles.slice(0, 10);
  const trending = articles.slice(0, 5);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient 
        articles={articles}
        featured={featured}
        latestInsights={latestInsights}
        trending={trending}
      />
    </Suspense>
  );
}

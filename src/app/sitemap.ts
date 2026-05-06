import type { MetadataRoute } from "next";
import { fetchPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/localreach",
  "/lp/miraireach",
  "/lp/fb-automation",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articles = await fetchPublishedArticles(500, 0);
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.id}`,
    lastModified: a.created_at ? new Date(a.created_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}

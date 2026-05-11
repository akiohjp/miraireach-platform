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

function safeLastModified(iso: string | undefined, fallback: Date): Date {
  if (!iso) return fallback;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const articles = await fetchPublishedArticles(500, 0);
    const articleEntries: MetadataRoute.Sitemap = articles
      .filter((a) => a != null && Number.isFinite(Number(a.id)))
      .map((a) => ({
        url: `${base}/articles/${Number(a.id)}`,
        lastModified: safeLastModified(a.created_at, now),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    return [...staticEntries, ...articleEntries];
  } catch (err) {
    console.error("sitemap generation failed:", err);
    return staticEntries;
  }
}

export type Article = {
  id: number;
  created_at: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string | null;
  source_name: string;
  image_url: string | null;
  image_search_query?: string | null;
  company_name?: string | null;
  is_published: boolean;
  is_curated?: boolean | null;
  original_source_name?: string | null;
  original_url?: string | null;
};

export const fallbackImage =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return { url, key };
}

export async function fetchPublishedArticles(limit = 20, offset = 0): Promise<Article[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  const { url, key } = config;
  
  const fullSelect = "id,created_at,category,title,excerpt,content,source_name,company_name,image_url,image_search_query,is_published,is_curated,original_source_name,original_url";
  const basicSelect = "id,created_at,category,title,excerpt,content,source_name,company_name,image_url,is_published";

  try {
    const response = await fetch(
      `${url}/rest/v1/articles?select=${fullSelect}&is_published=eq.true&order=created_at.desc,id.desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 400) {
      const fallbackResponse = await fetch(
        `${url}/rest/v1/articles?select=${basicSelect}&is_published=eq.true&order=created_at.desc,id.desc&limit=${limit}&offset=${offset}`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
          cache: "no-store",
        }
      );
      if (!fallbackResponse.ok) return [];
      const fallbackData: unknown = await fallbackResponse.json();
      return Array.isArray(fallbackData) ? (fallbackData as Article[]) : [];
    }

    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as Article[]) : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function fetchArticleById(id: number): Promise<Article | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const { url, key } = config;
  const fullSelect = "id,created_at,category,title,excerpt,content,source_name,company_name,image_url,image_search_query,is_published,is_curated,original_source_name,original_url";
  const basicSelect = "id,created_at,category,title,excerpt,content,source_name,company_name,image_url,is_published";

  try {
    const response = await fetch(
      `${url}/rest/v1/articles?select=${fullSelect}&id=eq.${id}&is_published=eq.true&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 400) {
      const fallbackResponse = await fetch(
        `${url}/rest/v1/articles?select=${basicSelect}&id=eq.${id}&is_published=eq.true&limit=1`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
          cache: "no-store",
        }
      );
      if (!fallbackResponse.ok) return null;
      const data = (await fallbackResponse.json()) as Article[];
      return data[0] ?? null;
    }

    if (!response.ok) return null;
    const data = (await response.json()) as Article[];
    return data[0] ?? null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

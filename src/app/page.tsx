import Image from "next/image";

type Article = {
  id: number;
  created_at: string;
  category: string;
  title: string;
  excerpt: string;
  source_name: string;
  image_url: string | null;
  is_published: boolean;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

async function fetchArticles(): Promise<Article[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return [];

  const response = await fetch(
    `${url}/rest/v1/articles?select=id,created_at,category,title,excerpt,source_name,image_url,is_published&is_published=eq.true&order=created_at.desc,id.desc&limit=20`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  return (await response.json()) as Article[];
}

export default async function Home() {
  const articles = await fetchArticles();
  const featured = articles[0];
  const latestInsights = articles.slice(0, 10);
  const trending = articles.slice(0, 3);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-12 md:px-10">
      <header className="mb-14 flex items-center justify-between border-b border-line pb-5">
        <p className="text-xl font-medium tracking-[0.22em]">MIRAIREACH PRESS</p>
        <nav className="flex items-center gap-6 text-xs tracking-[0.18em] text-muted uppercase">
          <a href="#latest" className="hover:text-foreground">
            Latest
          </a>
          <a href="#trending" className="hover:text-foreground">
            Ranking
          </a>
        </nav>
      </header>

      <main className="grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-12">
          <article className="space-y-6">
            <Image
              src={featured?.image_url || fallbackImage}
              alt={featured?.title || "Dubai skyline and modern business towers"}
              width={1600}
              height={900}
              className="h-[360px] w-full object-cover md:h-[460px]"
            />
            <div className="space-y-4">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Featured Insight |{" "}
                {featured ? formatDate(featured.created_at) : "Latest Update"}
              </p>
              <h1 className="max-w-4xl text-3xl font-medium leading-[1.35] tracking-[0.01em] md:text-5xl md:leading-[1.28]">
                {featured?.title ||
                  "Enterprise AI Marketing in Dubai Enters a Precision Era as B2B Buyers Demand Account-Level Intelligence."}
              </h1>
              <p className="max-w-3xl text-base leading-8 tracking-[0.01em] text-muted md:text-lg">
                {featured?.excerpt ||
                  "Regional decision-makers are reallocating media budgets toward data-centric programs that unify intent signals, multilingual personalization, and revenue attribution across complex stakeholder journeys."}
              </p>
            </div>
          </article>

          <section id="latest" className="space-y-2">
            <h2 className="pb-4 text-xl font-medium tracking-[0.08em] uppercase">
              Latest Timeline
            </h2>
            <div className="space-y-0">
              {latestInsights.map((item, index) => (
                <article
                  key={item.id}
                  className={`space-y-2 py-6 ${
                    index !== 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-[0.14em] text-muted uppercase">
                    <span>{formatDate(item.created_at)}</span>
                    <span>{item.category}</span>
                  </div>
                  <h3 className="text-xl leading-8 tracking-[0.005em] md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm tracking-[0.08em] text-muted uppercase">
                    {item.source_name}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside id="trending" className="space-y-4 lg:pt-[4.5rem]">
          <h2 className="pb-2 text-sm tracking-[0.16em] text-muted uppercase">
            Weekly Access Ranking
          </h2>
          <div className="space-y-5">
            {trending.map((item, index) => (
              <article key={item.id} className="group space-y-3">
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image_url || fallbackImage}
                    alt={item.title}
                    width={1200}
                    height={675}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-3 top-3 text-3xl font-medium leading-none tracking-tight text-white/95">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-base leading-7 tracking-[0.01em]">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

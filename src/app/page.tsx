export default function Home() {
  const latestInsights = [
    {
      date: "Apr 23, 2026",
      category: "F&B",
      title:
        "Dubai Hospitality Groups Accelerate AI-Driven Demand Forecasting for Enterprise Catering Contracts",
      source: "MENA Business Intelligence Desk",
    },
    {
      date: "Apr 22, 2026",
      category: "BEAUTY",
      title:
        "Cross-Border Retail Networks Adopt Predictive Audience Clusters to Optimize Gulf Expansion Campaigns",
      source: "GCC Commerce Wire",
    },
    {
      date: "Apr 21, 2026",
      category: "FINTECH",
      title:
        "B2B Payment Providers in DIFC Launch Adaptive Messaging Engines for High-Value Account Acquisition",
      source: "Dubai Market Review",
    },
    {
      date: "Apr 20, 2026",
      category: "LOGISTICS",
      title:
        "Free-Zone Operators Deploy Real-Time Lead Scoring to Improve Multi-Stakeholder Tender Conversion",
      source: "Middle East Supply Journal",
    },
    {
      date: "Apr 19, 2026",
      category: "PROPTECH",
      title:
        "Commercial Developers Use AI Content Workflows to Shorten Investor Decision Cycles Across the UAE",
      source: "Enterprise Growth Bulletin",
    },
  ];

  const trending = [
    {
      rank: 1,
      title: "How AI Signal Modeling Is Reshaping B2B Pipeline Strategy in Dubai",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    },
    {
      rank: 2,
      title: "Executive Guide to Arabic-English Creative Personalization at Scale",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    },
    {
      rank: 3,
      title: "Measuring Multi-Entity Attribution for GCC Enterprise Media Programs",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
  ];

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
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt="Dubai skyline and modern business towers"
              className="h-[360px] w-full object-cover md:h-[460px]"
            />
            <div className="space-y-4">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Featured Insight | Apr 23, 2026
              </p>
              <h1 className="max-w-4xl text-3xl font-medium leading-[1.35] tracking-[0.01em] md:text-5xl md:leading-[1.28]">
                Enterprise AI Marketing in Dubai Enters a Precision Era as B2B
                Buyers Demand Account-Level Intelligence.
              </h1>
              <p className="max-w-3xl text-base leading-8 tracking-[0.01em] text-muted md:text-lg">
                Regional decision-makers are reallocating media budgets toward
                data-centric programs that unify intent signals, multilingual
                personalization, and revenue attribution across complex stakeholder
                journeys.
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
                  key={item.title}
                  className={`space-y-2 py-6 ${
                    index !== 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-[0.14em] text-muted uppercase">
                    <span>{item.date}</span>
                    <span>{item.category}</span>
                  </div>
                  <h3 className="text-xl leading-8 tracking-[0.005em] md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm tracking-[0.08em] text-muted uppercase">
                    {item.source}
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
            {trending.map((item) => (
              <article key={item.rank} className="group space-y-3">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-3 top-3 text-3xl font-medium leading-none tracking-tight text-white/95">
                    {item.rank}
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

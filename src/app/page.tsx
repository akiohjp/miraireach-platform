import { menuItems, stores } from "@/lib/arabica-data";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-12">
      <header className="mb-16 flex items-center justify-between border-b border-line pb-6">
        <p className="text-2xl font-semibold tracking-tight">% MIRAIREACH</p>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#menu" className="hover:text-foreground">
            Menu
          </a>
          <a href="#stores" className="hover:text-foreground">
            Stores
          </a>
          <a href="/api/menu" className="hover:text-foreground">
            API
          </a>
        </nav>
      </header>

      <main className="flex flex-1 flex-col gap-16">
        <section className="grid gap-6 md:grid-cols-2">
          <h1 className="max-w-xl text-4xl leading-tight font-semibold md:text-5xl">
            Specialty coffee experience inspired by % Arabica.
          </h1>
          <p className="max-w-lg self-end text-base leading-7 text-muted">
            A clean and calm landing page with App Router APIs for menu and store
            data. Use this as a production-ready starting point for your coffee
            platform.
          </p>
        </section>

        <section id="menu" className="space-y-5">
          <h2 className="border-b border-line pb-3 text-xl font-medium">Menu</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="rounded-sm border border-line bg-white p-5"
              >
                <p className="mb-2 text-xs tracking-widest text-muted uppercase">
                  {item.category}
                </p>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-semibold">
                  ¥{item.priceJpy.toLocaleString("ja-JP")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="stores" className="space-y-5">
          <h2 className="border-b border-line pb-3 text-xl font-medium">Stores</h2>
          <div className="overflow-hidden rounded-sm border border-line bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-t border-line">
                    <td className="px-4 py-3">{store.city}</td>
                    <td className="px-4 py-3 text-muted">{store.location}</td>
                    <td className="px-4 py-3">{store.openHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

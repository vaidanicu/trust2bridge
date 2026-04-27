import Link from "next/link";
import { getItems } from "@/lib/api";
import AddToRequestButton from "./components/AddToRequestButton";

export default async function HomePage() {
  const items = await getItems();

  const categories = [
    "Haus & Garten",
    "Haushaltsgeräte",
    "Automobil",
    "Food",
    "Non-Food",
    "Baustoffe",
    "Maschinen",
    "Dienstleistungen",
  ];

  const featuredItems = items?.slice(0, 6) || [];

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {/* TOP HERO */}
      <section className="relative overflow-hidden bg-[url('/poze/Background.png')] bg-cover bg-center">
  {/* overlay mai elegant */}
 <div className="absolute inset-0 bg-gradient-to-r from-[#0b5f5d]/95 via-[#108280]/85 to-[#0a3f3e]/90" />

  <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
    
    {/* LEFT SIDE */}
    <div>
      <div className="mb-6 inline-block rounded-full bg-cyan-400 px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow">
        Exklusives Netzwerk: DE · HU · RO
      </div>

      <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
        Bulk Sourcing
      </h1>

      <p className="mt-6 max-w-xl text-lg font-medium text-white/90">
        Ihr B2B-Marktplatz für Restposten und Großhandelsware in Deutschland, Österreich, der Schweiz, Ungarn und Rumänien.
      </p>

      <Link
        href="/marketplace"
        className="mt-8 inline-block rounded-xl bg-cyan-400 px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-lg transition hover:bg-cyan-300"
      >
        Produkte entdecken
      </Link>

      <p className="mt-6 max-w-xl text-sm font-semibold text-white/80">
        VERTRAUEN IST ALLES: Geprüfte Anbieter, direkte Deals, persönliche Hotline und aktive Produktsuche in unseren regionalen Netzwerken – wir finden, was Sie brauchen
      </p>
    </div>

    {/* RIGHT SIDE (CARD) */}
    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg border border-white/20 shadow-xl">
      <h2 className="text-lg font-black uppercase text-yellow-300">
        Service-Hub und Logistik-Koordination
      </h2>

      <div className="mt-5 space-y-3 text-white font-semibold">
        <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
          <span>Deutschland</span>
          <span className="text-sm text-white/70">Service-Hub</span>
        </div>

        <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
          <span>Ungarn</span>
          <span className="text-sm text-white/70">Service-Hub</span>
        </div>

        <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
          <span>Rumänien</span>
          <span className="text-sm text-white/70">Service-Coordination</span>
        </div>
      </div>
    </div>

  </div>
</section>

      {/* MAIN MARKETPLACE AREA */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        {/* CATEGORIES */}
        <aside className="h-fit overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b bg-slate-950 px-5 py-4 text-sm font-black uppercase tracking-wider text-white">
            Kategorien
          </div>

          {categories.map((cat) => (
            <Link
              href={`/marketplace?category=${encodeURIComponent(cat)}`}
              key={cat}
              className="flex items-center justify-between border-b px-5 py-4 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
            >
              <span>{cat}</span>
              <span className="text-slate-300">›</span>
            </Link>
          ))}
        </aside>

        <div>
          {/* SEARCH */}
          <div className="flex overflow-hidden rounded-2xl border bg-white shadow-sm">
            <input
              placeholder="Produkte, Restposten oder Dienstleistungen suchen..."
              className="w-full px-5 py-4 text-sm outline-none"
            />
            <Link
              href="/marketplace"
              className="bg-orange-400 px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-orange-500"
            >
              Suchen
            </Link>
          </div>

          {/* ACTION CARDS */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link
              href="/marketplace"
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase text-cyan-600">
                Kaufen
              </p>
              <h3 className="mt-2 font-black">Produkte direkt entdecken</h3>
              <p className="mt-2 text-sm text-slate-500">
                Angebote ansehen und Anfragekorb nutzen.
              </p>
            </Link>

            <Link
              href="/request"
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase text-orange-500">
                Suchen
              </p>
              <h3 className="mt-2 font-black">Produkt suchen lassen</h3>
              <p className="mt-2 text-sm text-slate-500">
                Anfrage senden, wir prüfen und leiten weiter.
              </p>
            </Link>

            <div className="rounded-2xl border bg-white p-5 opacity-70 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">
                Später
              </p>
              <h3 className="mt-2 font-black">Online-Auktion</h3>
              <p className="mt-2 text-sm text-slate-500">
                Auktionen werden später ergänzt.
              </p>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                  Featured Deals
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  Hit Angebote der Woche
                </h2>
              </div>

              <Link
                href="/marketplace"
                className="hidden rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase text-white md:block"
              >
                Alle ansehen
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/item/${item.id}`} className="block">
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                          Produktbild
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {item.category || "B2B"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`/item/${item.id}`}>
                      <h3 className="line-clamp-2 min-h-[48px] font-black leading-snug text-slate-950 group-hover:text-cyan-700">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                      <p>Land: {item.country || "Nicht angegeben"}</p>
                      <p>Kategorie: {item.category || "Allgemein"}</p>
                    </div>

                    <p className="mt-3 text-sm font-black text-orange-500">
                      {item.price_status === "request"
                        ? "Preis auf Anfrage"
                        : item.price_status || "Preis auf Anfrage"}
                    </p>

                    <div className="mt-4">
                      <AddToRequestButton item={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/marketplace"
              className="mt-6 block rounded-xl bg-slate-950 px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-white md:hidden"
            >
              Alle Produkte ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
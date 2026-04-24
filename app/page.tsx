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

  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-[300px] overflow-hidden bg-[url('/poze/Background.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-teal-900/75" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-2 text-center">
          <div className="mb-6 rounded-md bg-cyan-400 px-5 py-2 text-xs font-black uppercase tracking-wider text-black">
            Exklusives Netzwerk: DE · HU · RO
          </div>

          <h1 className="text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
            Bulk Sourcing
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-medium text-white">
            Ihr B2B-Marktplatz für Restposten und Großhandelsware in Deutschland, Österreich, der Schweiz, Ungarn und Rumänien.
          </p>

          <Link
            href="/marketplace"
            className="mt-9 rounded-full bg-cyan-400 px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-lg transition hover:bg-cyan-300"
          >
            Produkte entdecken
          </Link>

          <div className="mt-10 w-full max-w-3xl rounded-xl border border-white/20 bg-white/10 px-8 py-5 backdrop-blur">
            <h2 className="text-lg font-black uppercase text-yellow-300">
              Service-Hub und Logistik-Koordination in 3+ Ländern
            </h2>
            <p className="mt-2 text-sm font-semibold text-white">
              Deutschland (Service-Hub) - Ungarn (Service-Hub) - Rumänien (Service-Coordination)
            </p>
          </div>

          <p className="mt-5 max-w-3xl text-sm font-semibold text-white">
           VERTRAUEN IST ALLES: Geprüfte Anbieter, direkte Deals, persönliche Hotline und aktive Produktsuche in unseren regionalen Netzwerken – wir finden, was Sie brauchen
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5 text-sm text-gray-500">
            🌐 Kategorien
          </div>

          {categories.map((cat) => (
            <Link
              href="/marketplace"
              key={cat}
              className="flex items-center justify-between border-b px-5 py-4 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span>{cat}</span>
              <span className="text-gray-300">›</span>
            </Link>
          ))}
        </aside>

        <div>
          <div className="flex overflow-hidden rounded-xl border bg-white shadow-sm">
            <input
              placeholder="Search for products"
              className="w-full px-5 py-4 text-sm outline-none"
            />
            <button className="bg-orange-400 px-6 text-xl text-white">
              🔍
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-gray-100 p-5">
            <h2 className="inline-block border-b-2 border-orange-400 pb-2 text-xl font-black uppercase text-red-600">
              Hit Angebot der Woche
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl border border-orange-300 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gray-100 text-gray-400">
                        Produktbild
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded bg-black px-3 py-1 text-xs font-bold text-white">
                      {item.category || "B2B"}
                    </span>
                  </div>

                  <div className="p-5">
                    <Link href={`/item/${item.id}`}>
                      <h3 className="font-black group-hover:underline">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      Land: {item.country || "Nicht angegeben"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Kategorie: {item.category || "Allgemein"}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-500">
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
              className="mt-6 block rounded-xl bg-black px-6 py-4 text-center font-black uppercase text-white"
            >
              Alle Produkte ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
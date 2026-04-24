import { getItems } from "@/lib/api";
import AddToRequestButton from "../components/AddToRequestButton";
import Link from "next/link";

// SOLUȚIE: Adăugăm revalidate pentru a permite build-ul static. 
// Aceasta va reîmprospăta datele de la WordPress la fiecare 60 de secunde.
export const revalidate = 60; 

export default async function MarketplacePage() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-teal-900 px-6 py-14 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-cyan-300">
            TrustBridge B2B Network
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight">
            Marketplace
          </h1>
          <p className="mt-4 text-white/80">
            Produkte, Dienstleistungen und Beschaffungspositionen sammeln und als
            strukturierte Anfrage senden.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5 text-sm text-gray-500">🌐 Kategorien</div>

          {[
            "Haus & Garten",
            "Haushaltsgeräte",
            "Automobil",
            "Food",
            "Non-Food",
            "Baustoffe",
            "Maschinen",
            "Dienstleistungen",
          ].map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between border-b px-5 py-4 font-semibold text-gray-700"
            >
              <span>{cat}</span>
              <span className="text-gray-300">›</span>
            </div>
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

          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="inline-block border-b-2 border-orange-400 pb-2 text-xl font-black uppercase text-red-600">
              Verfügbare Artikel / Services
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                        Produktbild
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded bg-black px-3 py-1 text-xs font-bold text-white">
                      B2B
                    </div>
                  </div>

                  <div className="p-5">
                    <Link href={`/item/${item.id}`}>
                      <h3 className="text-lg font-black group-hover:underline">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm text-gray-500">
                      Land: {item.country || "Nicht angegeben"}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-gray-700">
                        Min: {item.min_qty || "-"}
                      </span>

                      <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
                        {item.price_status === "request"
                          ? "Preis auf Anfrage"
                          : item.price_status || "auf Anfrage"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      <AddToRequestButton item={item} />

                      <Link
                        href={`/item/${item.id}`}
                        className="block text-center text-sm font-bold text-gray-600 hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
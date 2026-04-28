"use client";
import AddToRequestButton from "../components/AddToRequestButton";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

const countries = ["Österreich", "Ungarn", "Schweiz", "Deutschland", "Rumänien"];
const priorities = [
  "geprüfte Anbieter",
  "schneller Lieferbeginn",
  "Preis im Fokus",
  "langfristige Partnerschaft",
  "zertifizierte Qualität",
];

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(`${API}/items`, { cache: "no-store" });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Marketplace error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.title || ""} ${item.description || ""} ${
        item.category || ""
      } ${item.country || ""}`.toLowerCase();

      const matchesQuery = !query || text.includes(query.toLowerCase());
      const matchesCategory = !category || item.category === category || item.type === category;
      const matchesCountry = !country || item.country === country;

      return matchesQuery && matchesCategory && matchesCountry;
    });
  }, [items, query, category, country]);

  

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            TrustBridge Beschaffung
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Von unsicheren Kontakten zu sicheren Geschäften.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
            Finden Sie geprüfte Anbieter, Produkte und Dienstleistungen – oder
            starten Sie eine geführte Anfrage, wenn Ihr Bedarf komplexer ist.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/guided-request"
              className="rounded-xl bg-white px-6 py-4 text-center font-black uppercase text-[#0b5f5d] hover:bg-slate-100"
            >
              Geführte Anfrage starten
            </Link>

            <Link
              href="/request-basket"
              className="rounded-xl border border-white/30 px-6 py-4 text-center font-black uppercase text-white hover:bg-white/10"
            >
              Anfragekorb öffnen
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Was möchten Sie beschaffen?</h2>

          <p className="mt-2 text-slate-600">
            Produkt, Dienstleistung oder Kategorie eingeben.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="z. B. Sonnenblumenöl, Stückguttransport, Baustoffe…"
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            >
              <option value="">Alle Kategorien</option>
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
              <option value="Dienstleistung">Dienstleistungen</option>
              <option value="product">Produkte</option>
              <option value="service">Services</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            >
              <option value="">Alle Länder</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <CategoryCard
            icon="🟢"
            title="Food"
            text="Lebensmittel, Rohstoffe, Getränke, Frisch- und Tiefkühlware."
            onClick={() => setCategory("Food")}
          />
          <CategoryCard
            icon="🟡"
            title="Non-Food"
            text="Baustoffe, Maschinen, technische Produkte, Restposten."
            onClick={() => setCategory("Non-Food")}
          />
          <CategoryCard
            icon="🔵"
            title="Dienstleistungen"
            text="Transport, Logistik, Montage, Energie, Beratung."
            onClick={() => setCategory("Dienstleistung")}
          />
          <CategoryCard
            icon="🔴"
            title="Auktionen"
            text="Sonderposten, Projektmengen, zeitlich begrenzte Angebote."
            onClick={() => alert("Auktionen kommen später.")}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">Filtern Sie Ihre Suche</h3>

            <div className="mt-6">
              <p className="font-black">Wo möchten Sie beschaffen?</p>
              <div className="mt-3 space-y-2 text-sm">
                {countries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(country === c ? "" : c)}
                    className={`block w-full rounded-lg border px-3 py-2 text-left ${
                      country === c ? "border-[#108280] bg-[#108280]/10" : ""
                    }`}
                  >
                    {country === c ? "☑" : "☐"} {c}
                  </button>
                ))}
                <button
                  onClick={() => setCountry("")}
                  className="block w-full rounded-lg border px-3 py-2 text-left"
                >
                  ☐ in allen Ländern
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-black">Was ist Ihnen wichtig?</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {priorities.map((p) => (
                  <div key={p}>☐ {p}</div>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                  Ergebnisse / Empfehlungen
                </p>
                <h2 className="text-2xl font-black">
                  {loading
                    ? "Angebote werden geladen..."
                    : `${filteredItems.length} Angebote gefunden`}
                </h2>
              </div>

              <Link
                href="/guided-request"
                className="hidden rounded-xl bg-slate-950 px-5 py-3 text-sm font-black uppercase text-white hover:bg-slate-800 md:block"
              >
                Nicht sicher? Geführte Anfrage
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 rounded-3xl border bg-white p-8 text-slate-500">
                Lade Angebote...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="mt-6 rounded-3xl border bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-black">
                  Kein passendes Angebot gefunden.
                </h3>
                <p className="mt-2 text-slate-500">
                  Starten Sie eine geführte Anfrage. TrustBridge sucht passende
                  Anbieter für Sie.
                </p>
                <Link
                  href="/guided-request"
                  className="mt-5 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black uppercase text-white"
                >
                  Geführte Anfrage starten
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-slate-100 text-slate-400">
                        Kein Bild
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                            {item.country || "-"} | {item.category || item.type || "-"}
                          </p>
                          <h3 className="mt-2 text-xl font-black">
                            {item.title}
                          </h3>
                        </div>

                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                          {item.price_status === "request"
                            ? "Preis auf Anfrage"
                            : item.price_status || "auf Anfrage"}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.description || "Keine Beschreibung vorhanden."}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <Info label="Anbieter" value={item.supplier_name || "-"} />
                        <Info
                          label="Mindestmenge"
                          value={`${item.min_qty || "-"} ${item.unit || ""}`}
                        />
                      </div>

                      <div className="mt-6 flex gap-2">
                       <div className="flex-1">
  <AddToRequestButton item={item} />
</div>

                        <Link
                          href={`/marketplace/details?id=${item.id}`}
                          className="rounded-xl border px-2 py-3 text-sm font-black uppercase hover:bg-slate-50"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white">
          <h2 className="text-3xl font-black">
            Sind Sie nicht sicher, wie Sie suchen sollen?
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-white/75">
            Wenn Ihr Bedarf komplex ist, mehrere Anbieter, Länder oder
            Zusatzleistungen umfasst, empfehlen wir eine geführte Anfrage.
            TrustBridge hilft Ihnen, passende Anbieter zu identifizieren,
            Angebote vergleichbar zu machen und Risiken frühzeitig zu erkennen.
          </p>

          <Link
            href="/guided-request"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-4 font-black uppercase text-slate-950 hover:bg-slate-100"
          >
            Geführte Anfrage starten
          </Link>
        </div>
      </section>
    </main>
  );
}

function CategoryCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      <span className="mt-4 inline-block font-black text-[#108280]">
        Angebote ansehen →
      </span>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}
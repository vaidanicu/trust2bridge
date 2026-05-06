"use client";

import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function MarketplacePage({ dict, lang }: { dict: any, lang: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  const countries = ["Österreich", "Ungarn", "Schweiz", "Deutschland", "Rumänien"];
  const priorities = dict.marketplace?.priorities || [];

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

  // Funcție utilitară pentru randarea prețului unitar
 const renderItemPrice = (item: any) => {
  const priceValue = item.price || item.tb_price;
  const convertedPrice = formatConvertedPrice(priceValue, lang);

  if (convertedPrice) {
    return (
      <span className="text-xl font-black italic text-red-600 tracking-tighter">
        {convertedPrice}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase text-orange-700 border border-orange-200">
      {dict.common?.price_on_request || "Preis auf Anfrage"}
    </span>
  );
};

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.title || ""} ${item.description || ""} ${
        item.category || ""
      } ${item.country || ""}`.toLowerCase();

      const matchesQuery = !query || text.includes(query.toLowerCase());
      const matchesCategory =
        !category ||
        item.category === category ||
        item.type === category ||
        (category === "Dienstleistung" &&
          (item.category === "Dienstleistungen" || item.type === "service"));
      const matchesCountry = !country || item.country === country;

      return matchesQuery && matchesCategory && matchesCountry;
    });
  }, [items, query, category, country]);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white border-b-4 border-slate-900 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            {dict.marketplace?.badge || "TrustBridge B2B"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl italic uppercase">
            {dict.marketplace?.hero_title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85 font-medium">
            {dict.marketplace?.hero_subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link 
              href={`/${lang}/offer-create`} 
              className="rounded-xl bg-white px-8 py-4 text-center font-black uppercase text-[#0b5f5d] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all active:shadow-none"
            >
              {dict.marketplace?.button_guided}
            </Link>
            <Link 
              href={`/${lang}/request-basket`} 
              className="rounded-xl border-2 border-white px-8 py-4 text-center font-black uppercase text-white hover:bg-white/10 transition-all"
            >
              {dict.marketplace?.button_basket}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Search Bar & Primary Filters */}
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase italic">{dict.marketplace?.search_title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.marketplace?.search_placeholder}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none focus:ring-4 ring-[#108280]/10"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none bg-white cursor-pointer"
            >
              <option value="">{dict.marketplace?.all_categories}</option>
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
              <option value="Dienstleistung">Dienstleistung</option>
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none bg-white cursor-pointer"
            >
              <option value="">{dict.marketplace?.all_countries}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Items */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          
          {/* Sidebar Filters */}
          <aside className="h-fit space-y-6">
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase italic">{dict.marketplace?.filter_title}</h3>
              
              <div className="mt-6">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">{dict.marketplace?.filter_where}</p>
                <div className="space-y-2 text-sm">
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountry(country === c ? "" : c)}
                      className={`block w-full rounded-xl border-2 px-4 py-3 text-left font-bold transition-all ${
                        country === c ? "border-[#108280] bg-[#108280]/10 text-[#108280]" : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {country === c ? "●" : "○"} {c}
                    </button>
                  ))}
                  <button
                    onClick={() => setCountry("")}
                    className="block w-full rounded-xl border-2 border-slate-100 px-4 py-3 text-left font-bold hover:border-slate-300"
                  >
                    ○ {dict.marketplace?.all_countries}
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">{dict.marketplace?.filter_important}</p>
                <div className="space-y-2 text-sm font-bold text-slate-600">
                  {priorities.map((p: string) => (
                    <div key={p} className="flex items-center gap-2 px-2 py-1">
                      <span className="text-[#108280]">☐</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guided Help Callout */}
            <div className="rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
               <p className="text-xs font-black uppercase text-white/50 tracking-widest">Hilfe benötigt?</p>
               <h4 className="mt-2 font-black italic uppercase leading-tight">Nicht sicher, was Sie brauchen?</h4>
               <Link href={`/${lang}/guided-request`} className="mt-4 block rounded-lg bg-[#108280] p-3 text-center text-xs font-black uppercase hover:bg-[#0d6b69] transition-colors">
                 Guided Request →
               </Link>
            </div>
          </aside>

          {/* Results Grid */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                  {dict.marketplace?.results_label}
                </p>
                <h2 className="text-3xl font-black uppercase italic">
                  {loading ? "..." : `${filteredItems.length} ${dict.marketplace?.results_found}`}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-3xl border-2 border-slate-200 bg-white animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-3xl border-4 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
                <h3 className="text-2xl font-black uppercase italic">{dict.marketplace?.no_results}</h3>
                <p className="mt-2 font-medium text-slate-500">{dict.marketplace?.hero_subtitle}</p>
                <button onClick={() => {setQuery(""); setCategory(""); setCountry("");}} className="mt-6 font-black text-[#108280] uppercase underline underline-offset-4">Filter zurücksetzen</button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col rounded-3xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none overflow-hidden"
                  >
                    {/* Media Container */}
                    <div className="relative h-56 w-full border-b-4 border-slate-900 bg-slate-50">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center italic text-slate-300 font-bold uppercase tracking-widest">
                          {dict.common?.no_image || "Kein Bild"}
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-lg bg-white border-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {item.country || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#108280]">
                            {item.category || item.type || "Allgemein"}
                          </p>
                          <h3 className="mt-1 text-2xl font-black leading-tight text-slate-900 group-hover:text-[#108280] transition-colors line-clamp-2 uppercase italic">
                            {item.title}
                          </h3>
                        </div>
                        {/* Unit Price Display */}
                        <div className="text-right">
                          {renderItemPrice(item)}
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">
                        {item.description || dict.marketplace?.no_description}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <InfoCard label={dict.marketplace?.info_supplier} value={item.supplier_name || "TrustBridge"} />
                        <InfoCard 
                          label={dict.marketplace?.info_min_qty} 
                          value={`${item.min_qty || "1"} ${item.unit || "Unit"}`} 
                        />
                      </div>

                      <div className="mt-6 flex items-stretch gap-3">
  {/* Butonul de Coș - flex-1 pentru a ocupa spațiul disponibil egal */}
  <div className="flex-1 min-h-[56px] flex">
    <AddToRequestButton item={item} dict={dict} lang={lang} />
  </div>

  {/* Butonul de Detalii - flex-1 și aliniere verticală */}
  <Link
    href={`/${lang}/details?id=${item.id}`}
    className="flex-1 flex items-center justify-center min-h-[56px] rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-center text-xs font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-slate-50"
  >
    {dict.marketplace?.details_btn || "Details"}
  </Link>
</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 rounded-[3rem] border-4 border-slate-900 bg-slate-950 p-12 text-white shadow-[12px_12px_0px_0px_rgba(16,130,128,1)]">
          <h2 className="text-4xl font-black uppercase italic leading-none">{dict.marketplace?.footer_title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 font-medium">{dict.marketplace?.footer_text}</p>
          <Link
            href={`/${lang}/offer-create`}
            className="mt-10 inline-block rounded-2xl bg-white px-10 py-5 font-black uppercase text-slate-950 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:translate-y-1 transition-all"
          >
            {dict.marketplace?.button_guided}
          </Link>
        </div>
      </section>
    </main>
  );
}

// Sub-componente interne
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-slate-100 bg-slate-50/50 p-3">
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">{label}</p>
      <p className="mt-1 font-bold text-slate-800 truncate leading-tight">{value}</p>
    </div>
  );
}
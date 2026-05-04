"use client";
import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function MarketplacePage({ dict, lang }: { dict: any, lang: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  // Folosim listele traduse din JSON
  const countries = ["Österreich", "Ungarn", "Schweiz", "Deutschland", "Rumänien"];
  const priorities = dict.marketplace.priorities || [];

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
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            {dict.marketplace.badge}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {dict.marketplace.hero_title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
            {dict.marketplace.hero_subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${lang}/offer-create`}
              className="rounded-xl bg-white px-6 py-4 text-center font-black uppercase text-[#0b5f5d] hover:bg-slate-100"
            >
              {dict.marketplace.button_guided}
            </Link>

            <Link
              href={`/${lang}/request-basket`}
              className="rounded-xl border border-white/30 px-6 py-4 text-center font-black uppercase text-white hover:bg-white/10"
            >
              {dict.marketplace.button_basket}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">{dict.marketplace.search_title}</h2>

          <p className="mt-2 text-slate-600">
            {dict.marketplace.search_desc}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.marketplace.search_placeholder}
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            >
              <option value="">{dict.marketplace.all_categories}</option>
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
              <option value="Dienstleistung">{dict.home.categories[7]}</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border p-4 outline-none focus:border-[#108280]"
            >
              <option value="">{dict.marketplace.all_countries}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <CategoryCard
            icon="🟢"
            title="Food"
            text={dict.marketplace.cat_food_text}
            onClick={() => setCategory("Food")}
            btnText={dict.marketplace.view_offers}
          />
          <CategoryCard
            icon="🟡"
            title="Non-Food"
            text={dict.marketplace.cat_nonfood_text}
            onClick={() => setCategory("Non-Food")}
            btnText={dict.marketplace.view_offers}
          />
          <CategoryCard
            icon="🔵"
            title={dict.home.categories[7]}
            text={dict.marketplace.cat_service_text}
            onClick={() => setCategory("Dienstleistung")}
            btnText={dict.marketplace.view_offers}
          />
          <CategoryCard
            icon="🔴"
            title={dict.home.action_auction_title}
            text={dict.home.action_auction_desc}
            onClick={() => alert(dict.home.action_auction_desc)}
            btnText={dict.marketplace.view_offers}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">{dict.marketplace.filter_title}</h3>

            <div className="mt-6">
              <p className="font-black">{dict.marketplace.filter_where}</p>
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
                  ☐ {dict.marketplace.all_countries}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-black">{dict.marketplace.filter_important}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {priorities.map((p: string) => (
                  <div key={p}>☐ {p}</div>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                  {dict.marketplace.results_label}
                </p>
                <h2 className="text-2xl font-black">
                  {loading
                    ? dict.marketplace.loading
                    : `${filteredItems.length} ${dict.marketplace.results_found}`}
                </h2>
              </div>

              <Link
                href={`/${lang}/guided-request`}
                className="hidden rounded-xl bg-slate-950 px-5 py-3 text-sm font-black uppercase text-white hover:bg-slate-800 md:block"
              >
                {dict.marketplace.not_sure_btn}
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 rounded-3xl border bg-white p-8 text-slate-500">
                {dict.marketplace.loading}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="mt-6 rounded-3xl border bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-black">{dict.marketplace.no_results}</h3>
                <p className="mt-2 text-slate-500">{dict.marketplace.hero_subtitle}</p>
                <Link
                  href={`/${lang}/guided-request`}
                  className="mt-5 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black uppercase text-white"
                >
                  {dict.marketplace.button_guided}
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
                      <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-slate-100 text-slate-400">
                        {dict.common.no_image}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                            {item.country || "-"} | {item.category || item.type || "-"}
                          </p>
                          <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                        </div>

                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                          {item.price_status === "request"
                            ? dict.common.price_on_request
                            : item.price_status || dict.common.price_on_request}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.description || dict.marketplace.no_description}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <Info label={dict.marketplace.info_supplier} value={item.supplier_name || "-"} />
                        <Info
                          label={dict.marketplace.info_min_qty}
                          value={`${item.min_qty || "-"} ${item.unit || ""}`}
                        />
                      </div>

                      <div className="mt-6 flex gap-2">
                        <div className="flex-1">
                          <AddToRequestButton item={item} dict={dict} lang={lang} />
                        </div>
                        <Link
  href={`/${lang}/details?id=${item.id}`} // Elimină "/marketplace" din mijloc
  className="rounded-xl border px-2 py-3 text-sm font-black uppercase hover:bg-slate-50"
>
  {dict.marketplace.details_btn}
</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer section */}
        <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white">
          <h2 className="text-3xl font-black">{dict.marketplace.footer_title}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-white/75">{dict.marketplace.footer_text}</p>
          <Link
            href={`/${lang}/offer-create`}
            className="mt-6 inline-block rounded-xl bg-white px-6 py-4 font-black uppercase text-slate-950 hover:bg-slate-100"
          >
            {dict.marketplace.button_guided}
          </Link>
        </div>
      </section>
    </main>
  );
}

function CategoryCard({ icon, title, text, onClick, btnText }: any) {
  return (
    <button onClick={onClick} className="rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      <span className="mt-4 inline-block font-black text-[#108280]">
        {btnText} →
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
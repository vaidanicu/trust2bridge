import Link from "next/link";
import { getItems } from "@/lib/api";
import AddToRequestButton from "../components/AddToRequestButton";
import { getDictionary } from "@/lib/dictionary";

export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  // Extragem limba curentă și dicționarul
  const { lang } = await params;
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');

  const items = await getItems();

  // Categoriile vin acum direct din JSON-ul de limbă
  const categories = dict.home.categories;

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
              {dict.home.network_badge}
            </div>

            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
              {dict.home.hero_title}
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium text-white/90">
              {dict.home.hero_subtitle}
            </p>

            <Link
              href={`/${lang}/marketplace`}
              className="mt-8 inline-block rounded-xl bg-cyan-400 px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-lg transition hover:bg-cyan-300"
            >
              {dict.home.explore_button}
            </Link>

            <p className="mt-6 max-w-xl text-sm font-semibold text-white/80">
              {dict.home.trust_text}
            </p>
          </div>

          {/* RIGHT SIDE (CARD) */}
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg border border-white/20 shadow-xl">
            <h2 className="text-lg font-black uppercase text-yellow-300">
              {dict.home.service_hub_title}
            </h2>

            <div className="mt-5 space-y-3 text-white font-semibold">
              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
                <span>{dict.countries.germany}</span>
                <span className="text-sm text-white/70">Service-Hub</span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
                <span>{dict.countries.hungary}</span>
                <span className="text-sm text-white/70">Service-Hub</span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-3">
                <span>{dict.countries.romania}</span>
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
            {dict.home.categories_label}
          </div>

          {categories.map((cat: string) => (
            <Link
              href={`/${lang}/marketplace?category=${encodeURIComponent(cat)}`}
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
              placeholder={dict.home.search_placeholder}
              className="w-full px-5 py-4 text-sm outline-none"
            />
            <Link
              href={`/${lang}/marketplace`}
              className="bg-orange-400 px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-orange-500"
            >
              {dict.home.search_button}
            </Link>
          </div>

          {/* ACTION CARDS */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link
              href={`/${lang}/marketplace`}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase text-cyan-600">
                {dict.home.action_buy_label}
              </p>
              <h3 className="mt-2 font-black">{dict.home.action_buy_title}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {dict.home.action_buy_desc}
              </p>
            </Link>

            <Link
              href={`/${lang}/request`}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase text-orange-500">
                {dict.home.action_search_label}
              </p>
              <h3 className="mt-2 font-black">{dict.home.action_search_title}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {dict.home.action_search_desc}
              </p>
            </Link>

            <div className="rounded-2xl border bg-white p-5 opacity-70 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">
                {dict.home.action_auction_label}
              </p>
              <h3 className="mt-2 font-black">{dict.home.action_auction_title}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {dict.home.action_auction_desc}
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
                  {dict.home.featured_title}
                </h2>
              </div>

              <Link
                href={`/${lang}/marketplace`}
                className="hidden rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase text-white md:block"
              >
                {dict.home.view_all}
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/${lang}/item/${item.id}`} className="block">
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                          {dict.common.no_image}
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {item.category || "B2B"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`/${lang}/item/${item.id}`}>
                      <h3 className="line-clamp-2 min-h-[48px] font-black leading-snug text-slate-950 group-hover:text-cyan-700">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                      <p>{dict.common.country}: {item.country || dict.common.not_specified}</p>
                      <p>{dict.common.category}: {item.category || dict.common.general}</p>
                    </div>

                    <p className="mt-3 text-sm font-black text-orange-500">
                      {item.price_status === "request"
                        ? dict.common.price_on_request
                        : item.price_status || dict.common.price_on_request}
                    </p>

                    <div className="mt-4">
                      <AddToRequestButton item={item} dict={dict} lang={lang} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${lang}/marketplace`}
              className="mt-6 block rounded-xl bg-slate-950 px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-white md:hidden"
            >
              {dict.home.view_all}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
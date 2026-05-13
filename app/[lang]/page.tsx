import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import HomeFeaturedProducts from "../components/HomeFeaturedProducts";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "de" | "ro" | "hu");

  const categories = dict.home.categories || [];

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="relative overflow-hidden bg-[url('/poze/Background.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b5f5d]/95 via-[#108280]/85 to-[#0a3f3e]/90" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
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

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
            <h2 className="text-lg font-black uppercase text-yellow-300">
              {dict.home.service_hub_title}
            </h2>

            <div className="mt-5 space-y-3 font-semibold text-white">
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
                <span className="text-sm text-white/70">
                  Service-Coordination
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b bg-slate-950 px-5 py-4 text-sm font-black uppercase tracking-wider text-white">
            {dict.home.categories_label}
          </div>

          {categories.map((cat: string) => (
            <Link
              href={`/${lang}/marketplace?category=${encodeURIComponent(cat)}`}
              key={cat}
              className="flex items-center justify-between border-b px-5 py-4 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-[#108280]"
            >
              <span>{cat}</span>
              <span className="text-slate-300">›</span>
            </Link>
          ))}
        </aside>

        <div className="space-y-6">
          <form
  action={`/${lang}/marketplace`}
  method="GET"
  className="flex overflow-hidden rounded-2xl border bg-white shadow-sm"
>
  <input
    name="q"
    placeholder={dict.home.search_placeholder}
    className="w-full px-5 py-4 text-sm outline-none"
  />

  <button
    type="submit"
    className="flex items-center bg-orange-400 px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-orange-500"
  >
    {dict.home.search_button}
  </button>
</form>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href={`/${lang}/marketplace`}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase text-[#108280]">
                {dict.home.action_buy_label}
              </p>
              <h3 className="mt-2 font-black">
                {dict.home.action_buy_title}
              </h3>
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
              <h3 className="mt-2 font-black">
                {dict.home.action_search_title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {dict.home.action_search_desc}
              </p>
            </Link>

            <div className="rounded-2xl border bg-white p-5 opacity-70 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">
                {dict.home.action_auction_label}
              </p>
              <h3 className="mt-2 font-black">
                {dict.home.action_auction_title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {dict.home.action_auction_desc}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
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
                className="hidden rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase text-white hover:bg-slate-800 md:block"
              >
                {dict.home.view_all}
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <HomeFeaturedProducts dict={dict} lang={lang} />
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
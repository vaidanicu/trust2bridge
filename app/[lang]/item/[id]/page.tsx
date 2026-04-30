import Link from "next/link";
import AddToRequestButton from "../../../components/AddToRequestButton";
import ProductGallery from "../../../components/ProductGallery";
import { getDictionary } from "@/lib/dictionary";

async function getItem(id: string) {
  try {
    const res = await fetch(
      `https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items/${id}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// Generăm rutele pentru TOATE limbile și TOATE produsele
export async function generateStaticParams() {
  try {
    const res = await fetch("https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items");
    const items = await res.json();
    const locales = ['de', 'ro', 'hu'];

    if (!Array.isArray(items)) return [];

    // Creează o rută pentru fiecare combinație limbă-produs
    return locales.flatMap((lang) =>
      items.map((item: any) => ({
        lang: lang,
        id: String(item.id),
      }))
    );
  } catch (error) {
    return [];
  }
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');
  const item = await getItem(id);

  if (!item || item.code === "not_found") {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">{dict.item_details.not_found_title}</h1>
          <Link
            href={`/${lang}/marketplace`}
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white"
          >
            {dict.item_details.back_to_marketplace}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {/* TOP BAR */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link
            href={`/${lang}/marketplace`}
            className="text-sm font-bold text-[#108280] hover:underline"
          >
            ← {dict.item_details.back_to_marketplace}
          </Link>
        </div>
      </section>

      {/* PRODUCT AREA */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-4 shadow-sm">
            <ProductGallery mainImage={item.image} gallery={item.gallery} />
          </div>

          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">{dict.item_details.description_label}</h2>
            <div
              className="prose prose-slate mt-4 max-w-none text-slate-600"
              dangerouslySetInnerHTML={{
                __html: item.description || dict.item_details.no_description,
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              TrustBridge B2B {dict.item_details.article_label}
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">
              {item.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
                {item.category || "B2B"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {item.country || dict.common.not_specified}
              </span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                {dict.common.price_on_request}
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4f6f8] p-5">
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{dict.common.country}</span>
                  <strong>{item.country || "-"}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{dict.common.category}</span>
                  <strong>{item.category || dict.common.general}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{dict.item_details.price_status}</span>
                  <strong>
                    {item.price_status === "request"
                      ? dict.common.price_on_request
                      : item.price_status || dict.common.price_on_request}
                  </strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{dict.marketplace.info_min_qty}</span>
                  <strong>{item.min_qty} {item.unit || ""}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <AddToRequestButton item={item} dict={dict} lang={lang} />
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              {dict.item_details.basket_help_text}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">{dict.item_details.benefits_title}</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#108280]/10 p-4">
                <h3 className="font-black text-[#108280]">{dict.marketplace.priorities[0]}</h3>
                <p className="mt-1 text-sm text-slate-600">{dict.item_details.benefit_1_desc}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <h3 className="font-black">{dict.item_details.benefit_2_title}</h3>
                <p className="mt-1 text-sm text-slate-600">{dict.item_details.benefit_2_desc}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
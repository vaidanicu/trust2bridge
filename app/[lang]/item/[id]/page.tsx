import Link from "next/link";
import AddToRequestButton from "../../../components/AddToRequestButton";
import ProductGallery from "../../../components/ProductGallery";
import { getDictionary } from "@/lib/dictionary";

// Forțăm Next.js să genereze pagini noi la cerere dacă nu au fost create la build
export const dynamicParams = false;

async function getItem(id: string) {
  try {
    const res = await fetch(
      `https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items/${id}`,
      { cache: "force-cache" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// ─── GENERARE PARAMETRI STATICI (PENTRU BUILD) ───
export async function generateStaticParams() {
  try {
    const res = await fetch("https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 0 } // Forțează date proaspete la build
    });

    if (!res.ok) {
      console.error(`Eroare API: Status ${res.status} pe ${res.url}`);
      return [];
    }

    const items = await res.json();
    
    // DEBUG: Verifică structura exactă a datelor
    console.log("Date primite de la API (primele 2):", JSON.stringify(items.slice(0, 2), null, 2));

    if (!Array.isArray(items)) {
      console.error("API-ul nu a returnat un array!");
      return [];
    }

    const locales = ['de', 'ro', 'hu'];
    const paths = locales.flatMap((lang) =>
      items.map((item: any) => ({
        lang: lang,
        id: String(item.id || item.ID), // Unele plugin-uri WP folosesc ID mare
      }))
    );

    console.log(`Build: Generăm ${paths.length} pagini (Limbi x Produse).`);
    return paths;
  } catch (error) {
    console.error("Eroare fatală la fetch in build:", error);
    return [];
  }
}
// ─── COMPONENTA PRINCIPALĂ ───
export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');
  const item = await getItem(id);

  // GESTIONARE PRODUS NEEXISTENT
  if (!item || item.code === "not_found") {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-20 flex items-center justify-center">
        <div className="max-w-md w-full rounded-[2rem] border-2 border-slate-900 bg-white p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase italic italic">{dict.item_details.not_found_title}</h1>
          <p className="mt-4 text-slate-500 font-bold">Acest produs nu mai este disponibil sau a fost mutat.</p>
          <Link
            href={`/${lang}/marketplace`}
            className="mt-8 inline-block w-full rounded-2xl border-2 border-slate-900 bg-[#108280] px-6 py-4 font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0d6b69] transition-all"
          >
            {dict.item_details.back_to_marketplace}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans pb-20">
      {/* NAVIGATION BAR */}
      <nav className="border-b-2 border-slate-900 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${lang}/marketplace`}
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-tighter text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-[#108280] text-white transition-transform group-hover:-translate-x-1">←</span>
            {dict.item_details.back_to_marketplace}
          </Link>
          <div className="hidden md:block text-[10px] font-black uppercase text-slate-400">
            TrustBridge B2B Network • Product ID: {item.internal_id || item.id}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT GRID */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
        
        {/* SIDE STÂNGA: IMAGINI ȘI DESCRIERE */}
        <div className="space-y-10">
          {/* GALERIE FOTO */}
          <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ProductGallery mainImage={item.image} gallery={item.gallery} />
          </div>

          {/* DESCRIERE DETALIATĂ */}
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tight">{dict.item_details.description_label}</h2>
              <div className="h-1 flex-1 bg-slate-900/5"></div>
            </div>
            <div
              className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 font-medium"
              dangerouslySetInnerHTML={{
                __html: item.description || dict.item_details.no_description,
              }}
            />
          </div>
        </div>

        {/* SIDE DREAPTA: ACTIONS & INFO (STICKY) */}
        <aside className="h-fit space-y-8 lg:sticky lg:top-24">
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#108280]">
                TrustBridge Verified Listing
              </span>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-950 italic uppercase">
                {item.title}
              </h1>
            </div>

            {/* BADGES */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-xl border-2 border-slate-900 bg-[#108280] px-4 py-1.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {item.category || "General"}
              </span>
              <span className="rounded-xl border-2 border-slate-900 bg-white px-4 py-1.5 text-xs font-black uppercase text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                📍 {item.country || dict.common.not_specified}
              </span>
            </div>

            {/* SPECIFICAȚII TEHNICE */}
            <div className="mt-10 space-y-4 rounded-3xl border-2 border-slate-900 bg-slate-50 p-6">
              <SpecRow label={dict.common.country} value={item.country || "-"} />
              <SpecRow label={dict.common.category} value={item.category || "-"} />
              <SpecRow 
                label={dict.item_details.price_status} 
                value={item.price_status === "request" ? dict.common.price_on_request : item.price_status} 
                highlight 
              />
              <SpecRow label={dict.marketplace.info_min_qty} value={`${item.min_qty} ${item.unit || ""}`} />
            </div>

            {/* BUTON ADĂUGARE ÎN COȘ */}
            <div className="mt-8">
              <AddToRequestButton item={item} dict={dict} lang={lang} />
            </div>

            <p className="mt-6 text-center text-[10px] font-bold leading-relaxed text-slate-400 uppercase tracking-tighter">
              {dict.item_details.basket_help_text}
            </p>
          </div>

          {/* BENEFICII BOX */}
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-slate-950 p-8 text-white shadow-[8px_8px_0px_0px_rgba(16,130,128,1)]">
            <h2 className="text-xl font-black uppercase italic tracking-tight">{dict.item_details.benefits_title}</h2>
            <div className="mt-6 space-y-6">
              <BenefitItem title={dict.marketplace.priorities[0]} desc={dict.item_details.benefit_1_desc} />
              <BenefitItem title={dict.item_details.benefit_2_title} desc={dict.item_details.benefit_2_desc} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

// ─── HELPERS ───

function SpecRow({ label, value, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
      <span className={`text-sm font-black ${highlight ? "text-[#108280]" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}

function BenefitItem({ title, desc }: any) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-black uppercase text-[#108280]">{title}</h3>
      <p className="text-xs font-medium text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
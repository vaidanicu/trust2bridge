import Link from "next/link";
import AddToRequestButton from "../../../components/AddToRequestButton";
import ProductGallery from "../../../components/ProductGallery";
import { getDictionary } from "@/lib/dictionary";

// Aceasta oprește încercarea de a genera pagini la cerere (server-side) 
// deoarece folosim output: export
export const dynamicParams = false;

// Funcție pentru a lua detaliile unui singur produs
async function getItem(id: string, lang: string) {
  try {
    const res = await fetch(
      `https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items/${id}?lang=${lang}`,
      {
        // NOTĂ: Am scos cache: "no-store" pentru că este interzis la static export
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// FUNCȚIA CRUCIALĂ PENTRU BUILD: Spune Next.js ce pagini să creeze
export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items",
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    if (!res.ok) {
      console.error(`Eroare API la build: Status ${res.status}`);
      return [];
    }

    const items = await res.json();

    if (!Array.isArray(items)) {
      console.error("API-ul nu a returnat un array de produse!");
      return [];
    }

    const locales = ["de", "ro", "hu"];

    // Generăm toate combinațiile posibile: /ro/item/1, /de/item/1, etc.
    const paths = locales.flatMap((lang) =>
      items.map((item: any) => ({
        lang: lang,
        id: String(item.id || item.ID),
      }))
    );

    return paths;
  } catch (error) {
    console.error("Eroare fatală în generateStaticParams:", error);
    return [];
  }
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as "de" | "ro" | "hu");
  const item = await getItem(id, lang);

  // Cazul în care produsul nu este găsit
  if (!item || item.code === "not_found") {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-20 flex items-center justify-center">
        <div className="max-w-md w-full rounded-[2rem] border-2 border-slate-900 bg-white p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase italic">
            {dict.item_details?.not_found_title || "Not Found"}
          </h1>
          <p className="mt-4 text-slate-500 font-bold">
            Acest produs nu mai este disponibil sau a fost mutat.
          </p>
          <Link
            href={`/${lang}/marketplace`}
            className="mt-8 inline-block w-full rounded-2xl border-2 border-slate-900 bg-[#108280] px-6 py-4 font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0d6b69] transition-all"
          >
            {dict.item_details?.back_to_marketplace || "Back"}
          </Link>
        </div>
      </main>
    );
  }

  // Normalizare date (asigurăm că avem toate câmpurile necesare)
  const normalizedItem = {
    ...item,
    supplier_id: item.supplier_id || item.supplier || item._tb_supplier || "",
    supplier_name: item.supplier_name || "",
    min_qty: item.min_qty || item.moq || "1",
    unit: item.unit || "Stück",
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans pb-20">
      {/* Navigation */}
      <nav className="border-b-2 border-slate-900 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${lang}/marketplace`}
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-tighter text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-[#108280] text-white transition-transform group-hover:-translate-x-1">
              ←
            </span>
            {dict.item_details.back_to_marketplace}
          </Link>
          <div className="hidden md:block text-[10px] font-black uppercase text-slate-400">
            TrustBridge B2B Network • ID: {normalizedItem.id}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_420px]">
        {/* Left Side: Images & Description */}
        <div className="space-y-10">
          <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ProductGallery
              mainImage={normalizedItem.image}
              gallery={normalizedItem.gallery}
            />
          </div>

          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tight">
                {dict.item_details.description_label}
              </h2>
              <div className="h-1 flex-1 bg-slate-900/5" />
            </div>
            <div
              className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 font-medium"
              dangerouslySetInnerHTML={{
                __html: normalizedItem.description || dict.item_details.no_description,
              }}
            />
          </div>
        </div>

        {/* Right Side: Info & Actions */}
        <aside className="h-fit space-y-8 lg:sticky lg:top-24">
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#108280]">
                TrustBridge Verified Listing
              </span>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-950 italic uppercase">
                {normalizedItem.title}
              </h1>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-xl border-2 border-slate-900 bg-[#108280] px-4 py-1.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {normalizedItem.category || "General"}
              </span>
              <span className="rounded-xl border-2 border-slate-900 bg-white px-4 py-1.5 text-xs font-black uppercase text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                📍 {normalizedItem.country || dict.common.not_specified}
              </span>
            </div>

            <div className="mt-10 space-y-4 rounded-3xl border-2 border-slate-900 bg-slate-50 p-6">
              <SpecRow label={dict.common.country} value={normalizedItem.country} />
              <SpecRow label={dict.common.category} value={normalizedItem.category} />
              <SpecRow 
                label={dict.item_details.price_status} 
                value={normalizedItem.price_status === "request" ? dict.common.price_on_request : normalizedItem.price_status} 
                highlight 
              />
              <SpecRow label={dict.marketplace.info_min_qty} value={`${normalizedItem.min_qty} ${normalizedItem.unit}`} />
            </div>

            <div className="mt-8">
              <AddToRequestButton item={normalizedItem} dict={dict} lang={lang} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

// Componente mici de ajutor
function SpecRow({ label, value, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
      <span className={`text-sm font-black ${highlight ? "text-[#108280]" : "text-slate-900"}`}>
        {value || "-"}
      </span>
    </div>
  );
}
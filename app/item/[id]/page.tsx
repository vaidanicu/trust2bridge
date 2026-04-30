import Link from "next/link";
import AddToRequestButton from "../../../components/AddToRequestButton"; // Ajustat path-ul conform imaginii (3 niveluri sus)
import ProductGallery from "../../../components/ProductGallery"; // Ajustat path-ul
import { getDictionary } from "@/lib/dictionary";

// 1. OBLIGATORIU pentru "output: export"
// Spune Next.js să nu caute pagini care nu au fost generate la build
export const dynamicParams = false;

async function getItem(id: string) {
  try {
    const res = await fetch(
      `https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items/${id}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// 2. REPARAT: Trebuie să returneze și "lang" și "id"
export async function generateStaticParams() {
  const locales = ['de', 'ro', 'hu']; // Limbi bazate pe fișierele tale din /lib

  try {
    const res = await fetch(
      "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items"
    );
    const items = await res.json();

    if (!Array.isArray(items)) return [];

    const paths = [];

    // Generăm fiecare combinație de limbă + produs
    locales.forEach((locale) => {
      items.forEach((item: any) => {
        paths.push({
          lang: locale,      // Mapat la [lang]
          id: String(item.id) // Mapat la [id]
        });
      });
    });

    console.log(`✅ Build: Generat ${paths.length} pagini de produs.`);
    return paths;
  } catch (error) {
    console.error("Eroare la generateStaticParams:", error);
    return [];
  }
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const item = await getItem(id);
  const dict = await getDictionary(lang as any);

  if (!item || item.code === "not_found") {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">{dict.item?.not_found || "Produkt existiert nicht."}</h1>
          <Link href={`/${lang}/marketplace`} className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white">
            {dict.item?.back_to_marketplace || "Zurück"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link href={`/${lang}/marketplace`} className="text-sm font-bold text-[#108280] hover:underline">
            ← {dict.item?.back_to_marketplace || "Zurück"}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-4 shadow-sm">
            <ProductGallery mainImage={item.image} gallery={item.gallery} />
          </div>
          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">{dict.item?.description || "Beschreibung"}</h2>
            <div className="prose prose-slate mt-4 max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: item.description || "..." }} />
          </div>
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">TrustBridge B2B</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950">{item.title}</h1>
            <div className="mt-7 rounded-2xl bg-[#f4f6f8] p-5 text-sm">
                <div className="flex justify-between py-1"><span>{dict.item?.country || "Land"}</span><strong>{item.country}</strong></div>
                <div className="flex justify-between py-1"><span>{dict.item?.min_qty || "Mindestmenge"}</span><strong>{item.min_qty} {item.unit}</strong></div>
            </div>
            <div className="mt-6">
              <AddToRequestButton item={item} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
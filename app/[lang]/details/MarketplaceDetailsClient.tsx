"use client";
import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function MarketplaceDetailsClient({ item: initialItem, dict, lang }: { item?: any; dict: any; lang: string }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Redenumim starea locală pentru a evita conflictul cu parametrul "item"
  const [fetchedItem, setFetchedItem] = useState<any>(initialItem);
  const [loading, setLoading] = useState(!initialItem);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const res = await fetch(`${API}/items/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.code) {
          setFetchedItem(null);
        } else {
          setFetchedItem(data);
        }
      } catch (error) {
        console.error("Item details error:", error);
        setFetchedItem(null);
      } finally {
        setLoading(false);
      }
    }

    // Încărcăm datele doar dacă nu le avem deja din Server Component sau dacă ID-ul se schimbă
    if (id && (!initialItem || initialItem.id !== id)) {
      loadItem();
    } else {
        setLoading(false);
    }
  }, [id, initialItem]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center font-black uppercase italic text-[#108280]">
        {dict.common?.loading || "Lade Details..."}
      </main>
    );
  }

  // Folosim fetchedItem (care conține fie datele inițiale, fie cele noi de la fetch)
  const displayItem = fetchedItem || initialItem;

  if (!displayItem) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-slate-900 bg-white p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black uppercase italic">
            {dict.item_details?.not_found_title || "Angebot nicht gefunden."}
          </h1>

          <Link
            href={`/${lang}/marketplace`}
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0d6b69]"
          >
            {dict.item_details?.back_to_marketplace || "Zurück zum Marketplace"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-[#00695c] px-6 py-12 text-white border-b-2 border-slate-900">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${lang}/marketplace`}
            className="text-sm font-bold text-white/80 hover:text-white"
          >
            ← {dict.item_details?.back_to_marketplace || "Zurück zum Marktplatz"}
          </Link>

          <p className="mt-6 text-xs font-black uppercase tracking-wider text-white/70">
            TrustBridge {dict.marketplace?.results_label || "Angebotsdetails"}
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black uppercase italic">
            {displayItem.title}
          </h1>

          <p className="mt-2 text-white/80 font-bold">
            {displayItem.country || "-"} · {displayItem.category || displayItem.type || "-"} ·{" "}
            {displayItem.price_status === "request"
              ? (dict.common?.price_on_request || "Preis auf Anfrage")
              : displayItem.price_status || (dict.common?.price_on_request || "Preis auf Anfrage")}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {displayItem.image ? (
              <img
                src={displayItem.image}
                alt={displayItem.title}
                className="h-[420px] w-full object-cover border-b-2 border-slate-900"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400 border-b-2 border-slate-900 italic">
                {dict.common?.no_image || "Kein Bild vorhanden"}
              </div>
            )}

            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {dict.item_details?.description_label || "Beschreibung"}
              </p>

              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 font-medium">
                {displayItem.description || (dict.marketplace?.no_description || "Keine Beschreibung vorhanden.")}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {dict.item_details?.benefits_title || "Beschaffungslogik"}
            </p>

            <h2 className="mt-1 text-2xl font-black uppercase italic">
              {dict.item_details?.benefit_2_title || "Dieses Angebot ist keine direkte Bestellung"}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 font-medium">
              {dict.item_details?.basket_help_text || "Sie können diese Position zu Ihrem Anfragekorb hinzufügen..."}
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              {dict.marketplace?.filter_title || "Übersicht"}
            </p>

            <h2 className="mt-1 text-xl font-black uppercase italic">{dict.marketplace?.results_label || "Angebotsdaten"}</h2>

            <div className="mt-5 space-y-3 text-sm">
              <DetailRow label={dict.basket?.label_id || "ID"} value={displayItem.internal_id || displayItem.id || "-"} />
              <DetailRow label={dict.basket?.label_type || "Typ"} value={displayItem.type || "-"} />
              <DetailRow label={dict.common?.category || "Kategorie"} value={displayItem.category || "-"} />
              <DetailRow label={dict.common?.country || "Land"} value={displayItem.country || "-"} />
              <DetailRow
                label={dict.basket?.label_supplier || "Anbieter"}
                value={displayItem.supplier_name || displayItem.supplier_id || "-"}
              />
              <DetailRow
                label={dict.marketplace?.info_min_qty || "Mindestmenge"}
                value={`${displayItem.min_qty || "-"} ${displayItem.unit || ""}`}
              />
              <DetailRow
                label={dict.item_details?.price_status || "Preisstatus"}
                value={
                  displayItem.price_status === "request"
                    ? (dict.common?.price_on_request || "Preis auf Anfrage")
                    : displayItem.price_status || "-"
                }
              />
            </div>

            <div className="mt-6">
             <AddToRequestButton item={displayItem} dict={dict} lang={lang} />
           </div>

            <Link
              href={`/${lang}/request-basket`}
              className="mt-3 block w-full rounded-xl border-2 border-slate-900 px-5 py-4 text-center text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {dict.nav?.basket_btn || "Anfragekorb öffnen"}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b-2 border-slate-100 pb-2">
      <span className="text-slate-500 font-bold uppercase text-[10px]">{label}</span>
      <strong className="text-right text-slate-900">{value}</strong>
    </div>
  );
}
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AddToRequestButton from "../../components/AddToRequestButton";
import { formatConvertedPrice } from "@/lib/currency";

const API_BASE_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

interface MarketplaceDetailsProps {
  item?: any;
  dict: any;
  lang: string;
}

export default function MarketplaceDetailsClient({ item: initialItem, dict, lang }: MarketplaceDetailsProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [item, setItem] = useState<any>(initialItem);
  const [isLoading, setIsLoading] = useState(!initialItem);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Toate pozele: main image + galerie, fără duplicate
  const allPhotos = useMemo(() => {
    const di = item || initialItem;
    if (!di) return [];
    const photos: string[] = [];
    if (di.image) photos.push(di.image);
    if (Array.isArray(di.gallery)) {
      di.gallery.forEach((url: string) => {
        if (url && !photos.includes(url)) photos.push(url);
      });
    }
    return photos;
  }, [item, initialItem]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id || (initialItem && initialItem.id === id)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/items/${id}?lang=${lang}`, {
  cache: "no-store",
});

        if (!response.ok) throw new Error("Failed to fetch item");

        const data = await response.json();
        
        if (data?.code) {
          setItem(null);
        } else {
          setItem(data);
        }
      } catch (err) {
        console.error("Item details error:", err);
        setError("Error loading details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, initialItem, lang]);

  // Formatare preț memorată pentru performanță
  const priceDisplay = useMemo(() => {
  const target = item || initialItem;
  if (!target) return "";

  const priceValue = target.price || target.tb_price;
  const convertedPrice = formatConvertedPrice(priceValue, lang);

  if (convertedPrice) {
    return convertedPrice;
  }

  return target.price_status === "request"
    ? dict.common?.price_on_request || "Preis auf Anfrage"
    : target.price_status || dict.common?.price_on_request || "Preis auf Anfrage";
}, [item, initialItem, dict, lang]);

  if (isLoading) return <LoadingState dict={dict} />;
  
  if (error || (!item && !initialItem)) return <NotFoundState dict={dict} lang={lang} />;

  const displayItem = item || initialItem;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Header Secțiune */}
      <header className="bg-[#00695c] px-6 py-14 text-white border-b-4 border-slate-900">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${lang}/marketplace`}
            className="group inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            {dict.item_details?.back_to_marketplace || "Zurück zum Marktplatz"}
          </Link>

          <div className="mt-8">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 border-2 border-slate-900">
              {displayItem.category || "Listing"}
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl md:text-5xl font-black uppercase italic leading-tight">
              {displayItem.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-lg font-bold text-white/90">
              <span>{displayItem.country || "-"}</span>
              <span className="hidden md:inline opacity-40">|</span>
              <span className="text-yellow-300">{priceDisplay}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_400px]">
        {/* Coloana Stângă: Media & Descriere */}
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            {/* Imagine principală */}
            <div
              className="relative aspect-video w-full bg-slate-100 cursor-zoom-in"
              onClick={() => {
                const src = activePhoto || allPhotos[0];
                if (src) setLightbox(src);
              }}
            >
              {(activePhoto || allPhotos[0]) ? (
                <img
                  src={activePhoto || allPhotos[0]}
                  alt={displayItem.title}
                  className="h-full w-full object-cover transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center italic text-slate-400">
                  {dict.common?.no_image || "Kein Bild vorhanden"}
                </div>
              )}
              {allPhotos.length > 0 && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-bold">
                  🔍 {allPhotos.indexOf(activePhoto || allPhotos[0]) + 1} / {allPhotos.length}
                </span>
              )}
            </div>

            {/* Thumbnails galerie — afișate întotdeauna când există mai mult de 1 poză */}
            {allPhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-slate-50 border-t-2 border-slate-200">
                {allPhotos.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      (activePhoto || allPhotos[0]) === url
                        ? "border-[#108280] scale-105 shadow-[3px_3px_0px_0px_#108280]"
                        : "border-slate-300 hover:border-slate-600 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#108280]">
                {dict.item_details?.description_label || "Beschreibung"}
              </h3>
              <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700 font-medium">
                {displayItem.description || (dict.marketplace?.no_description || "Keine Beschreibung vorhanden.")}
              </div>
            </div>
          </div>

          {/* Documente PDF — mutate după descriere, vizibile mereu dacă există */}
          {Array.isArray(displayItem.documents) && displayItem.documents.length > 0 && (
            <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 border-b-2 border-slate-900 bg-red-600 px-6 py-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {dict.item_details?.documents_label || "Dokumente & Zertifikate"}
                </h3>
                <span className="ml-auto bg-white text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                  {displayItem.documents.length}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {displayItem.documents.map((doc: any, i: number) => (
                  <li key={i}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800 truncate group-hover:text-[#108280] transition-colors">
                          {doc.name || `Document ${i + 1}`}
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">PDF</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-slate-300 group-hover:text-[#108280] transition-colors">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lightbox fullscreen */}
          {lightbox && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setLightbox(null)}
            >
              <button
                className="absolute top-4 right-5 text-white text-4xl font-black leading-none hover:text-yellow-300 transition-colors"
                onClick={() => setLightbox(null)}
              >×</button>
              {allPhotos.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-black hover:text-yellow-300 transition-colors px-2"
                    onClick={(e) => { e.stopPropagation(); const idx = allPhotos.indexOf(lightbox); setLightbox(allPhotos[(idx - 1 + allPhotos.length) % allPhotos.length]); }}
                  >‹</button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-black hover:text-yellow-300 transition-colors px-2"
                    onClick={(e) => { e.stopPropagation(); const idx = allPhotos.indexOf(lightbox); setLightbox(allPhotos[(idx + 1) % allPhotos.length]); }}
                  >›</button>
                </>
              )}
              <img
                src={lightbox}
                alt="preview"
                className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="absolute bottom-5 text-white/60 text-sm font-bold">
                {allPhotos.indexOf(lightbox) + 1} / {allPhotos.length}
              </span>
            </div>
          )}

          {/* Info Box */}
          <div className="rounded-3xl border-2 border-slate-900 bg-[#e0f2f1] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#108280]">
              {dict.item_details?.benefits_title || "Logistik & Abwicklung"}
            </h3>
            <h2 className="mt-2 text-2xl font-black uppercase italic leading-none">
              {dict.item_details?.benefit_2_title || "Anfragebasiert"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 font-medium">
              {dict.item_details?.basket_help_text || "Dies ist ein unverbindliches Angebot..."}
            </p>
          </div>
        </div>

        {/* Coloana Dreaptă: Sidebar Fix */}
        <aside>
          <div className="sticky top-8 space-y-6">
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase italic mb-6">
                {dict.marketplace?.results_label || "Produktdaten"}
              </h2>

              <div className="space-y-4">
                <DetailRow label={dict.basket?.label_id || "ID"} value={displayItem.internal_id || displayItem.id} />
                <DetailRow label={dict.basket?.label_type || "Typ"} value={displayItem.type} />
                <DetailRow label={dict.common?.country || "Herkunft"} value={displayItem.country} />
                <DetailRow 
                   label={dict.marketplace?.info_min_qty || "MOQ"} 
                   value={`${displayItem.min_qty || "-"} ${displayItem.unit || ""}`} 
                />
                <DetailRow label="Status" value={priceDisplay} isHighlight />
              </div>

              <div className="mt-8 space-y-4">
                <AddToRequestButton item={displayItem} dict={dict} lang={lang} />
                
                <Link
                  href={`/${lang}/request-basket`}
                  className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-900 bg-white px-6 py-4 font-black uppercase transition-all hover:bg-slate-50 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {dict.nav?.basket_btn || "Warenkorb"}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

// Componente Interne pentru Organizare
function DetailRow({ label, value, isHighlight = false }: { label: string; value: string; isHighlight?: boolean }) {
  return (
    <div className="flex flex-col border-b border-slate-100 pb-3">
      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{label}</span>
      <span className={`text-sm font-bold ${isHighlight ? "text-[#108280]" : "text-slate-900"}`}>
        {value || "-"}
      </span>
    </div>
  );
}

function LoadingState({ dict }: { dict: any }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#108280] border-t-transparent"></div>
        <p className="font-black uppercase italic text-[#108280] tracking-widest">
          {dict.common?.loading || "Laden..."}
        </p>
      </div>
    </div>
  );
}

function NotFoundState({ dict, lang }: { dict: any; lang: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-6">
      <div className="max-w-md w-full rounded-3xl border-2 border-slate-900 bg-white p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase italic tracking-tight">404</h1>
        <p className="mt-2 font-bold text-slate-600">{dict.item_details?.not_found_title || "Nicht gefunden"}</p>
        <Link
          href={`/${lang}/marketplace`}
          className="mt-8 inline-block w-full rounded-2xl bg-[#108280] px-8 py-4 font-black text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0d6b69] transition-colors"
        >
          {dict.item_details?.back_to_marketplace || "Zurück"}
        </Link>
      </div>
    </main>
  );
}
"use client";
import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function MarketplaceDetailsPage() {
 const searchParams = useSearchParams();
const id = searchParams.get("id");

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`${API}/items/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.code) {
          setItem(null);
        } else {
          setItem(data);
        }
      } catch (error) {
        console.error("Item details error:", error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadItem();
  }, [id]);

  function addToRequestBasket() {
    if (!item) return;

    const existing = JSON.parse(
      localStorage.getItem("trustbridge_request_basket") || "[]"
    );

    const alreadyExists = existing.some((x: any) => x.id === item.id);

    if (alreadyExists) {
      alert("Diese Position ist bereits im Anfragekorb.");
      return;
    }

    const basketItem = {
      ...item,
      quantity: item.min_qty || 1,
      unit: item.unit || "Stück",
      delivery_location: "",
      desired_date: "",
      customer_note: "",
    };

    localStorage.setItem(
      "trustbridge_request_basket",
      JSON.stringify([...existing, basketItem])
    );

    alert("Position wurde zum Anfragekorb hinzugefügt.");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] p-10">
        Lade Details...
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black">Angebot nicht gefunden.</h1>

          <Link
            href="/marketplace"
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white"
          >
            Zurück zum Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/marketplace"
            className="text-sm font-bold text-white/80 hover:text-white"
          >
            ← Zurück zum Marketplace
          </Link>

          <p className="mt-6 text-xs font-black uppercase tracking-wider text-white/70">
            TrustBridge Angebot
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black">
            {item.title}
          </h1>

          <p className="mt-2 text-white/80">
            {item.country || "-"} · {item.category || item.type || "-"} ·{" "}
            {item.price_status === "request"
              ? "Preis auf Anfrage"
              : item.price_status || "Preis auf Anfrage"}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400">
                Kein Bild vorhanden
              </div>
            )}

            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                Beschreibung
              </p>

              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                {item.description || "Keine Beschreibung vorhanden."}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              Beschaffungslogik
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Dieses Angebot ist keine direkte Bestellung
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sie können diese Position zu Ihrem Anfragekorb hinzufügen. Am Ende
              senden Sie keine Bestellung, sondern eine strukturierte
              Beschaffungsanfrage an TrustBridge. Das Team prüft die Anfrage und
              leitet sie bei Bedarf an passende Anbieter weiter.
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              Übersicht
            </p>

            <h2 className="mt-1 text-xl font-black">Angebotsdaten</h2>

            <div className="mt-5 space-y-3 text-sm">
              <DetailRow label="Interne ID" value={item.internal_id || "-"} />
              <DetailRow label="Typ" value={item.type || "-"} />
              <DetailRow label="Kategorie" value={item.category || "-"} />
              <DetailRow label="Land" value={item.country || "-"} />
              <DetailRow
                label="Anbieter"
                value={item.supplier_name || item.supplier_id || "-"}
              />
              <DetailRow
                label="Mindestmenge"
                value={`${item.min_qty || "-"} ${item.unit || ""}`}
              />
              <DetailRow
                label="Preisstatus"
                value={
                  item.price_status === "request"
                    ? "Preis auf Anfrage"
                    : item.price_status || "-"
                }
              />
              <DetailRow label="Status" value={item.status || "-"} />
            </div>

            <div className="flex-1">
             <AddToRequestButton item={item} />
           </div>

            <Link
              href="/request-basket"
              className="mt-3 block w-full rounded-xl border px-5 py-4 text-center text-sm font-black uppercase hover:bg-slate-50"
            >
              Anfragekorb öffnen
            </Link>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Komplexer Beschaffungsbedarf?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Wenn mehrere Länder, Anbieter oder Zusatzleistungen relevant sind,
              starten Sie besser eine geführte Anfrage.
            </p>

            <Link
              href="/guided-request"
              className="mt-5 block rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-slate-800"
            >
              Geführte Anfrage starten
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2">
      <span className="text-slate-500">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
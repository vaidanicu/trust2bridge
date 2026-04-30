"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

/**
 * COMPONENTA PRINCIPALĂ DE CONȚINUT
 * Aceasta folosește useSearchParams() și trebuie înfășurată în Suspense.
 */
function RequestDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [user, setUser] = useState<any>(null);
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    // Verificăm dacă suntem în browser (client-side)
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadRequest() {
      try {
        const meRes = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meData = await meRes.json();
        setUser(meData);

        const res = await fetch(`${API}/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const found = Array.isArray(data)
          ? data.find((req: any) => String(req.id) === String(id))
          : null;

        setRequestData(found || null);
      } catch (error) {
        console.error("Request details error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRequest();
    } else {
      setLoading(false);
    }
  }, [id, router]);

  // Funcție pentru trimiterea către furnizor
  async function sendToSupplier() {
    const token = localStorage.getItem("trustbridge_token");
    if (!confirm("Diese Anfrage wirklich an den Anbieter senden?")) return;

    setSendLoading(true);
    try {
      const res = await fetch(`${API}/request-send-to-supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: requestData.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Anfrage wurde an Anbieter gesendet.");
        window.location.reload();
      } else {
        alert(data.message || "Fehler beim Senden.");
      }
    } catch {
      alert("Serverfehler.");
    } finally {
      setSendLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] p-10">
        Lade Anfrage...
      </main>
    );
  }

  if (!requestData) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black">Anfrage nicht gefunden.</h1>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const items = requestData.items || [];
  const role = user?.roles?.[0];
  const isSupplier =
    user?.roles?.includes("tb_supplier") ||
    user?.roles?.includes("TrustBridge_Supplier");
  const isAdmin = role === "administrator";
  const hasOffer = Boolean(requestData.offer_price || requestData.offer_message);
  const isSubRequest = Boolean(requestData.parent_request);
  const canSendToSupplier =
    isAdmin &&
    isSubRequest &&
    requestData.status !== "sent_to_supplier" &&
    requestData.status !== "offer_received";

  const supplierCanOffer =
    isSupplier &&
    (requestData.status === "sent_to_supplier" ||
      requestData.status === "offer_received");

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-white/80 hover:text-white"
          >
            ← Zurück zum Dashboard
          </Link>
          <p className="mt-6 text-xs font-black uppercase tracking-wider text-white/70">
            TrustBridge Anfrage
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Anfrage #{requestData.id}
          </h1>
          <p className="mt-2 text-white/80">
            Datum: {requestData.date || "-"} · Status:{" "}
            {requestData.status || "pending_review"}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              Positionen
            </p>
            <h2 className="mt-1 text-2xl font-black">Produkte in dieser Anfrage</h2>
            {items.length === 0 ? (
              <p className="mt-5 rounded-2xl bg-slate-50 p-6 text-slate-500">
                Keine Produkte gefunden.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {items.map((item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
                          Position {index + 1}
                        </span>
                        <h3 className="mt-3 text-xl font-black">
                          {item.title || "Produkt"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Interne ID: {item.internal_id || "-"} · Kategorie:{" "}
                          {item.category || "-"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Land: {item.country || "-"} · Anbieter:{" "}
                          {item.supplier_name || item.supplier_id || "-"}
                        </p>
                      </div>
                      <span className="h-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                        {item.price_status === "request"
                          ? "Preis auf Anfrage"
                          : item.price_status || "Preis auf Anfrage"}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <InfoBox label="Menge" value={`${item.quantity || "1"} ${item.unit || ""}`} />
                      <InfoBox label="Lieferort" value={item.delivery_location || "-"} />
                      <InfoBox label="Termin" value={item.desired_date || "-"} />
                      <InfoBox label="Bemerkung" value={item.customer_note || "-"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasOffer && (
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-green-700">
                Angebot erhalten
              </p>
              <h2 className="mt-1 text-2xl font-black">Lieferantenangebot</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBox label="Preis / Angebot" value={requestData.offer_price || "-"} />
                <InfoBox label="Lieferzeit" value={requestData.offer_delivery_time || "-"} />
                <InfoBox label="Supplier" value={requestData.offer_supplier_email || "-"} />
                <InfoBox label="Datum" value={requestData.offer_created_at || "-"} />
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Nachricht</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {requestData.offer_message || "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Übersicht</p>
            <h2 className="mt-1 text-xl font-black">Anfragedaten</h2>
            <div className="mt-5 space-y-3 text-sm">
              <DetailRow label="Status" value={requestData.status || "pending_review"} />
              <DetailRow label="Firma" value={requestData.company || "-"} />
              <DetailRow label="E-Mail" value={requestData.email || "-"} />
              <DetailRow label="Zielland" value={requestData.delivery_country || "-"} />
              <DetailRow label="Transport" value={requestData.transport_needed || "-"} />
              <DetailRow label="Vertraulichkeit" value={requestData.confidentiality || "-"} />
              <DetailRow label="Sub-Anfrage" value={isSubRequest ? "Ja" : "Nein"} />
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Admin Steuerung</p>
              <h2 className="mt-1 text-xl font-black">Status ändern</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("trustbridge_token");
                  const formData = new FormData(e.currentTarget);
                  setStatusLoading(true);
                  try {
                    const res = await fetch(`${API}/request-status`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        request_id: requestData.id,
                        status: formData.get("status"),
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert("Status wurde aktualisiert.");
                      window.location.reload();
                    } else {
                      alert(data.message || "Fehler beim Aktualisieren.");
                    }
                  } catch {
                    alert("Serverfehler.");
                  } finally {
                    setStatusLoading(false);
                  }
                }}
                className="mt-5 space-y-4"
              >
                <select
                  name="status"
                  defaultValue={requestData.status || "pending_review"}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                >
                  <option value="pending_review">Wartet auf Prüfung</option>
                  <option value="nou">Neu</option>
                  <option value="processing">In Bearbeitung</option>
                  <option value="sent_to_partner">An Partner weitergeleitet</option>
                  <option value="sent_to_supplier">An Anbieter gesendet</option>
                  <option value="offer_received">Angebot erhalten</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="rejected">Abgelehnt</option>
                </select>
                <button
                  disabled={statusLoading}
                  className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black uppercase text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {statusLoading ? "Wird gespeichert..." : "Status speichern"}
                </button>
              </form>

              {canSendToSupplier && (
                <button
                  onClick={sendToSupplier}
                  disabled={sendLoading}
                  className="mt-4 w-full rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50"
                >
                  {sendLoading ? "Wird gesendet..." : "An Anbieter senden"}
                </button>
              )}
              {!isSubRequest && (
                <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-xs font-bold text-yellow-700">
                  Hinweis: An Anbieter senden funktioniert nur bei Sub-Anfragen.
                </p>
              )}
            </div>
          )}

          {supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Lieferantenangebot</p>
              <h2 className="mt-1 text-xl font-black">Angebot abgeben</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("trustbridge_token");
                  const formData = new FormData(e.currentTarget);
                  setOfferLoading(true);
                  try {
                    const res = await fetch(`${API}/request-offer`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        request_id: requestData.id,
                        price: formData.get("price"),
                        delivery_time: formData.get("delivery_time"),
                        message: formData.get("message"),
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert("Angebot wurde gesendet.");
                      window.location.reload();
                    } else {
                      alert(data.message || "Fehler beim Senden.");
                    }
                  } catch {
                    alert("Serverfehler.");
                  } finally {
                    setOfferLoading(false);
                  }
                }}
                className="mt-5 space-y-4"
              >
                <input
                  name="price"
                  required
                  defaultValue={requestData.offer_price || ""}
                  placeholder="Preis / Angebot *"
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />
                <input
                  name="delivery_time"
                  defaultValue={requestData.offer_delivery_time || ""}
                  placeholder="Lieferzeit, z. B. 7-10 Tage"
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />
                <textarea
                  name="message"
                  rows={4}
                  defaultValue={requestData.offer_message || ""}
                  placeholder="Nachricht / Bedingungen"
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />
                <button
                  disabled={offerLoading}
                  className="w-full rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50"
                >
                  {offerLoading
                    ? "Wird gesendet..."
                    : hasOffer
                    ? "Angebot aktualisieren"
                    : "Angebot senden"}
                </button>
              </form>
            </div>
          )}

          {isSupplier && !supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Noch nicht freigegeben</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Diese Anfrage wurde noch nicht von TrustBridge zur Angebotsabgabe freigegeben.
              </p>
            </div>
          )}

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Nächster Schritt</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isSupplier
                ? "Bitte prüfen Sie die Anfrage und senden Sie ein Angebot an TrustBridge."
                : "TrustBridge prüft die Anfrage und leitet sie bei Bedarf an passende Partner oder Lieferanten weiter."}
            </p>
            <Link
              href={isSupplier ? "/dashboard" : "/marketplace"}
              className="mt-5 block rounded-xl bg-[#108280] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
            >
              {isSupplier ? "Zurück zum Dashboard" : "Weitere Produkte suchen"}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

/**
 * EXPORTUL PRINCIPAL
 * Înfășurăm conținutul în Suspense pentru a preveni eroarea de prerendering.
 */
export default function RequestDetailsPage() {
  return (
    <Suspense fallback={<div className="p-10 font-black">Lade Seite...</div>}>
      <RequestDetailsContent />
    </Suspense>
  );
}

/**
 * COMPONENTE DE AJUTOR (Helper components)
 */
function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
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
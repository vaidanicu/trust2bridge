"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBasket, saveBasket, BasketItem } from "@/lib/basket";

export default function RequestBasketPage() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setItems(getBasket());
  }, []);

  const updateItem = (id: number, field: keyof BasketItem, value: any) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    saveBasket(updated);
  };

  const removeItem = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveBasket(updated);
  };

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Der Anfragekorb ist leer.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      customer_name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      delivery_country: formData.get("country"),
      project_description: formData.get("description"),
      transport_needed: formData.get("transport"),
      confidentiality: formData.get("confidentiality"),
      items,
      services: formData.getAll("services"),
    };

    try {
      const res = await fetch(
        "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("trustbridge_token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

     if (data.success) {
  alert("Ihre Anfrage wurde erfolgreich gesendet! Anfrage-ID: " + data.request_id);

  localStorage.removeItem("trustbridge_request_basket");
  localStorage.removeItem("trustbridge_basket");

  window.dispatchEvent(new Event("trustbridge-basket-updated"));

  setItems([]);
  window.location.href = "/dashboard";
} else {
        alert(data.message || "Fehler beim Senden der Anfrage.");
      }
    } catch {
      alert("Verbindungsfehler zum Server.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-white/70">
            TrustBridge Anfragekorb
          </p>

          <h1 className="text-4xl font-black uppercase tracking-tight">
            Anfragekorb
          </h1>

          <p className="mt-4 max-w-3xl text-white/85">
            Prüfen Sie Ihre Positionen, ergänzen Sie Anforderungen und senden
            Sie eine strukturierte B2B-Anfrage.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                  Positionen
                </p>
                <h2 className="text-2xl font-black">Im Anfragekorb</h2>
              </div>

              <Link
                href="/marketplace"
                className="rounded-xl border px-4 py-3 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
              >
                Weitere Angebote
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">
                  Ihr Anfragekorb ist leer.
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Wählen Sie Angebote im Marktplatz aus und senden Sie danach
                  eine gebündelte Anfrage.
                </p>

                <Link
                  href="/marketplace"
                  className="mt-5 inline-block rounded-xl bg-[#108280] px-6 py-3 text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
                >
                  Zum Marktplatz
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black">{item.title}</h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Interne ID: {item.internal_id || "-"} · Typ:{" "}
                          {item.type || "Produkt"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Anbieter: {item.supplier_name || item.supplier_id || "-"} ·
                          Land: {item.country || "-"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Kategorie: {item.category || "-"}
                        </p>

                        <p className="mt-1 text-sm font-black text-orange-500">
                          {item.price_status === "request"
                            ? "Preis auf Anfrage"
                            : item.price_status || "Preis auf Anfrage"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="h-fit rounded-lg bg-red-50 px-3 py-2 text-xs font-black uppercase text-red-600 hover:bg-red-100"
                      >
                        Entfernen
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-black uppercase text-slate-500">
                          Menge
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", Number(e.target.value))
                          }
                          className="mt-1 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase text-slate-500">
                          Einheit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          className="mt-1 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                        >
                          <option value="buc">Stück</option>
                          <option value="kg">kg</option>
                          <option value="to">Tonnen</option>
                          <option value="ltr">Liter</option>
                          <option value="m">Meter</option>
                          <option value="paleti">Paletten</option>
                          <option value="bigbag">BigBag</option>
                          <option value="fass">Fass</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase text-slate-500">
                          Gewünschter Lieferort
                        </label>
                        <input
                          value={item.delivery_location}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "delivery_location",
                              e.target.value
                            )
                          }
                          placeholder="z. B. Deutschland, Bayern"
                          className="mt-1 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase text-slate-500">
                          Gewünschter Termin
                        </label>
                        <input
                          type="date"
                          value={item.desired_date}
                          onChange={(e) =>
                            updateItem(item.id, "desired_date", e.target.value)
                          }
                          className="mt-1 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-black uppercase text-slate-500">
                          Bemerkung des Kunden
                        </label>
                        <textarea
                          value={item.customer_note}
                          onChange={(e) =>
                            updateItem(item.id, "customer_note", e.target.value)
                          }
                          placeholder="Zusatzwünsche, Verpackung, Zertifikate, Lieferbedingungen usw."
                          rows={3}
                          className="mt-1 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              Optional
            </p>
            <h2 className="text-xl font-black">
              Zusätzliche Unterstützung gewünscht
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                "Lieferantenvorauswahl",
                "Angebotsvergleich",
                "Verhandlungsunterstützung",
                "Transportorganisation",
                "Begleitete Abwicklung",
                "Zahlungsabsicherung",
                "Konfliktlösungsoption",
              ].map((service) => (
                <label key={service} className="flex gap-2 text-sm">
                  <input type="checkbox" name="services" value={service} />
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
            Anfrage senden
          </p>
          <h2 className="text-2xl font-black">Beschaffungsanfrage</h2>

          <form onSubmit={submitRequest} className="mt-5 space-y-4">
            <input name="name" required placeholder="Ansprechpartner *" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]" />
            <input name="company" required placeholder="Firma *" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]" />
            <input name="email" required type="email" placeholder="E-Mail *" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]" />
            <input name="phone" placeholder="Telefon" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]" />
            <input name="country" required placeholder="Zielland / Lieferland *" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]" />

            <textarea
              name="description"
              rows={4}
              placeholder="Projektbeschreibung / zusätzliche Anforderungen"
              className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
            />

            <select name="transport" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]">
              <option value="no">Kein Transport nötig</option>
              <option value="supplier">Transport durch Anbieter</option>
              <option value="trustbridge">Transport durch TrustBridge</option>
              <option value="compare">Transportoptionen vergleichen</option>
            </select>

            <select name="confidentiality" className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]">
              <option value="direct">Direkter Kontakt zum Anbieter erlaubt</option>
              <option value="anonymous">Anfrage anonymisiert an Anbieter senden</option>
              <option value="trustbridge_only">Kontakt nur über TrustBridge</option>
            </select>

            <label className="flex gap-2 text-sm text-slate-600">
              <input type="checkbox" required />
              Ich stimme der Datenschutzerklärung zu *
            </label>

            <button
              disabled={loading || items.length === 0}
              className="w-full rounded-xl bg-[#108280] py-4 font-black uppercase tracking-wide text-white transition hover:bg-[#0d6b69] disabled:opacity-50"
            >
              {loading ? "Wird gesendet..." : "Anfrage senden"}
            </button>

            <p className="text-xs leading-5 text-slate-500">
              Ihre Anfrage wird an TrustBridge gesendet und nach Prüfung an
              passende Partner weitergeleitet.
            </p>
          </form>
        </aside>
      </section>
    </main>
  );
}
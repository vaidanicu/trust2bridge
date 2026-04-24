"use client";

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
        localStorage.removeItem("trustbridge_basket");
        setItems([]);
      } else {
        alert(data.message || "Fehler beim Senden der Anfrage.");
      }
    } catch {
      alert("Verbindungsfehler zum Server.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-teal-900 px-6 py-14 text-center text-white">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-cyan-300">
          TrustBridge Anfragekorb
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight">
          Anfragekorb
        </h1>
        <p className="mt-4 text-white/80">
          Prüfen Sie Ihre Positionen, ergänzen Sie Anforderungen und senden Sie eine strukturierte B2B-Anfrage.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Positionen im Anfragekorb</h2>

            {items.length === 0 ? (
              <p className="mt-4 text-gray-500">Sie haben noch keine Position hinzugefügt.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border p-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-black">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Interne ID: {item.internal_id || "-"} · Typ: {item.type || "Produkt"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Anbieter: {item.supplier_name || item.supplier_id || "-"} · Land: {item.country || "-"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Kategorie: {item.category || "-"}
                        </p>
                        <p className="text-sm text-orange-500">
                          Preisstatus: {item.price_status || "Preis auf Anfrage"}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-bold text-red-500"
                      >
                        Entfernen
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-gray-500">
                          Menge
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", Number(e.target.value))
                          }
                          className="mt-1 w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-gray-500">
                          Einheit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                          className="mt-1 w-full rounded-lg border p-3"
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
                        <label className="text-xs font-bold uppercase text-gray-500">
                          Gewünschter Lieferort
                        </label>
                        <input
                          value={item.delivery_location}
                          onChange={(e) =>
                            updateItem(item.id, "delivery_location", e.target.value)
                          }
                          placeholder="z. B. Deutschland, Bayern"
                          className="mt-1 w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-gray-500">
                          Gewünschter Termin
                        </label>
                        <input
                          type="date"
                          value={item.desired_date}
                          onChange={(e) =>
                            updateItem(item.id, "desired_date", e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border p-3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-bold uppercase text-gray-500">
                          Bemerkung des Kunden
                        </label>
                        <textarea
                          value={item.customer_note}
                          onChange={(e) =>
                            updateItem(item.id, "customer_note", e.target.value)
                          }
                          placeholder="Zusatzwünsche, Verpackung, Zertifikate, Lieferbedingungen usw."
                          rows={3}
                          className="mt-1 w-full rounded-lg border p-3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Zusätzliche Unterstützung gewünscht</h2>

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

        <aside className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Beschaffungsanfrage</h2>

          <form onSubmit={submitRequest} className="mt-5 space-y-4">
            <input name="name" required placeholder="Ansprechpartner *" className="w-full rounded-lg border p-3" />
            <input name="company" required placeholder="Firma *" className="w-full rounded-lg border p-3" />
            <input name="email" required type="email" placeholder="E-Mail *" className="w-full rounded-lg border p-3" />
            <input name="phone" placeholder="Telefon" className="w-full rounded-lg border p-3" />
            <input name="country" required placeholder="Zielland / Lieferland *" className="w-full rounded-lg border p-3" />

            <textarea
              name="description"
              rows={4}
              placeholder="Projektbeschreibung / zusätzliche Anforderungen"
              className="w-full rounded-lg border p-3"
            />

            <select name="transport" className="w-full rounded-lg border p-3">
              <option value="no">Kein Transport nötig</option>
              <option value="supplier">Transport durch Anbieter</option>
              <option value="trustbridge">Transport durch TrustBridge</option>
              <option value="compare">Transportoptionen vergleichen</option>
            </select>

            <select name="confidentiality" className="w-full rounded-lg border p-3">
              <option value="direct">Direkter Kontakt zum Anbieter erlaubt</option>
              <option value="anonymous">Anfrage anonymisiert an Anbieter senden</option>
              <option value="trustbridge_only">Kontakt nur über TrustBridge</option>
            </select>

            <label className="flex gap-2 text-sm">
              <input type="checkbox" required />
              Ich stimme der Datenschutzerklärung zu *
            </label>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-black uppercase tracking-wide text-white disabled:opacity-50"
            >
              {loading ? "Wird gesendet..." : "Anfrage senden"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
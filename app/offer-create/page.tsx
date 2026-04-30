"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

const countries = ["AT", "HU", "CH", "DE", "RO"];

const mainCategories = [
  "Food",
  "Non-Food",
  "Baustoffe",
  "Maschinen / Technik",
  "Chemie / Rohstoffe",
  "Transport / Logistik",
  "Bau / Montage",
  "Beratung / Dienstleistung",
  "Sonstiges",
];

const subcategories: Record<string, string[]> = {
  Food: ["Frischware", "Tiefkühlware", "Getränke", "Rohstoffe", "Sonstiges"],
  "Non-Food": ["Konsumgüter", "Werkzeuge", "Haushalt", "Restposten", "Sonstiges"],
  Baustoffe: ["Holz", "Metall", "Zement", "Dämmstoffe", "Sonstiges"],
  "Maschinen / Technik": ["Maschinen", "Ersatzteile", "Anlagen", "Werkzeuge", "Sonstiges"],
  "Chemie / Rohstoffe": ["Chemikalien", "Kunststoffe", "Rohstoffe", "Spezialprodukte"],
  "Transport / Logistik": ["Stückgut", "FTL", "LTL", "Lagerung", "Sondertransport"],
  "Bau / Montage": ["Montage", "Bauleistung", "Installation", "Wartung"],
  "Beratung / Dienstleistung": ["Beratung", "Projektmanagement", "Technik", "Sonstiges"],
  Sonstiges: ["Sonstiges"],
};

export default function OfferCreatePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offerType, setOfferType] = useState("ware");
  const [mainCat, setMainCat] = useState("Food");

  // ── Auth Guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Verify token is still valid
    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          // Token invalid or expired
          localStorage.removeItem("trustbridge_token");
          localStorage.removeItem("trustbridge_user");
          router.replace("/login");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  const isService = offerType === "service";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.append("offer_type", offerType);

    try {
      const res = await fetch(`${API}/item-create`, {
        method: "POST",
        headers: {
          // Do NOT set Content-Type — fetch sets it automatically for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Erfolg! Das Angebot wurde erstellt.");
        formElement.reset();
        setOfferType("ware");
        setMainCat("Food");
      } else {
        alert("Fehler: " + (data.message || "Server Error"));
      }
    } catch {
      alert("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  }

  // Show nothing while checking auth (avoids flash of content)
  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
        <p className="font-black text-slate-600">Wird geladen...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border bg-white shadow-xl">
        <header className="bg-[#108280] p-10 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/70">
            TrustBridge Anbieterbereich
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Produkt / Dienstleistung einstellen
          </h1>
          <p className="mt-3 max-w-3xl text-white/80">
            Erfassen Sie Waren, Dienstleistungen, Restposten oder spätere
            Auktionsangebote strukturiert für den TrustBridge-Marktplatz.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10 p-8 md:p-10">
          {/* 1. Angebotsart */}
          <Block title="1. Angebotsart">
            <div className="grid gap-4 md:grid-cols-4">
              <OptionButton current={offerType} set={setOfferType} id="ware" label="Ware / Produkt" icon="📦" />
              <OptionButton current={offerType} set={setOfferType} id="service" label="Dienstleistung" icon="🛠️" />
              <OptionButton current={offerType} set={setOfferType} id="restposten" label="Restposten" icon="🏷️" />
              <OptionButton current={offerType} set={setOfferType} id="auction" label="Auktion später" icon="🔨" />
            </div>
          </Block>

          {/* 2. Basisdaten */}
          <Block title="2. Basisdaten">
            <Input name="title" required label="Titel des Angebots *" placeholder="z. B. Industriesalz lose / Big Bag" />
            <Textarea name="short_description" label="Kurzbeschreibung" maxLength={300} rows={3} />
            <Textarea name="description" required label="Ausführliche Beschreibung *" rows={7} />
          </Block>

          {/* 3. Kategorie */}
          <Block title="3. Kategorie">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hauptkategorie">
                <select
                  name="main_category"
                  value={mainCat}
                  onChange={(e) => setMainCat(e.target.value)}
                  className="input"
                >
                  {mainCategories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </Field>

              <Field label="Unterkategorie">
                <select name="subcategory" className="input">
                  {(subcategories[mainCat] || ["Sonstiges"]).map((sub) => (
                    <option key={sub}>{sub}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Block>

          {/* 4. Produktdaten (only for non-service) */}
          {!isService && (
            <Block title="4. Produktdaten / Datenblattinformationen">
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="article_number" label="Artikelnummer / interne Referenz" />
                <Input name="brand" label="Hersteller / Marke" />
                <Input name="origin" label="Herkunftsland" placeholder="z. B. Deutschland" />

                <Field label="Zustand">
                  <select name="condition" className="input">
                    <option>Neu</option>
                    <option>Gebraucht</option>
                    <option>B-Ware</option>
                    <option>Restposten</option>
                    <option>Sonderposten</option>
                  </select>
                </Field>

                <Input name="quantity" type="number" label="Menge verfügbar" />

                <Field label="Einheit">
                  <select name="unit" className="input">
                    <UnitOptions />
                  </select>
                </Field>

                <Input name="moq" type="number" label="Mindestbestellmenge" />

                <Field label="MOQ Einheit">
                  <select name="moq_unit" className="input">
                    <UnitOptions />
                  </select>
                </Field>
              </div>

              <Textarea name="technical_specs" label="Technische Daten / Spezifikation" rows={5} />
              <Textarea
                name="packaging"
                label="Maße / Gewicht / Verpackung"
                rows={4}
                placeholder="Länge, Breite, Höhe, Gewicht, Verpackungsart..."
              />
            </Block>
          )}

          {/* 5. Dienstleistungsdaten (only for service) */}
          {isService && (
            <Block title="5. Dienstleistungsdaten">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Art der Dienstleistung">
                  <select name="service_type" className="input">
                    <option>Transport</option>
                    <option>Montage</option>
                    <option>Bauleistung</option>
                    <option>Technische Dienstleistung</option>
                    <option>Beratung</option>
                    <option>Wartung / Service</option>
                    <option>Sonstiges</option>
                  </select>
                </Field>

                <Field label="Vor Ort oder remote?">
                  <select name="service_mode" className="input">
                    <option>vor Ort</option>
                    <option>remote</option>
                    <option>beides</option>
                  </select>
                </Field>
              </div>

              <CheckboxGrid title="Leistungsgebiet" name="service_area" items={countries} />

              <Input
                name="availability"
                label="Verfügbarkeit"
                placeholder="z. B. ab sofort, bis Datum, nach Vereinbarung"
              />

              <Field label="Abrechnungsmodell">
                <select name="billing_model" className="input">
                  <option>Stundensatz</option>
                  <option>Tagessatz</option>
                  <option>Pauschalpreis</option>
                  <option>Projektpreis</option>
                  <option>Preis auf Anfrage</option>
                </select>
              </Field>
            </Block>
          )}

          {/* 6. Preisangaben */}
          <Block title="6. Preisangaben">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Preisstatus">
                <select name="price_status" className="input">
                  <option value="fixed">Fixpreis</option>
                  <option value="request">Preis auf Anfrage</option>
                  <option value="negotiable">Verhandelbar</option>
                  <option value="market">Tagespreis / marktpreisabhängig</option>
                  <option value="auction">Auktionspreis später</option>
                </select>
              </Field>

              <Input name="price" label="Preis" placeholder="000.000.000,00" />

              <Field label="Währung">
                <select name="currency" className="input">
                  <option>EUR</option>
                  <option>HUF</option>
                  <option>RON</option>
                  <option>CHF</option>
                  <option>USD</option>
                </select>
              </Field>

              <Field label="Preis gilt pro">
                <select name="price_unit" className="input">
                  <option>Stück</option>
                  <option>Palette</option>
                  <option>kg</option>
                  <option>Tonne</option>
                  <option>Liter</option>
                  <option>m²</option>
                  <option>m³</option>
                  <option>Auftrag</option>
                  <option>Projekt</option>
                  <option>Stunde</option>
                  <option>Tag</option>
                </select>
              </Field>

              <Field label="MwSt.-Hinweis">
                <select name="vat_note" className="input">
                  <option>Preis netto</option>
                  <option>auf Anfrage</option>
                </select>
              </Field>
            </div>
          </Block>

          {/* 7. Liefer- und Handelsbedingungen */}
          <Block title="7. Liefer- und Handelsbedingungen">
            <Field label="Incoterm">
              <select name="incoterm" className="input">
                <option title="Ab Werk: Käufer holt ab und trägt Risiko ab Abholort.">EXW</option>
                <option title="Frei Frachtführer. Verkäufer übergibt an Frachtführer.">FCA</option>
                <option title="Frei an Bord. Nur für Seefracht.">FOB</option>
                <option title="Kosten, Versicherung und Fracht bis Zielhafen.">CIF</option>
                <option title="Geliefert benannter Ort.">DAP</option>
                <option title="Geliefert verzollt. Verkäufer trägt Transport, Zoll und Steuern.">DDP</option>
                <option title="Fracht bezahlt bis.">CPT</option>
                <option title="Fracht und Versicherung bezahlt bis.">CIP</option>
              </select>
            </Field>

            <Input name="pickup_location" label="Lieferort / Abholort" />
            <CheckboxGrid title="Zielländer / Lieferländer" name="delivery_countries" items={countries} />
            <Input
              name="delivery_time"
              label="Lieferzeit"
              placeholder="z. B. 3–5 Werktage, 2 Wochen nach Auftrag"
            />

            <Field label="Transport möglich?">
              <select name="transport_option" className="input">
                <option>Anbieter organisiert Transport</option>
                <option>Kunde organisiert Transport</option>
                <option>TrustBridge soll Transportoption prüfen</option>
                <option>nicht relevant</option>
              </select>
            </Field>
          </Block>

          {/* 8. Fotos */}
          <Block title="8. Fotos">
            <div className="rounded-2xl border border-dashed p-6">
              <input type="file" name="photos" multiple accept=".jpg,.jpeg,.png,.webp" />
              <p className="mt-2 text-xs text-slate-500">
                Max. 5 Fotos, JPG, PNG, WEBP.
              </p>
            </div>
          </Block>

          {/* 9. Dokumente / Zertifikate */}
          <Block title="9. Dokumente / Zertifikate">
            <CheckboxGrid
              title="Dokumententyp"
              name="document_types"
              items={[
                "Technisches Datenblatt",
                "Sicherheitsdatenblatt / SDS / MSDS",
                "CE-Erklärung",
                "Leistungserklärung / DoP",
                "Prüfzeugnis",
                "ISO-Zertifikat",
                "Lebensmittelzertifikat",
                "Herkunftszertifikat",
                "Analysezertifikat / CoA",
                "Bedienungsanleitung",
                "Garantieunterlagen",
                "Sonstiges",
              ]}
            />

            <div className="rounded-2xl border border-dashed p-6">
              <input
                type="file"
                name="documents"
                multiple
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
              />
              <p className="mt-2 text-xs text-slate-500">PDF, DOCX, XLSX, JPG, PNG.</p>
            </div>
          </Block>

          {/* 10. Sichtbarkeit & Kontakt */}
          <Block title="10. Sichtbarkeit & Kontakt">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kontaktfreigabe">
                <select name="contact_permission" className="input">
                  <option>Kontakt nur über TrustBridge</option>
                  <option>Direkter Kontakt nach Freigabe erlaubt</option>
                  <option>Anonymisierte Erstprüfung gewünscht</option>
                </select>
              </Field>

              <Field label="Veröffentlichung">
                <select name="publication_status" className="input">
                  <option>Sofort nach TrustBridge-Prüfung veröffentlichen</option>
                  <option>Als Entwurf speichern</option>
                  <option>Nur intern sichtbar</option>
                </select>
              </Field>
            </div>
          </Block>

          {/* 11. Bestätigung */}
          <Block title="11. Bestätigung">
            <div className="space-y-3 text-sm font-semibold text-slate-700">
              <Confirm text="Ich bestätige, dass die Angaben korrekt sind." />
              <Confirm text="Ich bestätige, dass ich zur Veröffentlichung der Inhalte berechtigt bin." />
              <Confirm text="Ich stimme der Prüfung, Übersetzung und Veröffentlichung durch TrustBridge zu." />
              <Confirm text="Ich bestätige, dass hochgeladene Dokumente echt und aktuell sind." />
            </div>

            <div className="flex flex-col gap-3 pt-4 md:flex-row">
              <button
                type="button"
                className="rounded-xl border px-6 py-4 font-black uppercase hover:bg-slate-50 transition"
              >
                Als Entwurf speichern
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#108280] px-6 py-4 font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50 transition"
              >
                {loading ? "Wird gesendet..." : "Angebot einreichen"}
              </button>
            </div>
          </Block>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 0.9rem 1rem;
          outline: none;
          font-weight: 600;
          background: white;
        }
        .input:focus {
          border-color: #108280;
          box-shadow: 0 0 0 4px rgba(16, 130, 128, 0.1);
        }
      `}</style>
    </main>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-black">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Input(props: any) {
  const { label, ...rest } = props;
  return (
    <Field label={label}>
      <input {...rest} className="input" />
    </Field>
  );
}

function Textarea(props: any) {
  const { label, ...rest } = props;
  return (
    <Field label={label}>
      <textarea {...rest} className="input" />
    </Field>
  );
}

function CheckboxGrid({
  title,
  name,
  items,
}: {
  title: string;
  name: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase text-slate-500">{title}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <label
            key={item}
            className="flex gap-2 rounded-xl border bg-slate-50 p-3 text-sm font-semibold"
          >
            <input type="checkbox" name={name} value={item} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function Confirm({ text }: { text: string }) {
  return (
    <label className="flex gap-3 rounded-xl border bg-slate-50 p-3">
      <input type="checkbox" required />
      <span>{text}</span>
    </label>
  );
}

function UnitOptions() {
  return (
    <>
      <option>Stück</option>
      <option>Palette</option>
      <option>kg</option>
      <option>Tonne</option>
      <option>Liter</option>
      <option>m²</option>
      <option>m³</option>
      <option>Big Bag</option>
      <option>Container</option>
      <option>Sonstiges</option>
    </>
  );
}

function OptionButton({
  current,
  set,
  id,
  label,
  icon,
}: {
  current: string;
  set: (id: string) => void;
  id: string;
  label: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={() => set(id)}
      className={`rounded-2xl border-2 p-5 text-center transition ${
        current === id
          ? "border-[#108280] bg-[#108280]/10"
          : "border-slate-100 hover:border-slate-300"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-sm font-black">{label}</div>
    </button>
  );
}
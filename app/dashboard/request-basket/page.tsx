"use client";

import { useState } from "react";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function GuidedRequestPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const payload = {
      company: form.get("company"),
      contact_name: form.get("contact"),
      email: form.get("email"),
      phone: form.get("phone"),

      description: form.get("description"),
      quantity: form.get("quantity"),
      unit: form.get("unit"),

      delivery_country: form.getAll("country"),
      urgency: form.get("urgency"),
      budget: form.get("budget"),

      requirements: form.getAll("requirements"),
      services: form.getAll("services"),

      confidentiality: form.get("confidentiality"),
    };

    try {
      const res = await fetch(`${API}/register-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Anfrage gesendet!");
        window.location.href = "/";
      } else {
        alert("Fehler beim Senden.");
      }
    } catch {
      alert("Serverfehler.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
        <h1 className="text-3xl font-black mb-6">
          Geführte Anfrage starten
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 1. BASISDATEN */}
          <Section title="1. Basisdaten">
            <Input name="company" placeholder="Firma *" required />
            <Input name="contact" placeholder="Ansprechpartner *" required />
            <Input name="email" placeholder="E-Mail *" required />
            <Input name="phone" placeholder="Telefon / WhatsApp" />
          </Section>

          {/* 2. WAS SUCHEN SIE */}
          <Section title="2. Was suchen Sie?">
            <select name="category" className="input">
              <option>Food</option>
              <option>Non-Food</option>
              <option>Dienstleistung</option>
            </select>
          </Section>

          {/* 3. DETAILS */}
          <Section title="3. Details">
            <textarea
              name="description"
              placeholder="Was genau wird benötigt? *"
              required
              className="input h-28"
            />
            <Input name="quantity" placeholder="Menge" />
            <select name="unit" className="input">
              <option>Stück</option>
              <option>Palette</option>
              <option>Tonne</option>
              <option>Liter</option>
              <option>Projekt</option>
            </select>
          </Section>

          {/* 4. GEOGRAFIE */}
          <Section title="4. Geografie">
            <Checkbox name="country" value="DE" label="Deutschland" />
            <Checkbox name="country" value="RO" label="Rumänien" />
            <Checkbox name="country" value="HU" label="Ungarn" />
            <Checkbox name="country" value="AT" label="Österreich" />
            <Checkbox name="country" value="CH" label="Schweiz" />
          </Section>

          {/* 5. URGENCY */}
          <Section title="5. Zeit & Dringlichkeit">
            <select name="urgency" className="input">
              <option>Hoch</option>
              <option>Mittel</option>
              <option>Flexibel</option>
            </select>
          </Section>

          {/* 6. BUDGET */}
          <Section title="6. Preis">
            <Input name="budget" placeholder="Budget / Zielpreis" />
          </Section>

          {/* 7. REQUIREMENTS */}
          <Section title="7. Anforderungen">
            <Checkbox name="requirements" value="verified" label="Geprüfte Anbieter" />
            <Checkbox name="requirements" value="fast" label="Schnelle Lieferung" />
            <Checkbox name="requirements" value="price" label="Preis im Fokus" />
            <Checkbox name="requirements" value="longterm" label="Langfristige Partnerschaft" />
          </Section>

          {/* 8. SERVICES */}
          <Section title="8. Zusatzleistungen">
            <Checkbox name="services" value="search" label="Lieferantensuche" />
            <Checkbox name="services" value="compare" label="Angebotsvergleich" />
            <Checkbox name="services" value="negotiation" label="Verhandlung" />
            <Checkbox name="services" value="escrow" label="Zahlungsabsicherung" />
          </Section>

          {/* 9. CONFIDENTIALITY */}
          <Section title="9. Vertraulichkeit">
            <select name="confidentiality" className="input">
              <option value="anonymous">Anonym</option>
              <option value="direct">Direkter Kontakt erlaubt</option>
            </select>
          </Section>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#108280] py-4 font-black text-white"
          >
            {loading ? "Senden..." : "Anfrage senden"}
          </button>
        </form>
      </div>
    </main>
  );
}

/* UI COMPONENTS */

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="font-black mb-3">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Input(props: any) {
  return <input {...props} className="input" />;
}

function Checkbox({ name, value, label }: any) {
  return (
    <label className="flex gap-2">
      <input type="checkbox" name={name} value={value} />
      {label}
    </label>
  );
}
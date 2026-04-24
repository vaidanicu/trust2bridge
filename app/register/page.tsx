"use client";

import { useState } from "react";

const API_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      company: formData.get("company"),
      contact_name: formData.get("contact_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      vat: formData.get("vat"),
      business_type: formData.get("business_type"),
      message: formData.get("message"),
    };

    const res = await fetch(`${API_URL}/register-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      alert("Fehler beim Senden der Registrierung.");
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-xl rounded-2xl bg-white p-8 shadow text-center">
          <h1 className="text-3xl font-black text-teal-900">
            Registrierung erhalten
          </h1>
          <p className="mt-4 text-gray-600">
            Vielen Dank. Das TrustBridge-Team prüft Ihre Daten. Nach Freigabe
            erhalten Sie Ihre Login-Daten per E-Mail.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-black text-teal-900">
          TrustBridge Registrierung
        </h1>

        <p className="mt-2 text-gray-500">
          Bitte füllen Sie das Formular aus. Nach Prüfung erhalten Sie Ihre
          Zugangsdaten per E-Mail.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input name="company" required placeholder="Firma *" className="w-full rounded-lg border p-3" />
          <input name="contact_name" required placeholder="Ansprechpartner *" className="w-full rounded-lg border p-3" />
          <input name="email" required type="email" placeholder="E-Mail *" className="w-full rounded-lg border p-3" />
          <input name="phone" placeholder="Telefon" className="w-full rounded-lg border p-3" />
          <input name="country" required placeholder="Land *" className="w-full rounded-lg border p-3" />
          <input name="vat" placeholder="USt-IdNr. / Steuernummer" className="w-full rounded-lg border p-3" />

          <select name="business_type" className="w-full rounded-lg border p-3">
            <option value="">Unternehmenstyp auswählen</option>
            <option value="buyer">Käufer / Einkäufer</option>
            <option value="supplier">Anbieter / Lieferant</option>
            <option value="partner">Landespartner / Dienstleister</option>
          </select>

          <textarea
            name="message"
            rows={4}
            placeholder="Kurze Beschreibung Ihres Unternehmens / Bedarfs"
            className="w-full rounded-lg border p-3"
          />

          <label className="flex gap-2 text-sm">
            <input type="checkbox" required />
            Ich stimme der Datenschutzerklärung zu *
          </label>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black py-4 font-black uppercase text-white disabled:opacity-50"
          >
            {loading ? "Wird gesendet..." : "Registrierung absenden"}
          </button>
        </form>
      </div>
    </main>
  );
}
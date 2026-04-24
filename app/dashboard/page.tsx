"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          window.location.href = "/login";
          return;
        }

        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <main className="p-10">Lade Dashboard...</main>;
  }

  const role = user?.roles?.[0];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-teal-900 p-8 text-white">
          <p className="text-sm font-black uppercase text-cyan-300">
            TrustBridge Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Willkommen, {user.name}
          </h1>
          <p className="mt-2 text-white/80">
            Firma: {user.company || "-"} · Rolle: {role}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardCard
            title="Marketplace"
            text="Produkte und Dienstleistungen ansehen."
            href="/marketplace"
          />

          <DashboardCard
            title="Anfragekorb"
            text="Ihre aktuelle Beschaffungsanfrage bearbeiten."
            href="/request-basket"
          />

          <DashboardCard
            title="Registrierung"
            text="Kontodaten und Unternehmensinformationen."
            href="/dashboard"
          />
        </div>

        {role === "tb_buyer" && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Buyer Bereich</h2>
            <p className="mt-2 text-gray-600">
              Hier sehen Sie später Ihre gesendeten Anfragen und Angebote.
            </p>
          </div>
        )}

        {role === "tb_supplier" && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Supplier Bereich</h2>
            <p className="mt-2 text-gray-600">
              Hier sehen Sie später Lieferantenanfragen und können Angebote abgeben.
            </p>
          </div>
        )}

        {role === "tb_partner" && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Partner Bereich</h2>
            <p className="mt-2 text-gray-600">
              Hier sehen Sie später Transport- und Landespartner-Aufgaben.
            </p>
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("trustbridge_token");
            localStorage.removeItem("trustbridge_user");
            window.location.href = "/login";
          }}
          className="mt-8 rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          Logout
        </button>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md">
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </Link>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    async function loadDashboard() {
      try {
        const meRes = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meData = await meRes.json();

        if (meData.code) {
          window.location.href = "/login";
          return;
        }

        setUser(meData);

        const reqRes = await fetch(`${API}/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reqData = await reqRes.json();

        if (Array.isArray(reqData)) {
          setRequests(reqData);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] p-10">
        Lade Dashboard...
      </main>
    );
  }

  const role = user?.roles?.[0];

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            TrustBridge Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Willkommen, {user?.name}
          </h1>

          <p className="mt-2 text-white/80">
            Firma: {user?.company || "-"} · Rolle: {role}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            title="Neue Anfrage"
            text="Produkt oder Dienstleistung suchen lassen."
            href="/request-basket"
          />
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                Meine Anfragen
              </p>
              <h2 className="text-2xl font-black">
                Gesendete Beschaffungsanfragen
              </h2>
            </div>

            <Link
              href="/request-basket"
              className="rounded-xl bg-[#108280] px-5 py-3 text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
            >
              Neue Anfrage
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black">
                Noch keine Anfragen vorhanden.
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Sobald Sie eine Anfrage senden, erscheint sie hier.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Datum</th>
                    <th className="p-4">Zielland</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Aktion</th>
                  </tr>
                </thead>

                <tbody className="divide-y bg-white">
                  {requests.map((req: any) => (
                    <tr key={req.id}>
                      <td className="p-4 font-black">#{req.id}</td>
                      <td className="p-4 text-slate-600">
                        {req.date || "-"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {req.delivery_country || "-"}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/requests/${req.id}`}
                          className="font-black text-[#108280] hover:underline"
                        >
                          Details ansehen
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("trustbridge_token");
            localStorage.removeItem("trustbridge_user");
            window.location.href = "/login";
          }}
          className="mt-8 rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-slate-800"
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
    <Link
      href={href}
      className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === "pending"
      ? "Pending Prüfung"
      : status === "processing"
      ? "In Bearbeitung"
      : status === "sent_to_partner"
      ? "An Partner weitergeleitet"
      : status === "offer_received"
      ? "Angebot erhalten"
      : status === "completed"
      ? "Abgeschlossen"
      : status || "Pending Prüfung";

  return (
    <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
      {label}
    </span>
  );
}
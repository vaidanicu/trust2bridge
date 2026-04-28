"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
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
        setRequests(Array.isArray(reqData) ? reqData : []);

        if (meData.roles?.includes("administrator")) {
          const regRes = await fetch(`${API}/registrations`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const regData = await regRes.json();
          setRegistrations(Array.isArray(regData) ? regData : []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleRegistrationAction = async (
    id: number,
    action: "approve" | "reject",
    selectedRole?: string
  ) => {
    const token = localStorage.getItem("trustbridge_token");

    const role =
      selectedRole === "tb_supplier"
        ? "tb_supplier"
        : selectedRole === "tb_partner"
        ? "tb_partner"
        : "tb_buyer";

    try {
      const res = await fetch(`${API}/registration-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action, role }),
      });

      const data = await res.json();

      if (data.success) {
        alert(
          action === "approve"
            ? "Registrierung genehmigt."
            : "Registrierung abgelehnt."
        );
        window.location.reload();
      } else {
        alert(data.message || "Eroare.");
      }
    } catch {
      alert("Serverfehler.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] p-10">
        Lade Dashboard...
      </main>
    );
  }

  const role = user?.roles?.[0];
  const isSupplier =
    user?.roles?.includes("tb_supplier") ||
    user?.roles?.includes("TrustBridge_Supplier");
  const isAdmin = user?.roles?.includes("administrator");

  const mainRequests = requests.filter((req: any) => !req.parent_request);
  const subRequests = requests.filter((req: any) => req.parent_request);
  const visibleRequests = isAdmin ? mainRequests : requests;

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

          {!isSupplier && (
            <>
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
            </>
          )}

          {isSupplier && (
            <>
              <DashboardCard
                title="Eingehende Anfragen"
                text="Neue Lieferantenanfragen prüfen."
                href="/dashboard"
              />

              <DashboardCard
                title="Angebote"
                text="Antworten und Angebote verwalten."
                href="/dashboard"
              />
            </>
          )}
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {isAdmin
                  ? "Admin Bereich"
                  : isSupplier
                  ? "Lieferantenbereich"
                  : "Meine Anfragen"}
              </p>

              <h2 className="text-2xl font-black">
                {isAdmin
                  ? "Hauptanfragen von Kunden"
                  : isSupplier
                  ? "Eingehende Lieferantenanfragen"
                  : "Gesendete Beschaffungsanfragen"}
              </h2>
            </div>

            {!isSupplier && !isAdmin && (
              <Link
                href="/request-basket"
                className="rounded-xl bg-[#108280] px-5 py-3 text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
              >
                Neue Anfrage
              </Link>
            )}
          </div>

          {visibleRequests.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black">
                Noch keine Anfragen vorhanden.
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Sobald Anfragen vorhanden sind, erscheinen sie hier.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Datum</th>
                    <th className="p-4">Firma</th>
                    <th className="p-4">Zielland</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Aktion</th>
                  </tr>
                </thead>

                <tbody className="divide-y bg-white">
                  {visibleRequests.map((req: any) => (
                    <tr key={req.id}>
                      <td className="p-4 font-black">#{req.id}</td>
                      <td className="p-4 text-slate-600">{req.date || "-"}</td>
                      <td className="p-4 font-bold">{req.company || "-"}</td>
                      <td className="p-4 text-slate-600">
                        {req.delivery_country || "-"}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/requests?id=${req.id}`}
                          className="font-black text-[#108280] hover:underline"
                        >
                          {isSupplier ? "Anfrage öffnen" : "Details ansehen"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                Admin Bereich
              </p>

              <h2 className="text-2xl font-black">
                Sub-Anfragen an Anbieter
              </h2>
            </div>

            {subRequests.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">
                  Keine Sub-Anfragen vorhanden.
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Sobald eine Kundenanfrage auf Anbieter aufgeteilt wird,
                  erscheinen die Sub-Anfragen hier.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-4">Sub-ID</th>
                      <th className="p-4">Haupt-ID</th>
                      <th className="p-4">Datum</th>
                      <th className="p-4">Firma</th>
                      <th className="p-4">Supplier</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Aktion</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y bg-white">
                    {subRequests.map((req: any) => (
                      <tr key={req.id}>
                        <td className="p-4 font-black">#{req.id}</td>
                        <td className="p-4 text-slate-600">
                          #{req.parent_request || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {req.date || "-"}
                        </td>
                        <td className="p-4 font-bold">
                          {req.company || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {req.supplier_email || req.supplier_id || "-"}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/dashboard/requests?id=${req.id}`}
                            className="font-black text-[#108280] hover:underline"
                          >
                            Details / Freigabe
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                Admin Bereich
              </p>

              <h2 className="text-2xl font-black">Neue Registrierungen</h2>
            </div>

            {registrations.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">
                  Keine neuen Registrierungen.
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Sobald sich ein Unternehmen registriert, erscheint es hier.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Datum</th>
                      <th className="p-4">Firma</th>
                      <th className="p-4">Kontakt</th>
                      <th className="p-4">E-Mail</th>
                      <th className="p-4">Land</th>
                      <th className="p-4">Typ</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Aktion</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y bg-white">
                    {registrations.map((reg: any) => (
                      <tr key={reg.id}>
                        <td className="p-4 font-black">#{reg.id}</td>
                        <td className="p-4 text-slate-600">
                          {reg.date || "-"}
                        </td>
                        <td className="p-4 font-bold">
                          {reg.company || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {reg.contact_name || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {reg.email || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {reg.country || "-"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {reg.business_type || "-"}
                        </td>
                        <td className="p-4">
                          <RegistrationStatusBadge status={reg.status} />
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <select
                              id={`role-${reg.id}`}
                              defaultValue={
                                reg.business_type === "supplier"
                                  ? "tb_supplier"
                                  : reg.business_type === "partner"
                                  ? "tb_partner"
                                  : "tb_buyer"
                              }
                              className="rounded-lg border px-3 py-2 text-xs font-bold"
                              disabled={
                                reg.status === "approved" ||
                                reg.status === "rejected"
                              }
                            >
                              <option value="tb_buyer">Buyer</option>
                              <option value="tb_supplier">Supplier</option>
                              <option value="tb_partner">Partner</option>
                            </select>

                            <div className="flex gap-2">
                              <button
                                disabled={
                                  reg.status === "approved" ||
                                  reg.status === "rejected"
                                }
                                onClick={() => {
                                  const roleSelect = document.getElementById(
                                    `role-${reg.id}`
                                  ) as HTMLSelectElement;

                                  handleRegistrationAction(
                                    reg.id,
                                    "approve",
                                    roleSelect.value
                                  );
                                }}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Approve
                              </button>

                              <button
                                disabled={
                                  reg.status === "approved" ||
                                  reg.status === "rejected"
                                }
                                onClick={() =>
                                  handleRegistrationAction(reg.id, "reject")
                                }
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
  let label = "Neu";
  let classes = "bg-gray-100 text-gray-700";

  switch (status) {
    case "nou":
      label = "Neu";
      classes = "bg-blue-100 text-blue-700";
      break;
    case "pending":
    case "pending_review":
      label = "Wartet auf Prüfung";
      classes = "bg-yellow-100 text-yellow-700";
      break;
    case "processing":
      label = "In Bearbeitung";
      classes = "bg-indigo-100 text-indigo-700";
      break;
    case "sent_to_partner":
      label = "An Partner weitergeleitet";
      classes = "bg-purple-100 text-purple-700";
      break;
    case "sent_to_supplier":
      label = "An Anbieter gesendet";
      classes = "bg-cyan-100 text-cyan-700";
      break;
    case "offer_received":
      label = "Angebot erhalten";
      classes = "bg-green-100 text-green-700";
      break;
    case "completed":
      label = "Abgeschlossen";
      classes = "bg-emerald-100 text-emerald-700";
      break;
    case "rejected":
      label = "Abgelehnt";
      classes = "bg-red-100 text-red-700";
      break;
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>
      {label}
    </span>
  );
}

function RegistrationStatusBadge({ status }: { status: string }) {
  let label = status || "neu";
  let classes = "bg-blue-100 text-blue-700";

  if (status === "approved") {
    label = "Approved";
    classes = "bg-green-100 text-green-700";
  }

  if (status === "rejected") {
    label = "Rejected";
    classes = "bg-red-100 text-red-700";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>
      {label}
    </span>
  );
}
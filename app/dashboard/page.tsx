"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── PRODUCT DETAIL MODAL ────────────────────────────────────────────────────

function ProductModal({
  item,
  onClose,
  onApprove,
  onReject,
  isAdmin,
}: {
  item: any;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  isAdmin?: boolean;
}) {
  const isLive = item.wp_status === "publish";
  const allImages = [item.image, ...(item.gallery || [])].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl">

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 backdrop-blur px-8 py-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter">
                REF: {item.internal_id || item.id}
              </span>
              <span className="text-[10px] font-black bg-[#108280]/10 px-2 py-0.5 rounded text-[#108280] uppercase">
                {item.type || "Angebot"}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{item.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Column: Images & Description */}
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Galerie Foto</p>
              {allImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {allImages.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt="Preview"
                      className={`rounded-2xl object-cover h-40 w-full border bg-slate-50 ${i === 0 ? "col-span-2 h-64" : ""}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-40 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-dashed italic">
                  Keine Bilder
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Detaillierte Beschreibung</p>
              <div
                className="prose prose-sm text-slate-700 max-w-none bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          </div>

          {/* Right Column: Technical Data & Supplier */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DataBox label="Status" value={isLive ? "✅ LIVE" : "⏳ WARTEND"} highlight={!isLive} />
              <DataBox label="Preis" value={item.price ? `${item.price} ${item.currency || "€"}` : "Auf Anfrage"} />
              <DataBox label="Einheit" value={item.unit || "Stück"} />
              <DataBox label="Land" value={item.country || "N/A"} />
              <DataBox label="Hauptkategorie" value={item.category || "General"} />
              <DataBox label="Unterkategorie" value={item.subcategory || "-"} />
            </div>

            {/* Supplier Info */}
            <div className="p-6 rounded-[2rem] bg-[#108280]/5 border border-[#108280]/20 space-y-4">
              <p className="text-xs font-black uppercase text-[#108280] tracking-widest">Anbieter Information</p>
              <div>
                <p className="text-lg font-black text-slate-900">{item.supplier_name || "Unbekannt"}</p>
                <p className="text-sm text-slate-500 font-medium">{item.supplier_email}</p>
              </div>
              <div className="pt-4 border-t border-[#108280]/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Interne ID</span>
                <p className="text-xs font-mono text-slate-600">{item.internal_id || "N/A"}</p>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex flex-col gap-3 pt-4">
                {!isLive && (
                  <button
                    onClick={() => onApprove?.(item.id)}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                  >
                    ✓ PRODUKT FREIGEBEN (APPROVE)
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Produkt unwiderruflich löschen?")) onReject?.(item.id);
                  }}
                  className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                >
                  ✕ PRODUKT LÖSCHEN (DELETE)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? "bg-yellow-50 border-yellow-200" : "bg-slate-50 border-slate-100"}`}>
      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-yellow-700" : "text-slate-800"}`}>{value}</p>
    </div>
  );
}

// ─── MAIN DASHBOARD PAGE ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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

        const isAdmin = meData.roles?.includes("administrator");
        const isSupplier =
          meData.roles?.includes("tb_supplier") ||
          meData.roles?.includes("TrustBridge_Supplier");

        if (isAdmin) {
          // Admin sees all items including pending/draft
          const itemsRes = await fetch(`${API}/items`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const itemsData = await itemsRes.json();
          setMyItems(Array.isArray(itemsData) ? itemsData : []);

          const regRes = await fetch(`${API}/registrations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const regData = await regRes.json();
          setRegistrations(Array.isArray(regData) ? regData : []);
        } else if (isSupplier) {
          // Supplier sees only their own listings
          const itemsRes = await fetch(`${API}/my-items`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const itemsData = await itemsRes.json();
          setMyItems(Array.isArray(itemsData) ? itemsData : []);
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
        alert(action === "approve" ? "Registrierung genehmigt." : "Registrierung abgelehnt.");
        window.location.reload();
      } else {
        alert(data.message || "Fehler.");
      }
    } catch {
      alert("Serverfehler.");
    }
  };

  const handleItemAction = async (id: number, action: "approve" | "reject") => {
    const token = localStorage.getItem("trustbridge_token");
    try {
      const res = await fetch(`${API}/item-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(action === "approve" ? "Produkt freigegeben." : "Produkt gelöscht.");
        setSelectedItem(null);
        window.location.reload();
      } else {
        alert(data.message || "Fehler.");
      }
    } catch {
      alert("Serverfehler.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
        <p className="font-black text-slate-600">Lade Dashboard...</p>
      </main>
    );
  }

  const role = user?.roles?.[0];
  const isAdmin = user?.roles?.includes("administrator");
  const isSupplier =
    user?.roles?.includes("tb_supplier") ||
    user?.roles?.includes("TrustBridge_Supplier");

  const mainRequests = requests.filter((req: any) => !req.parent_request);
  const subRequests = requests.filter((req: any) => req.parent_request);
  const visibleRequests = isAdmin ? mainRequests : requests;

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-20">

      {/* Product Detail Modal */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isAdmin={isAdmin}
          onApprove={(id) => handleItemAction(id, "approve")}
          onReject={(id) => handleItemAction(id, "reject")}
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white shadow-lg">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">
            TrustBridge Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black">Willkommen, {user?.name}</h1>
          <p className="mt-2 text-white/80">
            Firma: {user?.company || "-"} · Rolle: {role}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Nav Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          <DashboardCard
            title="Marketplace"
            text="Produkte und Dienstleistungen ansehen."
            href="/marketplace"
            icon="🌐"
          />
          {isSupplier ? (
            <>
              <DashboardCard
                title="Eingehende Anfragen"
                text="Neue Lieferantenanfragen prüfen."
                href="/dashboard"
                icon="📥"
              />
              <DashboardCard
                title="Angebote"
                text="Antworten und Angebote verwalten."
                href="/dashboard"
                icon="📦"
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="Anfragekorb"
                text="Ihre aktuelle Beschaffungsanfrage bearbeiten."
                href="/request-basket"
                icon="🛒"
              />
              <DashboardCard
                title="Neue Anfrage"
                text="Produkt oder Dienstleistung suchen lassen."
                href="/request-basket"
                icon="➕"
              />
            </>
          )}
        </div>

        {/* ── ADMIN: PRODUCT APPROVAL ────────────────────────────────────────── */}
        {isAdmin && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Admin Bereich</p>
              <h2 className="text-2xl font-black flex items-center gap-2">
                Produktfreigabe
                <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter">
                  Kontrolle
                </span>
              </h2>
            </div>

            {myItems.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">Keine Produkte zur Freigabe.</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Sobald Produkte eingereicht werden, erscheinen sie hier.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b bg-slate-950 text-white">
                    <tr>
                      <th className="p-4 font-black text-[10px] uppercase">Produkt</th>
                      <th className="p-4 font-black text-[10px] uppercase">Anbieter</th>
                      <th className="p-4 font-black text-[10px] uppercase">Status</th>
                      <th className="p-4 text-right font-black text-[10px] uppercase">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {myItems.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-black text-slate-800">{item.title}</p>
                          <p className="text-[10px] text-slate-400">{item.category}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-600">{item.supplier_name || "Unbekannt"}</p>
                          <p className="text-[10px] text-slate-400">{item.supplier_email}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                              item.wp_status === "publish"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.wp_status === "publish" ? "Live" : "Wartend"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-[#108280] transition"
                            >
                              PRÜFEN / DETAILS
                            </button>
                            {item.wp_status !== "publish" && (
                              <button
                                onClick={() => handleItemAction(item.id, "approve")}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white hover:bg-green-700"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleItemAction(item.id, "reject")}
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
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

        {/* ── SUPPLIER: MY LISTINGS ──────────────────────────────────────────── */}
        {isSupplier && !isAdmin && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-black mb-6 text-[#108280]">Meine Angebote</h2>
            {myItems.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">Noch keine Angebote vorhanden.</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div>
                      <h4 className="font-black text-slate-800">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Ref: {item.internal_id || item.id}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                        item.wp_status === "publish"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.wp_status === "publish" ? "✅ Aktiv" : "⏳ In Prüfung"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAIN REQUESTS TABLE ────────────────────────────────────────────── */}
        <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {isAdmin ? "Admin Bereich" : isSupplier ? "Lieferantenbereich" : "Meine Anfragen"}
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
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black">Noch keine Anfragen vorhanden.</h3>
              <p className="mt-2 text-sm text-slate-500">
                Sobald Anfragen vorhanden sind, erscheinen sie hier.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="p-4 font-black text-[10px] uppercase">ID</th>
                    <th className="p-4 font-black text-[10px] uppercase">Datum</th>
                    <th className="p-4 font-black text-[10px] uppercase">Firma</th>
                    <th className="p-4 font-black text-[10px] uppercase">Zielland</th>
                    <th className="p-4 font-black text-[10px] uppercase">Status</th>
                    <th className="p-4 font-black text-[10px] uppercase">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {visibleRequests.map((req: any) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-black">#{req.id}</td>
                      <td className="p-4 text-slate-600">{req.date || "-"}</td>
                      <td className="p-4 font-bold">{req.company || "-"}</td>
                      <td className="p-4 text-slate-600">{req.delivery_country || "-"}</td>
                      <td className="p-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/requests?id=${req.id}`}
                          className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-[#108280] hover:text-white transition"
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

        {/* ── ADMIN: SUB-REQUESTS TABLE ──────────────────────────────────────── */}
        {isAdmin && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Admin Bereich</p>
              <h2 className="text-2xl font-black">Sub-Anfragen an Anbieter</h2>
            </div>

            {subRequests.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">Keine Sub-Anfragen vorhanden.</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Sobald eine Kundenanfrage auf Anbieter aufgeteilt wird, erscheinen die Sub-Anfragen hier.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-4 font-black text-[10px] uppercase">Sub-ID</th>
                      <th className="p-4 font-black text-[10px] uppercase">Haupt-ID</th>
                      <th className="p-4 font-black text-[10px] uppercase">Datum</th>
                      <th className="p-4 font-black text-[10px] uppercase">Firma</th>
                      <th className="p-4 font-black text-[10px] uppercase">Supplier</th>
                      <th className="p-4 font-black text-[10px] uppercase">Status</th>
                      <th className="p-4 font-black text-[10px] uppercase">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {subRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-black">#{req.id}</td>
                        <td className="p-4 text-slate-600">#{req.parent_request || "-"}</td>
                        <td className="p-4 text-slate-600">{req.date || "-"}</td>
                        <td className="p-4 font-bold">{req.company || "-"}</td>
                        <td className="p-4 text-slate-600">
                          {req.supplier_email || req.supplier_id || "-"}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/dashboard/requests?id=${req.id}`}
                            className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-[#108280] hover:text-white transition"
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

        {/* ── ADMIN: REGISTRATIONS TABLE ─────────────────────────────────────── */}
        {isAdmin && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">Admin Bereich</p>
              <h2 className="text-2xl font-black">Neue Registrierungen</h2>
            </div>

            {registrations.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black">Keine neuen Registrierungen.</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Sobald sich ein Unternehmen registriert, erscheint es hier.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-4 font-black text-[10px] uppercase">ID</th>
                      <th className="p-4 font-black text-[10px] uppercase">Datum</th>
                      <th className="p-4 font-black text-[10px] uppercase">Firma</th>
                      <th className="p-4 font-black text-[10px] uppercase">Kontakt</th>
                      <th className="p-4 font-black text-[10px] uppercase">E-Mail</th>
                      <th className="p-4 font-black text-[10px] uppercase">Land</th>
                      <th className="p-4 font-black text-[10px] uppercase">Typ</th>
                      <th className="p-4 font-black text-[10px] uppercase">Status</th>
                      <th className="p-4 font-black text-[10px] uppercase">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {registrations.map((reg: any) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-black">#{reg.id}</td>
                        <td className="p-4 text-slate-600">{reg.date || "-"}</td>
                        <td className="p-4 font-bold">{reg.company || "-"}</td>
                        <td className="p-4 text-slate-600">{reg.contact_name || "-"}</td>
                        <td className="p-4 text-slate-600">{reg.email || "-"}</td>
                        <td className="p-4 text-slate-600">{reg.country || "-"}</td>
                        <td className="p-4 text-slate-600">{reg.business_type || "-"}</td>
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
                                reg.status === "approved" || reg.status === "rejected"
                              }
                            >
                              <option value="tb_buyer">Buyer</option>
                              <option value="tb_supplier">Supplier</option>
                              <option value="tb_partner">Partner</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                disabled={
                                  reg.status === "approved" || reg.status === "rejected"
                                }
                                onClick={() => {
                                  const roleSelect = document.getElementById(
                                    `role-${reg.id}`
                                  ) as HTMLSelectElement;
                                  handleRegistrationAction(reg.id, "approve", roleSelect.value);
                                }}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Approve
                              </button>
                              <button
                                disabled={
                                  reg.status === "approved" || reg.status === "rejected"
                                }
                                onClick={() => handleRegistrationAction(reg.id, "reject")}
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

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("trustbridge_token");
            localStorage.removeItem("trustbridge_user");
            window.location.href = "/login";
          }}
          className="mt-4 rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-slate-800 transition"
        >
          Logout
        </button>
      </section>
    </main>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function DashboardCard({
  title,
  text,
  href,
  icon,
}: {
  title: string;
  text: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 font-medium">{text}</p>
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
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${classes}`}>
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
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${classes}`}>
      {label}
    </span>
  );
}
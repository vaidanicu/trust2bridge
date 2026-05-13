"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── INTERFACES ──────────────────────────────────────────────────────────────

interface TranslationDict { [key: string]: string; }
interface Translations { [lang: string]: TranslationDict; }
interface User { name: string; company?: string; roles: string[]; }

interface ProductItem {
  id: number; internal_id?: string; title: string; description: string;
  image?: string; gallery?: string[]; price?: string; currency?: string;
  unit?: string; country?: string; category?: string; subcategory?: string;
  wp_status?: string; supplier_name?: string; supplier_email?: string; type?: string;
}

interface RequestItem {
  id: number; date?: string; company?: string; delivery_country?: string;
  status: string; parent_request?: number;
}

interface RegistrationItem {
  id: number; date: string; company: string; contact_name: string;
  email: string; phone?: string; vat?: string; country?: string;
  status?: string; business_type?: string; message?: string;
  lang?: string; package?: string;
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const translations: Translations = {
  de: {
    welcome: "Willkommen", company: "Firma", role: "Rolle", logout: "Abmelden",
    loading: "Lade Dashboard...", marketplace: "Marktplatz",
    marketplace_desc: "Produkte und Dienstleistungen ansehen.",
    inbox: "Eingehende Anfragen", inbox_desc: "Neue Lieferantenanfragen prüfen.",
    offers: "Angebote", offers_desc: "Antworten und Angebote verwalten.",
    basket: "Anfragekorb", basket_desc: "Ihre aktuelle Beschaffungsanfrage bearbeiten.",
    new_req: "Neue Anfrage", new_req_desc: "Produkt oder Dienstleistung suchen lassen.",
    admin_area: "Admin Bereich", prod_approval: "Produktfreigabe", control: "Kontrolle",
    no_pending_prods: "Keine Produkte zur Freigabe.",
    no_pending_prods_desc: "Sobald Produkte eingereicht werden, erscheinen sie hier.",
    my_listings: "Meine Angebote", no_listings: "Noch keine Angebote vorhanden.",
    main_reqs_title: "Hauptanfragen von Kunden", sub_reqs_title: "Sub-Anfragen an Anbieter",
    new_regs_title: "Neue Registrierungen", no_regs: "Keine neuen Registrierungen.",
    no_regs_desc: "Sobald sich ein Unternehmen registriert, erscheint es hier.",
    no_reqs: "Noch keine Anfragen vorhanden.",
    no_reqs_desc: "Sobald Anfragen vorhanden sind, erscheinen sie hier.",
    t_product: "Produkt", t_supplier: "Anbieter", t_status: "Status", t_action: "Aktion",
    t_id: "ID", t_date: "Datum", t_company: "Firma", t_country: "Zielland",
    t_contact: "Kontakt", t_email: "E-Mail", t_vat: "USt-IdNr.", t_reg_country: "Land",
    t_type: "Typ", t_phone: "Telefon", t_package: "Paket", t_message: "Nachricht", t_lang: "Sprache",
    btn_details: "Details", btn_approve: "Freigeben", btn_delete: "Löschen",
    btn_reject: "Ablehnen", btn_open: "Öffnen",
    m_gallery: "Galerie", m_no_images: "Keine Bilder", m_desc: "Beschreibung",
    m_price: "Preis", m_unit: "Einheit", m_cat: "Kategorie", m_subcat: "Unterkategorie",
    m_supp_info: "Anbieter", m_internal_id: "Interne ID", m_on_request: "Auf Anfrage",
    m_approve_prod: "PRODUKT FREIGEBEN", m_delete_prod: "PRODUKT LÖSCHEN",
    s_live: "Live", s_waiting: "Wartend", s_active: "Aktiv", s_in_review: "In Prüfung",
    s_new: "Neu", s_processing: "In Bearbeitung", s_sent_partner: "An Partner gesendet",
    s_sent_supp: "An Anbieter gesendet", s_offer_rec: "Angebot erhalten",
    s_completed: "Abgeschlossen", s_rejected: "Abgelehnt",
    confirm_delete: "Produkt unwiderruflich löschen?",
    alert_reg_approved: "Registrierung genehmigt.", alert_reg_rejected: "Registrierung abgelehnt.",
    alert_prod_approved: "Produkt freigegeben.", alert_prod_deleted: "Produkt gelöscht.",
    alert_error: "Fehler.", alert_server_error: "Serverfehler."
  },
  ro: {
    welcome: "Bun venit", company: "Companie", role: "Rol", logout: "Deconectare",
    loading: "Se încarcă...", marketplace: "Piață",
    marketplace_desc: "Vizualizați produse și servicii.",
    inbox: "Cereri primite", inbox_desc: "Verificați cererile noi.",
    offers: "Oferte", offers_desc: "Gestionați răspunsurile și ofertele.",
    basket: "Coș cereri", basket_desc: "Editați cererea curentă.",
    new_req: "Cerere nouă", new_req_desc: "Solicitați căutarea unui produs.",
    admin_area: "Admin", prod_approval: "Aprobare Produse", control: "Control",
    no_pending_prods: "Nu există produse pentru aprobare.",
    no_pending_prods_desc: "Produsele trimise vor apărea aici.",
    my_listings: "Ofertele mele", no_listings: "Nu aveți nicio ofertă.",
    main_reqs_title: "Cereri principale", sub_reqs_title: "Sub-cereri",
    new_regs_title: "Înregistrări noi", no_regs: "Nu există înregistrări noi.",
    no_regs_desc: "Companiile înregistrate vor apărea aici.",
    no_reqs: "Nu există cereri.", no_reqs_desc: "Cererile primite vor apărea aici.",
    t_product: "Produs", t_supplier: "Furnizor", t_status: "Status", t_action: "Acțiune",
    t_id: "ID", t_date: "Data", t_company: "Companie", t_country: "Țară",
    t_contact: "Contact", t_email: "Email", t_vat: "CIF", t_reg_country: "Țară",
    t_type: "Tip", t_phone: "Telefon", t_package: "Pachet", t_message: "Mesaj", t_lang: "Limbă",
    btn_details: "Detalii", btn_approve: "Aprobă", btn_delete: "Șterge",
    btn_reject: "Respinge", btn_open: "Deschide",
    m_gallery: "Galerie", m_no_images: "Fără imagini", m_desc: "Descriere",
    m_price: "Preț", m_unit: "Unitate", m_cat: "Categorie", m_subcat: "Subcategorie",
    m_supp_info: "Furnizor", m_internal_id: "ID Intern", m_on_request: "La cerere",
    m_approve_prod: "APROBĂ PRODUSUL", m_delete_prod: "ȘTERGE PRODUSUL",
    s_live: "Activ", s_waiting: "Așteptare", s_active: "Activ", s_in_review: "Verificare",
    s_new: "Nou", s_processing: "Procesare", s_sent_partner: "Trimis partener",
    s_sent_supp: "Trimis furnizor", s_offer_rec: "Ofertă primită",
    s_completed: "Finalizat", s_rejected: "Respins",
    confirm_delete: "Ștergeți produsul definitiv?",
    alert_reg_approved: "Înregistrare aprobată.", alert_reg_rejected: "Înregistrare respinsă.",
    alert_prod_approved: "Produs aprobat.", alert_prod_deleted: "Produs șters.",
    alert_error: "Eroare.", alert_server_error: "Eroare de server."
  },
  hu: {
    welcome: "Üdvözöljük", company: "Cég", role: "Szerepkör", logout: "Kijelentkezés",
    loading: "Betöltés...", marketplace: "Piactér",
    marketplace_desc: "Termékek és szolgáltatások megtekintése.",
    inbox: "Beérkező kérések", inbox_desc: "Új ajánlatkérések ellenőrzése.",
    offers: "Ajánlatok", offers_desc: "Válaszok és ajánlatok kezelése.",
    basket: "Kosár", basket_desc: "Aktuális igény szerkesztése.",
    new_req: "Új kérés", new_req_desc: "Termék keresése.",
    admin_area: "Admin", prod_approval: "Termék jóváhagyása", control: "Ellenőrzés",
    no_pending_prods: "Nincs jóváhagyásra váró termék.",
    no_pending_prods_desc: "A beküldött termékek itt fognak megjelenni.",
    my_listings: "Saját ajánlataim", no_listings: "Még nincsenek ajánlatai.",
    main_reqs_title: "Fő kérések", sub_reqs_title: "Al-kérések",
    new_regs_title: "Új regisztrációk", no_regs: "Nincsenek új regisztrációk.",
    no_regs_desc: "A regisztrált cégek itt fognak megjelenni.",
    no_reqs: "Nincsenek kérések.", no_reqs_desc: "A beérkező kérések itt fognak megjelenni.",
    t_product: "Termék", t_supplier: "Beszállító", t_status: "Állapot", t_action: "Művelet",
    t_id: "ID", t_date: "Dátum", t_company: "Cég", t_country: "Ország",
    t_contact: "Kapcsolat", t_email: "E-mail", t_vat: "Adószám", t_reg_country: "Ország",
    t_type: "Típus", t_phone: "Telefon", t_package: "Csomag", t_message: "Üzenet", t_lang: "Nyelv",
    btn_details: "Részletek", btn_approve: "Jóváhagyás", btn_delete: "Törlés",
    btn_reject: "Elutasítás", btn_open: "Megnyitás",
    m_gallery: "Galéria", m_no_images: "Nincsenek képek", m_desc: "Leírás",
    m_price: "Ár", m_unit: "Egység", m_cat: "Kategória", m_subcat: "Alkategória",
    m_supp_info: "Beszállító", m_internal_id: "Belső ID", m_on_request: "Ajánlat alapján",
    m_approve_prod: "TERMÉK JÓVÁHAGYÁSA", m_delete_prod: "TERMÉK TÖRLÉSE",
    s_live: "Élő", s_waiting: "Várakozik", s_active: "Aktív", s_in_review: "Ellenőrzés",
    s_new: "Új", s_processing: "Feldolgozás", s_sent_partner: "Partnernek küldve",
    s_sent_supp: "Beszállítónak küldve", s_offer_rec: "Ajánlat beérkezett",
    s_completed: "Befejezve", s_rejected: "Elutasítva",
    confirm_delete: "Véglegesen törli a terméket?",
    alert_reg_approved: "Regisztráció jóváhagyva.", alert_reg_rejected: "Regisztráció elutasítva.",
    alert_prod_approved: "Termék jóváhagyva.", alert_prod_deleted: "Termék törölve.",
    alert_error: "Hiba történt.", alert_server_error: "Szerverhiba."
  }
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status, dict }: { status: string; dict: TranslationDict }) {
  const map: Record<string, [string, string]> = {
    nou:               [dict.s_new,          "bg-blue-500/10 text-blue-400 border-blue-500/20"],
    pending:           [dict.s_waiting,      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"],
    pending_review:    [dict.s_waiting,      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"],
    processing:        [dict.s_processing,   "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"],
    sent_to_partner:   [dict.s_sent_partner, "bg-purple-500/10 text-purple-400 border-purple-500/20"],
    sent_to_supplier:  [dict.s_sent_supp,    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"],
    offer_received:    [dict.s_offer_rec,    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"],
    completed:         [dict.s_completed,    "bg-green-500/10 text-green-400 border-green-500/20"],
    rejected:          [dict.s_rejected,     "bg-red-500/10 text-red-400 border-red-500/20"],
    approved:          [dict.s_active,       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"],
  };
  const [label, cls] = map[status] || [status, "bg-slate-500/10 text-slate-400 border-slate-500/20"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────

function ProductModal({ item, onClose, onApprove, onReject, isAdmin, dict, lang }: {
  item: ProductItem; onClose: () => void; onApprove?: (id: number) => void;
  onReject?: (id: number) => void; isAdmin: boolean; dict: TranslationDict; lang: string;
}) {
  const isLive = item.wp_status === "publish";
  const allImages = [item.image, ...(item.gallery || [])].filter((img): img is string => !!img);
  const priceDisplay = formatConvertedPrice(item.price, lang) ||
    (item.price ? `${item.price} ${item.currency || "EUR"}` : dict.m_on_request);

  return (
    <>
      <style>{modalStyles}</style>
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <div className="modal-header">
            <div>
              <div className="modal-chips">
                <span className="chip chip-gray">REF: {item.internal_id || item.id}</span>
                <span className="chip chip-teal">{item.type || "Angebot"}</span>
              </div>
              <h2 className="modal-title">{item.title}</h2>
            </div>
            <button onClick={onClose} className="modal-close">✕</button>
          </div>

          <div className="modal-body">
            <div className="modal-left">
              <p className="field-label">{dict.m_gallery}</p>
              {allImages.length > 0 ? (
                <div className="img-grid">
                  {allImages.map((img, i) => (
                    <div key={i} className={`img-wrap ${i === 0 ? "img-main" : "img-thumb"}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="img-empty">{dict.m_no_images}</div>
              )}
              <p className="field-label mt-6">{dict.m_desc}</p>
              <div className="prose-box" dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>

            <div className="modal-right">
              <div className="data-grid">
                <DataCell label={dict.t_status} value={isLive ? `✅ ${dict.s_live}` : `⏳ ${dict.s_waiting}`} accent={!isLive} />
                <DataCell label={dict.m_price} value={priceDisplay} />
                <DataCell label={dict.m_unit} value={item.unit || "-"} />
                <DataCell label={dict.t_country} value={item.country || "-"} />
                <DataCell label={dict.m_cat} value={item.category || "-"} />
                <DataCell label={dict.m_subcat} value={item.subcategory || "-"} />
              </div>

              <div className="supplier-box">
                <p className="field-label teal">{dict.m_supp_info}</p>
                <p className="supplier-name">{item.supplier_name || "---"}</p>
                <p className="supplier-email">{item.supplier_email}</p>
                <div className="supplier-id">
                  <span className="field-label">{dict.m_internal_id}</span>
                  <code>{item.internal_id || "N/A"}</code>
                </div>
              </div>

              {isAdmin && (
                <div className="modal-actions">
                  {!isLive && (
                    <button onClick={() => onApprove?.(item.id)} className="btn-approve">
                      ✓ {dict.m_approve_prod}
                    </button>
                  )}
                  <button onClick={() => { if (confirm(dict.confirm_delete)) onReject?.(item.id); }} className="btn-danger">
                    ✕ {dict.m_delete_prod}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DataCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`data-cell ${accent ? "data-cell-accent" : ""}`}>
      <span className="data-label">{label}</span>
      <span className={`data-value ${accent ? "data-value-accent" : ""}`}>{value}</span>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "de";
  const dict = translations[lang] || translations.de;

  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [myItems, setMyItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [expandedReg, setExpandedReg] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) { window.location.href = `/${lang}/login`; return; }

    async function load() {
      try {
        const token = localStorage.getItem("trustbridge_token");
        const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
        const meData = await meRes.json();
        if (meData.code) { window.location.href = `/${lang}/login`; return; }
        setUser(meData);

        const isAdmin = meData.roles?.includes("administrator");
        const isSupplier = meData.roles?.includes("tb_supplier") || meData.roles?.includes("TrustBridge_Supplier");

        const reqRes = await fetch(`${API}/requests`, { headers: { Authorization: `Bearer ${token}` } });
        setRequests(Array.isArray(await reqRes.json()) ? await fetch(`${API}/requests`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()) : []);

        if (isAdmin) {
          const [itemsData, regData] = await Promise.all([
            fetch(`${API}/items-admin?lang=${lang}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API}/registrations`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          ]);
          setMyItems(Array.isArray(itemsData) ? itemsData : []);
          setRegistrations(Array.isArray(regData) ? regData : []);
        } else if (isSupplier) {
          const itemsData = await fetch(`${API}/my-items?lang=${lang}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
          setMyItems(Array.isArray(itemsData) ? itemsData : []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [lang]);

  const handleRegistrationAction = async (id: number, action: "approve" | "reject", selectedRole?: string) => {
    const token = localStorage.getItem("trustbridge_token");
    const res = await fetch(`${API}/registration-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action, role: selectedRole || "tb_buyer" }),
    });
    const data = await res.json();
    if (data.success) { alert(action === "approve" ? dict.alert_reg_approved : dict.alert_reg_rejected); window.location.reload(); }
    else alert(data.message || dict.alert_error);
  };

  const handleItemAction = async (id: number, action: "approve" | "reject") => {
    const token = localStorage.getItem("trustbridge_token");
    const res = await fetch(`${API}/item-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    if (data.success) { alert(action === "approve" ? dict.alert_prod_approved : dict.alert_prod_deleted); setSelectedItem(null); window.location.reload(); }
    else alert(data.message || dict.alert_error);
  };

  if (loading) return (
    <>
      <style>{globalStyles}</style>
      <main className="db-page db-loading"><div className="db-spinner" /><p>{dict.loading}</p></main>
    </>
  );

  const isAdmin = user?.roles?.includes("administrator");
  const isSupplier = user?.roles?.includes("tb_supplier") || user?.roles?.includes("TrustBridge_Supplier");
  const visibleRequests = isAdmin ? requests.filter(r => !r.parent_request) : requests;
  const subRequests = isAdmin ? requests.filter(r => r.parent_request) : [];

  const packageLabel: Record<string, string> = {
    basic: lang === "ro" ? "Prezență de bază" : lang === "hu" ? "Alap megjelenés" : "Basis-Präsenz",
    verified: lang === "ro" ? "Furnizor verificat" : lang === "hu" ? "Ellenőrzött beszállító" : "Verified Supplier",
    active: lang === "ro" ? "Vânzare activă" : lang === "hu" ? "Aktív értékesítés" : "Aktiver Vertrieb",
  };
  const packageColor: Record<string, string> = {
    basic: "pkg-emerald", verified: "pkg-yellow", active: "pkg-blue",
  };

  return (
    <>
      <style>{globalStyles}</style>

      {selectedItem && (
        <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)}
          isAdmin={!!isAdmin} dict={dict} lang={lang}
          onApprove={id => handleItemAction(id, "approve")}
          onReject={id => handleItemAction(id, "reject")} />
      )}

      <main className="db-page">

        {/* ── HERO ── */}
        <header className="db-hero">
          <div className="db-hero-grid" />
          <div className="db-hero-glow" />
          <div className="db-hero-inner">
            <span className="db-hero-chip">TrustBridge Dashboard</span>
            <h1 className="db-hero-title">{dict.welcome}, <span className="db-hero-name">{user?.name}</span></h1>
            <p className="db-hero-meta">
              <span>{dict.company}: <strong>{user?.company || "—"}</strong></span>
              <span className="db-dot" />
              <span>{dict.role}: <strong>{user?.roles?.[0]}</strong></span>
            </p>
          </div>
        </header>

        <div className="db-content">

          {/* ── NAV CARDS ── */}
          <div className="nav-grid">
            <NavCard title={dict.marketplace} desc={dict.marketplace_desc} href={`/${lang}/marketplace`} icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            } />
            {isSupplier ? (
              <>
                <NavCard title={dict.inbox} desc={dict.inbox_desc} href={`/${lang}/dashboard`} icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                } />
                <NavCard title={dict.offers} desc={dict.offers_desc} href={`/${lang}/dashboard`} icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                } />
              </>
            ) : (
              <>
                <NavCard title={dict.basket} desc={dict.basket_desc} href={`/${lang}/request-basket`} icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                } />
                <NavCard title={dict.new_req} desc={dict.new_req_desc} href={`/${lang}/request-basket`} icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                } />
              </>
            )}
          </div>

          {/* ── ADMIN: PRODUCT APPROVAL ── */}
          {isAdmin && (
            <Section title={dict.prod_approval} badge={dict.control} badgeColor="orange">
              {myItems.length === 0 ? (
                <Empty title={dict.no_pending_prods} desc={dict.no_pending_prods_desc} />
              ) : (
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <Th>{dict.t_product}</Th><Th>{dict.t_supplier}</Th>
                        <Th>{dict.t_status}</Th><Th right>{dict.t_action}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {myItems.map(item => (
                        <tr key={item.id} className="db-tr">
                          <td className="db-td">
                            <p className="td-main">{item.title}</p>
                            <p className="td-sub">{item.category}</p>
                          </td>
                          <td className="db-td">
                            <p className="td-main">{item.supplier_name || "—"}</p>
                            <p className="td-sub">{item.supplier_email}</p>
                          </td>
                          <td className="db-td">
                            <span className={`status-pill ${item.wp_status === "publish" ? "pill-green" : "pill-yellow"}`}>
                              {item.wp_status === "publish" ? dict.s_live : dict.s_waiting}
                            </span>
                          </td>
                          <td className="db-td text-right">
                            <div className="action-row">
                              <button onClick={() => setSelectedItem(item)} className="btn-teal-sm">{dict.btn_details}</button>
                              {item.wp_status !== "publish" && (
                                <button onClick={() => handleItemAction(item.id, "approve")} className="btn-green-sm">{dict.btn_approve}</button>
                              )}
                              <button onClick={() => handleItemAction(item.id, "reject")} className="btn-red-sm">{dict.btn_delete}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          )}

          {/* ── SUPPLIER: MY LISTINGS ── */}
          {isSupplier && !isAdmin && (
            <Section title={dict.my_listings}>
              {myItems.length === 0 ? <Empty title={dict.no_listings} /> : (
                <div className="listings-grid">
                  {myItems.map(item => (
                    <div key={item.id} className="listing-card" onClick={() => setSelectedItem(item)}>
                      <div>
                        <p className="td-main">{item.title}</p>
                        <p className="td-sub">Ref: {item.internal_id || item.id}</p>
                      </div>
                      <span className={`status-pill ${item.wp_status === "publish" ? "pill-green" : "pill-yellow"}`}>
                        {item.wp_status === "publish" ? dict.s_active : dict.s_in_review}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* ── REQUESTS ── */}
          <Section title={isAdmin ? dict.main_reqs_title : isSupplier ? dict.inbox : dict.basket}
            action={!isSupplier && !isAdmin ? { label: dict.new_req, href: `/${lang}/request-basket` } : undefined}>
            {visibleRequests.length === 0 ? <Empty title={dict.no_reqs} desc={dict.no_reqs_desc} /> : (
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr><Th>{dict.t_id}</Th><Th>{dict.t_date}</Th><Th>{dict.t_company}</Th><Th>{dict.t_country}</Th><Th>{dict.t_status}</Th><Th>{dict.t_action}</Th></tr>
                  </thead>
                  <tbody>
                    {visibleRequests.map(req => (
                      <tr key={req.id} className="db-tr">
                        <td className="db-td td-mono">#{req.id}</td>
                        <td className="db-td td-muted">{req.date || "—"}</td>
                        <td className="db-td td-main">{req.company || "—"}</td>
                        <td className="db-td td-muted">{req.delivery_country || "—"}</td>
                        <td className="db-td"><StatusBadge status={req.status} dict={dict} /></td>
                        <td className="db-td">
                          <Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="btn-ghost-sm">{dict.btn_open}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* ── SUB-REQUESTS ── */}
          {(isAdmin || isSupplier) && subRequests.length > 0 && (
            <Section title={dict.sub_reqs_title} accentColor="orange">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr><Th>{dict.t_id}</Th><Th>{dict.t_date}</Th><Th>Parent</Th><Th>{dict.t_company}</Th><Th>{dict.t_status}</Th><Th>{dict.t_action}</Th></tr>
                  </thead>
                  <tbody>
                    {subRequests.map(req => (
                      <tr key={req.id} className="db-tr">
                        <td className="db-td td-mono">#{req.id}</td>
                        <td className="db-td td-muted">{req.date || "—"}</td>
                        <td className="db-td"><span className="parent-badge">#{req.parent_request}</span></td>
                        <td className="db-td td-main">{req.company || "—"}</td>
                        <td className="db-td"><StatusBadge status={req.status} dict={dict} /></td>
                        <td className="db-td">
                          <Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="btn-ghost-sm">{dict.btn_open}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* ── REGISTRATIONS ── */}
          {isAdmin && (
            <Section title={dict.new_regs_title}>
              {registrations.length === 0 ? <Empty title={dict.no_regs} desc={dict.no_regs_desc} /> : (
                <div className="regs-list">
                  {registrations.map(reg => {
                    const isOpen = expandedReg === reg.id;
                    const pkgKey = reg.package || "";
                    return (
                      <div key={reg.id} className={`reg-card ${isOpen ? "reg-card-open" : ""}`}>

                        {/* ── REG HEADER ── */}
                        <div className="reg-head" onClick={() => setExpandedReg(isOpen ? null : reg.id)}>
                          <div className="reg-head-left">
                            <span className="td-mono">#{reg.id}</span>
                            <div>
                              <p className="reg-company">{reg.company}</p>
                              <p className="td-sub">{reg.date}</p>
                            </div>
                          </div>
                          <div className="reg-head-right">
                            {pkgKey && (
                              <span className={`pkg-badge ${packageColor[pkgKey] || "pkg-gray"}`}>
                                {packageLabel[pkgKey] || pkgKey}
                              </span>
                            )}
                            <StatusBadge status={reg.status || "nou"} dict={dict} />
                            {reg.lang && <span className="lang-badge">{reg.lang.toUpperCase()}</span>}
                            <svg className={`reg-chevron ${isOpen ? "reg-chevron-open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </div>

                        {/* ── REG EXPANDED ── */}
                        {isOpen && (
                          <div className="reg-body">
                            {/* Data fields grid */}
                            <div className="reg-fields">
                              <RegField label={dict.t_contact} value={reg.contact_name} />
                              <RegField label={dict.t_email} value={reg.email} isEmail />
                              <RegField label={dict.t_phone} value={reg.phone || "—"} />
                              <RegField label={dict.t_reg_country} value={reg.country || "—"} />
                              <RegField label={dict.t_vat} value={reg.vat || "—"} isMono />
                              <RegField label={dict.t_type} value={reg.business_type || "—"} />
                              <RegField label={dict.t_lang} value={reg.lang?.toUpperCase() || "—"} />
                              <RegField
                                label={dict.t_package}
                                value={pkgKey ? (packageLabel[pkgKey] || pkgKey) : "—"}
                                highlight={!!pkgKey}
                                highlightColor={pkgKey === "basic" ? "emerald" : pkgKey === "verified" ? "yellow" : pkgKey === "active" ? "blue" : undefined}
                              />
                            </div>

                            {/* Message */}
                            {reg.message && (
                              <div className="reg-message">
                                <p className="field-label-sm">{dict.t_message}</p>
                                <p className="reg-message-text">{reg.message}</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="reg-actions">
                              <select id={`role-${reg.id}`}
                                defaultValue={reg.business_type === "supplier" ? "tb_supplier" : "tb_buyer"}
                                className="reg-role-select">
                                <option value="tb_buyer">Buyer</option>
                                <option value="tb_supplier">Supplier</option>
                                <option value="tb_partner">Partner</option>
                              </select>
                              <button
                                disabled={reg.status === "approved"}
                                onClick={() => {
                                  const s = document.getElementById(`role-${reg.id}`) as HTMLSelectElement;
                                  handleRegistrationAction(reg.id, "approve", s.value);
                                }}
                                className="btn-approve-reg">
                                ✓ {dict.btn_approve}
                              </button>
                              <button
                                disabled={reg.status === "approved"}
                                onClick={() => handleRegistrationAction(reg.id, "reject")}
                                className="btn-reject-reg">
                                ✕ {dict.btn_reject}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          )}

          {/* ── LOGOUT ── */}
          <button onClick={() => { localStorage.clear(); window.location.href = `/${lang}/login`; }} className="btn-logout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {dict.logout}
          </button>

        </div>
      </main>
    </>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function Section({ title, badge, badgeColor, accentColor, action, children }: {
  title: string; badge?: string; badgeColor?: string; accentColor?: string;
  action?: { label: string; href: string }; children: React.ReactNode;
}) {
  return (
    <div className="db-section">
      <div className="section-header">
        <div>
          <div className={`section-line ${accentColor === "orange" ? "line-orange" : "line-teal"}`} />
          <h2 className="section-title">
            {title}
            {badge && <span className={`section-badge ${badgeColor === "orange" ? "badge-orange" : "badge-teal"}`}>{badge}</span>}
          </h2>
        </div>
        {action && <Link href={action.href} className="btn-teal-sm">{action.label}</Link>}
      </div>
      {children}
    </div>
  );
}

function NavCard({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="nav-card">
      <div className="nav-icon">{icon}</div>
      <h3 className="nav-title">{title}</h3>
      <p className="nav-desc">{desc}</p>
    </Link>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`db-th ${right ? "text-right" : ""}`}>{children}</th>;
}

function Empty({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="db-empty">
      <div className="empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p className="empty-title">{title}</p>
      {desc && <p className="empty-desc">{desc}</p>}
    </div>
  );
}

function RegField({ label, value, isEmail, isMono, highlight, highlightColor }: {
  label: string; value: string; isEmail?: boolean; isMono?: boolean;
  highlight?: boolean; highlightColor?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "reg-field-emerald", yellow: "reg-field-yellow", blue: "reg-field-blue",
  };
  const cls = highlight && highlightColor ? colorMap[highlightColor] || "reg-field-highlight" : "";
  return (
    <div className={`reg-field ${cls}`}>
      <span className="field-label-sm">{label}</span>
      <span className={`reg-field-val ${isMono ? "font-mono" : ""} ${isEmail ? "reg-email" : ""}`}>{value}</span>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .db-page {
    font-family: 'DM Sans', sans-serif;
    background: #080d0d;
    min-height: 100vh;
    color: #cbd5e1;
    padding-bottom: 80px;
  }

  .db-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; color: #475569; font-size: 14px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .db-spinner {
    width: 32px; height: 32px; border: 2px solid #1a2828;
    border-top-color: #108280; border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  /* HERO */
  .db-hero {
    position: relative; overflow: hidden;
    padding: 52px 32px 48px; background: #080d0d;
  }
  .db-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(16,130,128,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,130,128,.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%);
  }
  .db-hero-glow {
    position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(16,130,128,.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .db-hero-inner { position: relative; max-width: 1200px; margin: 0 auto; }
  .db-hero-chip {
    display: inline-block; font-family: 'DM Mono', monospace; font-size: 10px;
    font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
    color: #108280; background: rgba(16,130,128,.1); border: 1px solid rgba(16,130,128,.2);
    border-radius: 100px; padding: 4px 14px; margin-bottom: 16px;
  }
  .db-hero-title { font-size: clamp(24px, 4vw, 38px); font-weight: 800; color: #f1f5f9; letter-spacing: -.025em; margin: 0 0 10px; }
  .db-hero-name { color: #2dd4bf; }
  .db-hero-meta { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #475569; }
  .db-hero-meta strong { color: #94a3b8; }
  .db-dot { width: 3px; height: 3px; border-radius: 50%; background: #334155; }

  /* CONTENT */
  .db-content { max-width: 1200px; margin: 0 auto; padding: 28px 24px 0; display: flex; flex-direction: column; gap: 20px; }

  /* NAV CARDS */
  .nav-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  @media (max-width: 680px) { .nav-grid { grid-template-columns: 1fr; } }

  .nav-card {
    background: #0f1717; border: 1px solid #1a2828; border-radius: 16px;
    padding: 22px; display: flex; flex-direction: column; gap: 10px;
    text-decoration: none; transition: border-color .18s, transform .15s, box-shadow .18s;
  }
  .nav-card:hover { border-color: rgba(16,130,128,.4); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(16,130,128,.1); }
  .nav-icon { width: 40px; height: 40px; background: rgba(16,130,128,.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #2dd4bf; }
  .nav-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin: 0; }
  .nav-desc { font-size: 12px; color: #475569; margin: 0; line-height: 1.5; }

  /* SECTIONS */
  .db-section { background: #0f1717; border: 1px solid #1a2828; border-radius: 18px; overflow: hidden; }
  .section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 22px 24px 18px; border-bottom: 1px solid #1a2828; }
  .section-line { width: 3px; height: 18px; border-radius: 2px; background: #108280; display: inline-block; margin-right: 10px; vertical-align: middle; }
  .line-orange { background: #f97316; }
  .section-title { font-size: 16px; font-weight: 700; color: #e2e8f0; margin: 0; display: inline; }
  .section-badge { font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; border-radius: 100px; padding: 2px 8px; margin-left: 8px; }
  .badge-teal { background: rgba(16,130,128,.12); color: #2dd4bf; }
  .badge-orange { background: rgba(249,115,22,.12); color: #fb923c; }

  /* TABLE */
  .db-table-wrap { overflow-x: auto; }
  .db-table { width: 100%; min-width: 640px; border-collapse: collapse; }
  .db-th { padding: 10px 16px; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #475569; background: #0b1313; border-bottom: 1px solid #1a2828; }
  .db-tr { transition: background .12s; }
  .db-tr:hover { background: rgba(16,130,128,.04); }
  .db-tr + .db-tr { border-top: 1px solid #1a2828; }
  .db-td { padding: 12px 16px; vertical-align: middle; }
  .td-main { font-size: 13px; font-weight: 600; color: #e2e8f0; }
  .td-sub { font-size: 11px; color: #475569; margin-top: 2px; }
  .td-muted { font-size: 13px; color: #64748b; }
  .td-mono { font-family: 'DM Mono', monospace; font-size: 12px; color: #94a3b8; }

  /* PILLS */
  .status-pill { display: inline-flex; align-items: center; border-radius: 100px; border: 1px solid; padding: 2px 10px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .pill-green { background: rgba(34,197,94,.1); color: #4ade80; border-color: rgba(34,197,94,.2); }
  .pill-yellow { background: rgba(234,179,8,.1); color: #facc15; border-color: rgba(234,179,8,.2); }

  /* BUTTONS */
  .action-row { display: flex; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }
  .btn-teal-sm { background: rgba(16,130,128,.15); color: #2dd4bf; border: 1px solid rgba(16,130,128,.25); border-radius: 8px; padding: 6px 12px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; text-decoration: none; transition: background .15s; white-space: nowrap; }
  .btn-teal-sm:hover { background: rgba(16,130,128,.3); }
  .btn-green-sm { background: rgba(34,197,94,.12); color: #4ade80; border: 1px solid rgba(34,197,94,.2); border-radius: 8px; padding: 6px 12px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-green-sm:hover { background: rgba(34,197,94,.22); }
  .btn-red-sm { background: rgba(239,68,68,.12); color: #f87171; border: 1px solid rgba(239,68,68,.2); border-radius: 8px; padding: 6px 12px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-red-sm:hover { background: rgba(239,68,68,.22); }
  .btn-ghost-sm { background: rgba(255,255,255,.04); color: #94a3b8; border: 1px solid #1a2828; border-radius: 8px; padding: 6px 12px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; text-decoration: none; transition: all .15s; white-space: nowrap; display: inline-block; }
  .btn-ghost-sm:hover { background: rgba(16,130,128,.12); color: #2dd4bf; border-color: rgba(16,130,128,.25); }

  .btn-logout { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.04); border: 1px solid #1a2828; border-radius: 10px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all .15s; margin-top: 4px; }
  .btn-logout:hover { background: rgba(239,68,68,.08); color: #f87171; border-color: rgba(239,68,68,.2); }

  /* LISTINGS */
  .listings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 16px; }
  @media (max-width: 600px) { .listings-grid { grid-template-columns: 1fr; } }
  .listing-card { display: flex; justify-content: space-between; align-items: center; background: #0b1313; border: 1px solid #1a2828; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: border-color .15s; }
  .listing-card:hover { border-color: rgba(16,130,128,.35); }

  /* EMPTY */
  .db-empty { padding: 40px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .empty-icon { width: 44px; height: 44px; background: rgba(255,255,255,.04); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #334155; }
  .empty-title { font-size: 14px; font-weight: 700; color: #64748b; }
  .empty-desc { font-size: 12px; color: #334155; }

  /* PARENT BADGE */
  .parent-badge { font-family: 'DM Mono', monospace; font-size: 11px; background: rgba(99,102,241,.1); color: #a5b4fc; border: 1px solid rgba(99,102,241,.2); border-radius: 6px; padding: 2px 8px; }

  /* ── REGISTRATIONS ── */
  .regs-list { display: flex; flex-direction: column; gap: 0; }

  .reg-card { border-bottom: 1px solid #1a2828; transition: background .12s; }
  .reg-card:last-child { border-bottom: none; }
  .reg-card-open { background: rgba(16,130,128,.03); }

  .reg-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; cursor: pointer; }
  .reg-head:hover { background: rgba(255,255,255,.02); }
  .reg-head-left { display: flex; align-items: center; gap: 14px; }
  .reg-head-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .reg-company { font-size: 14px; font-weight: 700; color: #e2e8f0; }

  .pkg-badge { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 100px; border: 1px solid; padding: 2px 10px; }
  .pkg-emerald { background: rgba(16,185,129,.1); color: #34d399; border-color: rgba(16,185,129,.25); }
  .pkg-yellow  { background: rgba(245,158,11,.1); color: #fbbf24; border-color: rgba(245,158,11,.25); }
  .pkg-blue    { background: rgba(59,130,246,.1); color: #60a5fa; border-color: rgba(59,130,246,.25); }
  .pkg-gray    { background: rgba(100,116,139,.1); color: #94a3b8; border-color: rgba(100,116,139,.25); }

  .lang-badge { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 600; background: rgba(255,255,255,.05); border: 1px solid #1a2828; border-radius: 4px; padding: 2px 6px; color: #64748b; }

  .reg-chevron { color: #334155; transition: transform .2s; flex-shrink: 0; }
  .reg-chevron-open { transform: rotate(180deg); color: #108280; }

  .reg-body { border-top: 1px solid #1a2828; }

  .reg-fields { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  @media (max-width: 760px) { .reg-fields { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 460px) { .reg-fields { grid-template-columns: 1fr; } }

  .reg-field { padding: 12px 20px; border-right: 1px solid #1a2828; border-bottom: 1px solid #1a2828; }
  .reg-field:nth-child(4n) { border-right: none; }
  .reg-field-val { font-size: 13px; font-weight: 600; color: #cbd5e1; display: block; margin-top: 3px; word-break: break-all; }
  .reg-email { color: #2dd4bf; font-size: 12px; }
  .field-label-sm { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #334155; }

  .reg-field-emerald { background: rgba(16,185,129,.04); }
  .reg-field-emerald .reg-field-val { color: #34d399; }
  .reg-field-yellow { background: rgba(245,158,11,.04); }
  .reg-field-yellow .reg-field-val { color: #fbbf24; }
  .reg-field-blue { background: rgba(59,130,246,.04); }
  .reg-field-blue .reg-field-val { color: #60a5fa; }
  .reg-field-highlight { background: rgba(16,130,128,.06); }
  .reg-field-highlight .reg-field-val { color: #2dd4bf; }

  .reg-message { padding: 14px 20px; border-bottom: 1px solid #1a2828; background: rgba(255,255,255,.015); }
  .reg-message-text { font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 4px; }

  .reg-actions { display: flex; align-items: center; gap: 10px; padding: 14px 20px; flex-wrap: wrap; }
  .reg-role-select { background: #0b1313; border: 1px solid #1a2828; border-radius: 8px; padding: 7px 12px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #e2e8f0; outline: none; cursor: pointer; }
  .reg-role-select option { background: #0f1717; }
  .btn-approve-reg { background: rgba(34,197,94,.12); color: #4ade80; border: 1px solid rgba(34,197,94,.2); border-radius: 8px; padding: 7px 16px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-approve-reg:hover:not(:disabled) { background: rgba(34,197,94,.22); }
  .btn-approve-reg:disabled { opacity: .35; cursor: not-allowed; }
  .btn-reject-reg { background: rgba(239,68,68,.1); color: #f87171; border: 1px solid rgba(239,68,68,.2); border-radius: 8px; padding: 7px 16px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-reject-reg:hover:not(:disabled) { background: rgba(239,68,68,.2); }
  .btn-reject-reg:disabled { opacity: .35; cursor: not-allowed; }
`;

const modalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.75); backdrop-filter: blur(8px); padding: 16px; }
  .modal-box { background: #0f1717; border: 1px solid #1e2d2d; border-radius: 20px; width: 100%; max-width: 860px; max-height: 90vh; overflow-y: auto; font-family: 'DM Sans', sans-serif; }
  .modal-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 24px; border-bottom: 1px solid #1e2d2d; background: #0f1717; }
  .modal-chips { display: flex; gap: 6px; margin-bottom: 6px; }
  .chip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 6px; padding: 2px 8px; }
  .chip-gray { background: rgba(255,255,255,.05); color: #64748b; }
  .chip-teal { background: rgba(16,130,128,.12); color: #2dd4bf; }
  .modal-title { font-size: 20px; font-weight: 800; color: #f1f5f9; }
  .modal-close { width: 34px; height: 34px; flex-shrink: 0; background: rgba(255,255,255,.05); border: 1px solid #1e2d2d; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; font-size: 12px; transition: all .15s; }
  .modal-close:hover { background: rgba(239,68,68,.12); color: #f87171; border-color: rgba(239,68,68,.2); }
  .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; }
  @media (max-width: 640px) { .modal-body { grid-template-columns: 1fr; } }
  .modal-left { display: flex; flex-direction: column; gap: 20px; }
  .modal-right { display: flex; flex-direction: column; gap: 16px; }
  .field-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #334155; margin-bottom: 8px; }
  .field-label.teal { color: #108280; }
  .img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .img-wrap { position: relative; border-radius: 10px; overflow: hidden; background: #0b1313; border: 1px solid #1a2828; }
  .img-main { grid-column: span 2; height: 200px; }
  .img-thumb { height: 120px; }
  .img-empty { height: 120px; border-radius: 10px; border: 1px dashed #1a2828; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #334155; font-style: italic; }
  .prose-box { background: #0b1313; border: 1px solid #1a2828; border-radius: 10px; padding: 16px; font-size: 13px; color: #64748b; line-height: 1.65; }
  .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .data-cell { background: #0b1313; border: 1px solid #1a2828; border-radius: 10px; padding: 12px; }
  .data-cell-accent { background: rgba(245,158,11,.06); border-color: rgba(245,158,11,.2); }
  .data-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #334155; display: block; margin-bottom: 4px; }
  .data-value { font-size: 13px; font-weight: 600; color: #e2e8f0; }
  .data-value-accent { color: #fbbf24; }
  .supplier-box { background: rgba(16,130,128,.06); border: 1px solid rgba(16,130,128,.15); border-radius: 12px; padding: 16px; }
  .supplier-name { font-size: 15px; font-weight: 800; color: #e2e8f0; margin: 6px 0 2px; }
  .supplier-email { font-size: 12px; color: #2dd4bf; }
  .supplier-id { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(16,130,128,.12); }
  .supplier-id code { font-family: 'DM Mono', monospace; font-size: 12px; color: #64748b; display: block; margin-top: 3px; }
  .modal-actions { display: flex; flex-direction: column; gap: 8px; }
  .btn-approve { background: rgba(34,197,94,.12); color: #4ade80; border: 1px solid rgba(34,197,94,.2); border-radius: 10px; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-approve:hover { background: rgba(34,197,94,.22); }
  .btn-danger { background: rgba(239,68,68,.08); color: #f87171; border: 1px solid rgba(239,68,68,.15); border-radius: 10px; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .btn-danger:hover { background: rgba(239,68,68,.18); }
  .mt-6 { margin-top: 24px; }
`;
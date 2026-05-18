"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

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

function StatusBadge({ status, dict }: { status: string; dict: TranslationDict }) {
  const map: Record<string, [string, string]> = {
    nou:               [dict.s_new,          "bg-blue-50 text-blue-600 border-blue-200"],
    pending:           [dict.s_waiting,      "bg-amber-50 text-amber-600 border-amber-200"],
    pending_review:    [dict.s_waiting,      "bg-amber-50 text-amber-600 border-amber-200"],
    processing:        [dict.s_processing,   "bg-violet-50 text-violet-600 border-violet-200"],
    sent_to_partner:   [dict.s_sent_partner, "bg-purple-50 text-purple-600 border-purple-200"],
    sent_to_supplier:  [dict.s_sent_supp,    "bg-cyan-50 text-cyan-700 border-cyan-200"],
    offer_received:    [dict.s_offer_rec,    "bg-teal-50 text-teal-700 border-teal-200"],
    completed:         [dict.s_completed,    "bg-emerald-50 text-emerald-700 border-emerald-200"],
    rejected:          [dict.s_rejected,     "bg-red-50 text-red-600 border-red-200"],
    approved:          [dict.s_active,       "bg-emerald-50 text-emerald-700 border-emerald-200"],
  };
  const [label, cls] = map[status] || [status, "bg-slate-100 text-slate-500 border-slate-200"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

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
    basic: "pkg-emerald", verified: "pkg-amber", active: "pkg-blue",
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

        {/* HERO */}
        <header className="db-hero">
          <div className="db-hero-inner">
            <div className="db-hero-left">
              <span className="db-hero-chip">TrustBridge Dashboard</span>
              <h1 className="db-hero-title">
                {dict.welcome}, <span className="db-hero-name">{user?.name}</span>
              </h1>
              <p className="db-hero-meta">
                <span>{dict.company}: <strong>{user?.company || "—"}</strong></span>
                <span className="db-dot" />
                <span>{dict.role}: <strong>{user?.roles?.[0]}</strong></span>
              </p>
            </div>
            <div className="db-hero-stats">
              <div className="hero-stat">
                <p className="hero-stat-num">{visibleRequests.length}</p>
                <p className="hero-stat-label">{dict.basket}</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-num">{myItems.length}</p>
                <p className="hero-stat-label">{dict.my_listings}</p>
              </div>
              {isAdmin && (
                <div className="hero-stat">
                  <p className="hero-stat-num">{registrations.length}</p>
                  <p className="hero-stat-label">{dict.new_regs_title}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="db-content">

          {/* NAV CARDS */}
          <div className="nav-grid">
            <NavCard title={dict.marketplace} desc={dict.marketplace_desc} href={`/${lang}/marketplace`} color="teal" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            } />
            {isSupplier ? (
              <>
                <NavCard title={dict.inbox} desc={dict.inbox_desc} href={`/${lang}/dashboard`} color="blue" icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                } />
                <NavCard title={dict.offers} desc={dict.offers_desc} href={`/${lang}/dashboard`} color="violet" icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                } />
              </>
            ) : (
              <>
                <NavCard title={dict.basket} desc={dict.basket_desc} href={`/${lang}/request-basket`} color="blue" icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                } />
                <NavCard title={dict.new_req} desc={dict.new_req_desc} href={`/${lang}/request-basket`} color="orange" icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                } />
              </>
            )}
          </div>

          {/* ADMIN: PRODUCT APPROVAL */}
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
                            <span className={`status-pill ${item.wp_status === "publish" ? "pill-green" : "pill-amber"}`}>
                              {item.wp_status === "publish" ? dict.s_live : dict.s_waiting}
                            </span>
                          </td>
                          <td className="db-td text-right">
                            <div className="action-row">
                              <button onClick={() => setSelectedItem(item)} className="btn-outline-sm">{dict.btn_details}</button>
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

          {/* SUPPLIER: MY LISTINGS */}
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
                      <span className={`status-pill ${item.wp_status === "publish" ? "pill-green" : "pill-amber"}`}>
                        {item.wp_status === "publish" ? dict.s_active : dict.s_in_review}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* REQUESTS */}
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
                          <Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="btn-outline-sm">{dict.btn_open}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* SUB-REQUESTS */}
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
                          <Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="btn-outline-sm">{dict.btn_open}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* REGISTRATIONS */}
          {isAdmin && (
            <Section title={dict.new_regs_title}>
              {registrations.length === 0 ? <Empty title={dict.no_regs} desc={dict.no_regs_desc} /> : (
                <div className="regs-list">
                  {registrations.map(reg => {
                    const isOpen = expandedReg === reg.id;
                    const pkgKey = reg.package || "";
                    return (
                      <div key={reg.id} className={`reg-card ${isOpen ? "reg-card-open" : ""}`}>
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
                        {isOpen && (
                          <div className="reg-body">
                            <div className="reg-fields">
                              <RegField label={dict.t_contact} value={reg.contact_name} />
                              <RegField label={dict.t_email} value={reg.email} isEmail />
                              <RegField label={dict.t_phone} value={reg.phone || "—"} />
                              <RegField label={dict.t_reg_country} value={reg.country || "—"} />
                              <RegField label={dict.t_vat} value={reg.vat || "—"} isMono />
                              <RegField label={dict.t_type} value={reg.business_type || "—"} />
                              <RegField label={dict.t_lang} value={reg.lang?.toUpperCase() || "—"} />
                              <RegField label={dict.t_package}
                                value={pkgKey ? (packageLabel[pkgKey] || pkgKey) : "—"}
                                highlight={!!pkgKey}
                                highlightColor={pkgKey === "basic" ? "emerald" : pkgKey === "verified" ? "amber" : pkgKey === "active" ? "blue" : undefined}
                              />
                            </div>
                            {reg.message && (
                              <div className="reg-message">
                                <p className="field-label-sm">{dict.t_message}</p>
                                <p className="reg-message-text">{reg.message}</p>
                              </div>
                            )}
                            <div className="reg-actions">
                              <select id={`role-${reg.id}`}
                                defaultValue={reg.business_type === "supplier" ? "tb_supplier" : "tb_buyer"}
                                className="reg-role-select">
                                <option value="tb_buyer">Buyer</option>
                                <option value="tb_supplier">Supplier</option>
                                <option value="tb_partner">Partner</option>
                              </select>
                              <button disabled={reg.status === "approved"}
                                onClick={() => {
                                  const s = document.getElementById(`role-${reg.id}`) as HTMLSelectElement;
                                  handleRegistrationAction(reg.id, "approve", s.value);
                                }}
                                className="btn-approve-reg">✓ {dict.btn_approve}</button>
                              <button disabled={reg.status === "approved"}
                                onClick={() => handleRegistrationAction(reg.id, "reject")}
                                className="btn-reject-reg">✕ {dict.btn_reject}</button>
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

          {/* LOGOUT */}
          <button onClick={() => { localStorage.clear(); window.location.href = `/${lang}/login`; }} className="btn-logout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {dict.logout}
          </button>

        </div>
      </main>
    </>
  );
}

function Section({ title, badge, badgeColor, accentColor, action, children }: {
  title: string; badge?: string; badgeColor?: string; accentColor?: string;
  action?: { label: string; href: string }; children: React.ReactNode;
}) {
  return (
    <div className="db-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
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

function NavCard({ title, desc, href, icon, color }: { title: string; desc: string; href: string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    teal:   "nav-card-teal",
    blue:   "nav-card-blue",
    violet: "nav-card-violet",
    orange: "nav-card-orange",
  };
  return (
    <Link href={href} className={`nav-card ${colorMap[color] || "nav-card-teal"}`}>
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
    emerald: "reg-field-emerald", amber: "reg-field-amber", blue: "reg-field-blue",
  };
  const cls = highlight && highlightColor ? colorMap[highlightColor] || "" : "";
  return (
    <div className={`reg-field ${cls}`}>
      <span className="field-label-sm">{label}</span>
      <span className={`reg-field-val ${isMono ? "font-mono text-xs" : ""} ${isEmail ? "reg-email" : ""}`}>{value}</span>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const globalStyles = `
  .db-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f1f5f9;
    min-height: 100vh;
    color: #1e293b;
    padding-bottom: 80px;
  }

  .db-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; color: #64748b; font-size: 14px; min-height: 100vh;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .db-spinner {
    width: 30px; height: 30px; border: 2px solid #e2e8f0;
    border-top-color: #0f766e; border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  /* ── HERO ── */
  .db-hero {
    background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%);
    padding: 40px 32px 36px;
  }
  .db-hero-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    flex-wrap: wrap;
  }
  .db-hero-chip {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    color: rgba(255,255,255,.8); background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.25); border-radius: 100px;
    padding: 3px 12px; margin-bottom: 12px;
  }
  .db-hero-title {
    font-size: clamp(22px, 3.5vw, 34px); font-weight: 800;
    color: #fff; letter-spacing: -.02em; margin: 0 0 8px;
  }
  .db-hero-name { color: #ccfbf1; }
  .db-hero-meta { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,.75); }
  .db-hero-meta strong { color: #fff; }
  .db-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,.4); }

  .db-hero-stats { display: flex; gap: 12px; flex-wrap: wrap; }
  .hero-stat {
    background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
    border-radius: 14px; padding: 14px 20px; text-align: center; min-width: 80px;
  }
  .hero-stat-num { font-size: 26px; font-weight: 800; color: #fff; line-height: 1; }
  .hero-stat-label { font-size: 11px; color: rgba(255,255,255,.7); margin-top: 4px; font-weight: 600; }

  /* ── CONTENT ── */
  .db-content {
    max-width: 1200px; margin: 0 auto;
    padding: 28px 24px 0;
    display: flex; flex-direction: column; gap: 20px;
  }

  /* ── NAV CARDS ── */
  .nav-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  @media (max-width: 680px) { .nav-grid { grid-template-columns: 1fr; } }

  .nav-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 20px; display: flex; flex-direction: column; gap: 10px;
    text-decoration: none; transition: border-color .18s, transform .15s, box-shadow .18s;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .nav-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
  .nav-card-teal:hover   { border-color: #0d9488; }
  .nav-card-blue:hover   { border-color: #3b82f6; }
  .nav-card-violet:hover { border-color: #7c3aed; }
  .nav-card-orange:hover { border-color: #f97316; }

  .nav-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-card-teal   .nav-icon { background: #f0fdfa; color: #0f766e; }
  .nav-card-blue   .nav-icon { background: #eff6ff; color: #2563eb; }
  .nav-card-violet .nav-icon { background: #f5f3ff; color: #6d28d9; }
  .nav-card-orange .nav-icon { background: #fff7ed; color: #c2410c; }

  .nav-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0; }
  .nav-desc  { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }

  /* ── SECTIONS ── */
  .db-section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.05);
  }
  .section-header {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 18px 24px; border-bottom: 1px solid #f1f5f9;
    background: #fafafa;
  }
  .section-line { width: 3px; height: 18px; border-radius: 2px; background: #0d9488; flex-shrink: 0; }
  .line-orange { background: #f97316; }
  .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
  .section-badge {
    font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    border-radius: 100px; padding: 2px 8px; margin-left: 8px; vertical-align: middle;
  }
  .badge-teal   { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
  .badge-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

  /* ── TABLE ── */
  .db-table-wrap { overflow-x: auto; }
  .db-table { width: 100%; min-width: 640px; border-collapse: collapse; }
  .db-th {
    padding: 10px 16px; font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #f1f5f9;
  }
  .db-tr { transition: background .1s; }
  .db-tr:hover { background: #f8fafc; }
  .db-tr + .db-tr { border-top: 1px solid #f1f5f9; }
  .db-td { padding: 12px 16px; vertical-align: middle; }
  .td-main  { font-size: 13px; font-weight: 600; color: #0f172a; }
  .td-sub   { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .td-muted { font-size: 13px; color: #64748b; }
  .td-mono  { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: #64748b; }

  /* ── STATUS PILLS ── */
  .status-pill {
    display: inline-flex; align-items: center; border-radius: 100px; border: 1px solid;
    padding: 2px 10px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  }
  .pill-green { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
  .pill-amber { background: #fffbeb; color: #b45309; border-color: #fde68a; }

  /* ── BUTTONS ── */
  .action-row { display: flex; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }

  .btn-outline-sm {
    background: #fff; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer;
    text-decoration: none; display: inline-block; transition: all .15s; white-space: nowrap;
  }
  .btn-outline-sm:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }

  .btn-teal-sm {
    background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; border-radius: 8px;
    padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer;
    text-decoration: none; display: inline-block; transition: background .15s; white-space: nowrap;
  }
  .btn-teal-sm:hover { background: #ccfbf1; }

  .btn-green-sm {
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 8px;
    padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background .15s;
  }
  .btn-green-sm:hover { background: #dcfce7; }

  .btn-red-sm {
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 8px;
    padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background .15s;
  }
  .btn-red-sm:hover { background: #fee2e2; }

  .btn-logout {
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 10px 18px; font-size: 13px; font-weight: 600; color: #64748b;
    cursor: pointer; transition: all .15s; margin-top: 4px; width: fit-content;
  }
  .btn-logout:hover { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }

  /* ── LISTINGS ── */
  .listings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 16px; }
  @media (max-width: 600px) { .listings-grid { grid-template-columns: 1fr; } }
  .listing-card {
    display: flex; justify-content: space-between; align-items: center;
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 14px 16px; cursor: pointer; transition: border-color .15s, box-shadow .15s;
  }
  .listing-card:hover { border-color: #0d9488; box-shadow: 0 2px 8px rgba(13,148,136,.1); }

  /* ── EMPTY ── */
  .db-empty { padding: 40px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .empty-icon { width: 44px; height: 44px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
  .empty-title { font-size: 14px; font-weight: 600; color: #64748b; }
  .empty-desc { font-size: 12px; color: #94a3b8; }

  /* ── PARENT BADGE ── */
  .parent-badge {
    font-family: monospace; font-size: 11px;
    background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe;
    border-radius: 6px; padding: 2px 8px;
  }

  /* ── REGISTRATIONS ── */
  .regs-list { display: flex; flex-direction: column; }
  .reg-card { border-bottom: 1px solid #f1f5f9; transition: background .1s; }
  .reg-card:last-child { border-bottom: none; }
  .reg-card-open { background: #fafffe; }

  .reg-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; cursor: pointer; }
  .reg-head:hover { background: #f8fafc; }
  .reg-head-left { display: flex; align-items: center; gap: 14px; }
  .reg-head-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .reg-company { font-size: 14px; font-weight: 700; color: #0f172a; }

  .pkg-badge { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 100px; border: 1px solid; padding: 2px 10px; }
  .pkg-emerald { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
  .pkg-amber   { background: #fffbeb; color: #b45309; border-color: #fde68a; }
  .pkg-blue    { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
  .pkg-gray    { background: #f8fafc; color: #64748b; border-color: #e2e8f0; }

  .lang-badge { font-family: monospace; font-size: 9px; font-weight: 600; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; padding: 2px 6px; color: #64748b; }

  .reg-chevron { color: #cbd5e1; transition: transform .2s; flex-shrink: 0; }
  .reg-chevron-open { transform: rotate(180deg); color: #0d9488; }

  .reg-body { border-top: 1px solid #f1f5f9; }

  .reg-fields { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  @media (max-width: 760px) { .reg-fields { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 460px) { .reg-fields { grid-template-columns: 1fr; } }

  .reg-field { padding: 12px 20px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
  .reg-field:nth-child(4n) { border-right: none; }
  .reg-field-val { font-size: 13px; font-weight: 600; color: #1e293b; display: block; margin-top: 3px; word-break: break-all; }
  .reg-email { color: #0f766e; font-size: 12px; }
  .field-label-sm { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #94a3b8; }

  .reg-field-emerald { background: #f0fdf4; }
  .reg-field-emerald .reg-field-val { color: #15803d; }
  .reg-field-amber { background: #fffbeb; }
  .reg-field-amber .reg-field-val { color: #b45309; }
  .reg-field-blue { background: #eff6ff; }
  .reg-field-blue .reg-field-val { color: #1d4ed8; }

  .reg-message { padding: 14px 20px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
  .reg-message-text { font-size: 13px; color: #475569; line-height: 1.6; margin-top: 4px; }

  .reg-actions { display: flex; align-items: center; gap: 10px; padding: 14px 20px; flex-wrap: wrap; }

  .reg-role-select {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 7px 12px; font-size: 12px; font-weight: 600; color: #0f172a; outline: none; cursor: pointer;
  }

  .btn-approve-reg {
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 8px;
    padding: 7px 16px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background .15s;
  }
  .btn-approve-reg:hover:not(:disabled) { background: #dcfce7; }
  .btn-approve-reg:disabled { opacity: .4; cursor: not-allowed; }

  .btn-reject-reg {
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 8px;
    padding: 7px 16px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background .15s;
  }
  .btn-reject-reg:hover:not(:disabled) { background: #fee2e2; }
  .btn-reject-reg:disabled { opacity: .4; cursor: not-allowed; }

  .flex { display: flex; }
  .items-center { align-items: center; }
  .gap-3 { gap: 12px; }
  .text-right { text-align: right; }
  .font-mono { font-family: monospace; }
  .text-xs { font-size: 11px; }
`;

const modalStyles = `
  .modal-overlay {
    position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,.5); backdrop-filter: blur(6px); padding: 16px;
  }
  .modal-box {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 20px;
    width: 100%; max-width: 860px; max-height: 90vh; overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    box-shadow: 0 25px 60px rgba(0,0,0,.18);
  }
  .modal-header {
    position: sticky; top: 0; z-index: 10; display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px; padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9; background: #fff;
  }
  .modal-chips { display: flex; gap: 6px; margin-bottom: 6px; }
  .chip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 6px; padding: 2px 8px; }
  .chip-gray { background: #f1f5f9; color: #64748b; }
  .chip-teal { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
  .modal-title { font-size: 20px; font-weight: 800; color: #0f172a; }
  .modal-close {
    width: 34px; height: 34px; flex-shrink: 0; background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer; font-size: 12px; transition: all .15s;
  }
  .modal-close:hover { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
  .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; }
  @media (max-width: 640px) { .modal-body { grid-template-columns: 1fr; } }
  .modal-left { display: flex; flex-direction: column; gap: 20px; }
  .modal-right { display: flex; flex-direction: column; gap: 16px; }
  .field-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
  .field-label.teal { color: #0d9488; }
  .img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .img-wrap { position: relative; border-radius: 10px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; }
  .img-main { grid-column: span 2; height: 200px; }
  .img-thumb { height: 120px; }
  .img-empty { height: 120px; border-radius: 10px; border: 1px dashed #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #94a3b8; font-style: italic; }
  .prose-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-size: 13px; color: #475569; line-height: 1.65; }
  .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .data-cell { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
  .data-cell-accent { background: #fffbeb; border-color: #fde68a; }
  .data-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 4px; }
  .data-value { font-size: 13px; font-weight: 600; color: #0f172a; }
  .data-value-accent { color: #b45309; }
  .supplier-box { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 16px; }
  .supplier-name { font-size: 15px; font-weight: 800; color: #0f172a; margin: 6px 0 2px; }
  .supplier-email { font-size: 12px; color: #0d9488; }
  .supplier-id { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ccfbf1; }
  .supplier-id code { font-family: monospace; font-size: 12px; color: #64748b; display: block; margin-top: 3px; }
  .modal-actions { display: flex; flex-direction: column; gap: 8px; }
  .btn-approve { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-approve:hover { background: #dcfce7; }
  .btn-danger { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 10px; padding: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .btn-danger:hover { background: #fee2e2; }
  .mt-6 { margin-top: 24px; }
`;
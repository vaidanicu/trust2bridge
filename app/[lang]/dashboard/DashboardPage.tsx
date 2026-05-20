"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User { id: number; name: string; company?: string; roles: string[]; lang?: string; }

interface ProductItem {
  id: number; internal_id?: string; title: string; description: string;
  short_description?: string; image?: string; gallery?: string[];
  documents?: { id: number; url: string; name: string }[];
  price?: string; currency?: string; price_status?: string; price_unit?: string;
  vat_note?: string; unit?: string; country?: string; location_city?: string;
  category?: string; subcategory?: string; wp_status?: string;
  supplier_name?: string; supplier_email?: string; type?: string;
  brand?: string; origin?: string; article_number?: string; condition?: string;
  quantity?: string; moq?: string; moq_unit?: string;
  technical_specs?: string; packaging?: string;
  incoterm?: string; delivery_time?: string; delivery_countries?: string[];
  transport_option?: string; pickup_location?: string;
  service_type?: string; service_mode?: string; service_area?: string[];
  availability?: string; billing_model?: string; document_types?: string[];
  contact_permission?: string; publication_status?: string;
}

interface RequestItem {
  id: number; date?: string; company?: string; email?: string;
  delivery_country?: string; transport_needed?: string; confidentiality?: string;
  status: string; parent_request?: number | string;
  offer_price?: string; offer_currency?: string;
  offer_delivery_time?: string; offer_terms?: string; offer_message?: string;
  customer_decision?: string; customer_decision_message?: string;
  // ── Smart Sourcing fields (nume reale din API) ──
  title?: string;
  custom_product?: string;
  custom_quantity?: string;
  custom_message?: string;
  request_text?: string;
  items?: {
    id: number; title: string; quantity?: string; unit?: string;
    delivery_location?: string; desired_date?: string; customer_note?: string;
  }[];
}

interface RegistrationItem {
  id: number; date: string; company: string; contact_name: string;
  email: string; phone?: string; vat?: string; country?: string;
  status?: string; business_type?: string; message?: string;
  lang?: string; package?: string;
}

// ─── Translations ─────────────────────────────────────────────────────────────

const TR: Record<string, Record<string, string>> = {
  de: {
    welcome:"Willkommen zurück", overview:"Übersicht Ihrer TrustBridge-Aktivitäten",
    dashboard:"Dashboard", company:"Firma", role:"Rolle", logout:"Abmelden",
    loading:"Daten werden geladen…",
    marketplace:"Marktplatz", marketplace_desc:"Produkte und Dienstleistungen ansehen.",
    inbox:"Eingehende Anfragen", inbox_desc:"Neue Lieferantenanfragen prüfen.",
    offers:"Angebote", offers_desc:"Antworten und Angebote verwalten.",
    basket:"Anfragekorb", basket_desc:"Ihre Beschaffungsanfrage bearbeiten.",
    new_req:"Neue Anfrage", new_req_desc:"Produkt oder Dienstleistung suchen lassen.",
    new_offer:"Neues Angebot",
    prod_approval:"Produktfreigabe", control:"Kontrolle",
    my_listings:"Meine Angebote", no_listings:"Noch keine Angebote.",
    main_reqs:"Hauptanfragen", sub_reqs:"Sub-Anfragen an Anbieter",
    new_regs:"Neue Registrierungen", no_regs:"Keine neuen Registrierungen.",
    no_reqs:"Noch keine Anfragen.", no_pending:"Keine Produkte zur Freigabe.",
    th_product:"Produkt", th_supplier:"Anbieter", th_status:"Status", th_action:"Aktion",
    th_id:"ID", th_date:"Datum", th_company:"Firma", th_country:"Land",
    th_contact:"Kontakt", th_email:"E-Mail", th_vat:"USt-IdNr.", th_type:"Typ",
    th_phone:"Telefon", th_package:"Paket", th_message:"Nachricht", th_lang:"Sprache",
    th_offer:"Angebotspreis", th_decision:"Entscheidung",
    d_article:"Artikel-Nr.", d_brand:"Marke", d_origin:"Herkunft",
    d_city:"Lagerort", d_condition:"Zustand", d_moq:"MOQ",
    d_specs:"Technische Daten", d_packaging:"Verpackung",
    d_short:"Kurzbeschreibung", d_description:"Beschreibung",
    d_incoterm:"Incoterm", d_delivery_time:"Lieferzeit",
    d_countries:"Lieferländer", d_transport:"Transport",
    d_pickup:"Abholort", d_vat:"MwSt.", d_price_unit:"Preis je",
    d_pub:"Veröffentlichung", d_contact:"Kontakt",
    d_service_type:"Service-Typ", d_service_mode:"Modus",
    d_service_area:"Servicegebiet", d_availability:"Verfügbarkeit",
    d_billing:"Abrechnung", d_doc_types:"Dokumenttypen",
    d_documents:"Dokumente", d_photos:"Fotos",
    btn_details:"Details", btn_approve:"Freigeben", btn_delete:"Löschen",
    btn_reject:"Ablehnen", btn_open:"Öffnen",
    btn_show:"Details anzeigen", btn_hide:"Zuklappen",
    s_live:"Live", s_waiting:"Wartend", s_active:"Aktiv", s_in_review:"In Prüfung",
    s_new:"Neu", s_processing:"In Bearbeitung", s_sent_supp:"An Anbieter",
    s_offer_rec:"Angebot erhalten", s_completed:"Abgeschlossen", s_rejected:"Abgelehnt",
    on_request:"Auf Anfrage", confirm_delete:"Produkt unwiderruflich löschen?",
    alert_approved:"Genehmigt.", alert_rejected:"Abgelehnt.", alert_deleted:"Gelöscht.", alert_error:"Fehler.",
    stat_total:"Gesamt", stat_active:"Aktiv", stat_pending:"In Prüfung",
    stat_rejected:"Abgelehnt", stat_requests:"Anfragen", stat_new:"Neu",
    dec_accepted:"Angenommen ✓", dec_rejected:"Abgelehnt ✗",
    req_items:"Positionen", req_item:"Artikel",
    pkg_basic:"Basis-Präsenz", pkg_verified:"Verified Supplier", pkg_active:"Aktiver Vertrieb",
    pkg_buyer:"Käufer-Paket", pkg_seller:"Verkäufer-Paket", pkg_search:"Produkt-/Dienstleistungssuche",
  },
  ro: {
    welcome:"Bine ați revenit", overview:"Prezentare generală a activității pe TrustBridge",
    dashboard:"Dashboard", company:"Companie", role:"Rol", logout:"Deconectare",
    loading:"Se încarcă datele…",
    marketplace:"Piață", marketplace_desc:"Vizualizați produse și servicii.",
    inbox:"Cereri primite", inbox_desc:"Verificați cererile noi.",
    offers:"Oferte", offers_desc:"Gestionați răspunsurile și ofertele.",
    basket:"Coș cereri", basket_desc:"Editați cererea curentă.",
    new_req:"Cerere nouă", new_req_desc:"Solicitați căutarea unui produs.",
    new_offer:"Ofertă nouă",
    prod_approval:"Aprobare Produse", control:"Control",
    my_listings:"Ofertele mele", no_listings:"Nu aveți nicio ofertă.",
    main_reqs:"Cereri principale", sub_reqs:"Sub-cereri",
    new_regs:"Înregistrări noi", no_regs:"Nu există înregistrări noi.",
    no_reqs:"Nu există cereri.", no_pending:"Nu există produse pentru aprobare.",
    th_product:"Produs", th_supplier:"Furnizor", th_status:"Status", th_action:"Acțiune",
    th_id:"ID", th_date:"Data", th_company:"Companie", th_country:"Țară",
    th_contact:"Contact", th_email:"Email", th_vat:"CIF", th_type:"Tip",
    th_phone:"Telefon", th_package:"Pachet", th_message:"Mesaj", th_lang:"Limbă",
    th_offer:"Preț oferit", th_decision:"Decizie",
    d_article:"Nr. articol", d_brand:"Marcă", d_origin:"Origine",
    d_city:"Depozit / Oraș", d_condition:"Stare", d_moq:"MOQ",
    d_specs:"Specificații tehnice", d_packaging:"Ambalaj",
    d_short:"Descriere scurtă", d_description:"Descriere",
    d_incoterm:"Incoterm", d_delivery_time:"Timp livrare",
    d_countries:"Țări livrare", d_transport:"Transport",
    d_pickup:"Loc ridicare", d_vat:"TVA", d_price_unit:"Preț per",
    d_pub:"Publicare", d_contact:"Contact",
    d_service_type:"Tip serviciu", d_service_mode:"Mod",
    d_service_area:"Zonă serviciu", d_availability:"Disponibilitate",
    d_billing:"Facturare", d_doc_types:"Tipuri documente",
    d_documents:"Documente", d_photos:"Fotografii",
    btn_details:"Detalii", btn_approve:"Aprobă", btn_delete:"Șterge",
    btn_reject:"Respinge", btn_open:"Deschide",
    btn_show:"Arată detalii", btn_hide:"Ascunde",
    s_live:"Activ", s_waiting:"Așteptare", s_active:"Activ", s_in_review:"Verificare",
    s_new:"Nou", s_processing:"Procesare", s_sent_supp:"Trimis furnizor",
    s_offer_rec:"Ofertă primită", s_completed:"Finalizat", s_rejected:"Respins",
    on_request:"La cerere", confirm_delete:"Ștergeți produsul definitiv?",
    alert_approved:"Aprobat.", alert_rejected:"Respins.", alert_deleted:"Șters.", alert_error:"Eroare.",
    stat_total:"Total", stat_active:"Active", stat_pending:"În verificare",
    stat_rejected:"Respinse", stat_requests:"Cereri", stat_new:"Noi",
    dec_accepted:"Acceptat ✓", dec_rejected:"Respins ✗",
    req_items:"Poziții", req_item:"Articol",
    pkg_basic:"Prezență de bază", pkg_verified:"Furnizor verificat", pkg_active:"Vânzare activă",
    pkg_buyer:"Pachet Cumpărător", pkg_seller:"Pachet Vânzător", pkg_search:"Căutare Produse/Servicii",
  },
  hu: {
    welcome:"Üdvözöljük vissza", overview:"TrustBridge tevékenység áttekintése",
    dashboard:"Vezérlőpult", company:"Cég", role:"Szerepkör", logout:"Kijelentkezés",
    loading:"Adatok betöltése…",
    marketplace:"Piactér", marketplace_desc:"Termékek és szolgáltatások megtekintése.",
    inbox:"Beérkező kérések", inbox_desc:"Új ajánlatkérések ellenőrzése.",
    offers:"Ajánlatok", offers_desc:"Válaszok és ajánlatok kezelése.",
    basket:"Kosár", basket_desc:"Aktuális igény szerkesztése.",
    new_req:"Új kérés", new_req_desc:"Termék keresése.",
    new_offer:"Új ajánlat",
    prod_approval:"Termék jóváhagyása", control:"Ellenőrzés",
    my_listings:"Saját ajánlataim", no_listings:"Még nincsenek ajánlatai.",
    main_reqs:"Fő kérések", sub_reqs:"Al-kérések",
    new_regs:"Új regisztrációk", no_regs:"Nincsenek új regisztrációk.",
    no_reqs:"Nincsenek kérések.", no_pending:"Nincs jóváhagyásra váró termék.",
    th_product:"Termék", th_supplier:"Beszállító", th_status:"Állapot", th_action:"Művelet",
    th_id:"ID", th_date:"Dátum", th_company:"Cég", th_country:"Ország",
    th_contact:"Kapcsolat", th_email:"E-mail", th_vat:"Adószám", th_type:"Típus",
    th_phone:"Telefon", th_package:"Csomag", th_message:"Üzenet", th_lang:"Nyelv",
    th_offer:"Ajánlott ár", th_decision:"Döntés",
    d_article:"Cikkszám", d_brand:"Márka", d_origin:"Származás",
    d_city:"Raktár / Város", d_condition:"Állapot", d_moq:"MOQ",
    d_specs:"Műszaki adatok", d_packaging:"Csomagolás",
    d_short:"Rövid leírás", d_description:"Leírás",
    d_incoterm:"Incoterm", d_delivery_time:"Szállítási idő",
    d_countries:"Szállítási országok", d_transport:"Szállítás",
    d_pickup:"Átvételi hely", d_vat:"ÁFA", d_price_unit:"Ár per",
    d_pub:"Közzététel", d_contact:"Kapcsolat",
    d_service_type:"Szolgáltatás típusa", d_service_mode:"Mód",
    d_service_area:"Szolgáltatási terület", d_availability:"Elérhetőség",
    d_billing:"Számlázás", d_doc_types:"Dokumentumtípusok",
    d_documents:"Dokumentumok", d_photos:"Fotók",
    btn_details:"Részletek", btn_approve:"Jóváhagyás", btn_delete:"Törlés",
    btn_reject:"Elutasítás", btn_open:"Megnyitás",
    btn_show:"Részletek", btn_hide:"Bezárás",
    s_live:"Élő", s_waiting:"Várakozik", s_active:"Aktív", s_in_review:"Ellenőrzés",
    s_new:"Új", s_processing:"Feldolgozás", s_sent_supp:"Beszállítónak küldve",
    s_offer_rec:"Ajánlat beérkezett", s_completed:"Befejezve", s_rejected:"Elutasítva",
    on_request:"Igény szerint", confirm_delete:"Véglegesen törli a terméket?",
    alert_approved:"Jóváhagyva.", alert_rejected:"Elutasítva.", alert_deleted:"Törölve.", alert_error:"Hiba.",
    stat_total:"Összesen", stat_active:"Aktív", stat_pending:"Ellenőrzés alatt",
    stat_rejected:"Visszautasítva", stat_requests:"Megrendelések", stat_new:"Új",
    dec_accepted:"Elfogadva ✓", dec_rejected:"Visszautasítva ✗",
    req_items:"Tételek", req_item:"Tétel",
    pkg_basic:"Alap megjelenés", pkg_verified:"Ellenőrzött beszállító", pkg_active:"Aktív értékesítés",
    pkg_buyer:"Vevői csomag", pkg_seller:"Eladói csomag", pkg_search:"Termék-/Szolgáltatáskeresés",
  },
};

function t(lang: string, k: string) { return (TR[lang] ?? TR["de"])[k] ?? k; }

// ─── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, [string, string]> = {
  nou:              ["db-b-blue",   "s_new"],
  neu:              ["db-b-blue",   "s_new"],
  pending:          ["db-b-amber",  "s_waiting"],
  processing:       ["db-b-purple", "s_processing"],
  sent_to_supplier: ["db-b-cyan",   "s_sent_supp"],
  offer_received:   ["db-b-teal",   "s_offer_rec"],
  completed:        ["db-b-green",  "s_completed"],
  rejected:         ["db-b-red",    "s_rejected"],
  approved:         ["db-b-green",  "s_active"],
};

function StatusBadge({ status, lang }: { status: string; lang: string }) {
  const [cls, key] = STATUS_MAP[status] ?? ["db-b-gray", ""];
  const label = key ? t(lang, key) : status;
  return <span className={`db-badge ${cls}`}>{label}</span>;
}

function ItemStatusBadge({ wpStatus, lang }: { wpStatus: string; lang: string }) {
  if (wpStatus === "publish") return <span className="db-badge db-b-green">{t(lang,"s_active")}</span>;
  if (wpStatus === "pending") return <span className="db-badge db-b-amber">{t(lang,"s_in_review")}</span>;
  return <span className="db-badge db-b-red">{t(lang,"s_rejected")}</span>;
}

// ─── Package helpers ──────────────────────────────────────────────────────────

const PKG_COLOR: Record<string, string> = {
  basic:"db-b-green", verified:"db-b-amber", active:"db-b-blue",
  buyer:"db-b-green", seller:"db-b-blue", search:"db-b-amber",
};

function PkgBadge({ pkg, lang }: { pkg: string; lang: string }) {
  const label = t(lang, `pkg_${pkg}`) || pkg;
  const cls = PKG_COLOR[pkg] || "db-b-gray";
  return <span className={`db-badge ${cls}`}>{label}</span>;
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DR({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="db-dr">
      <span className="db-dl">{label}</span>
      <span className="db-dv">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "de";

  const [user,          setUser]          = useState<User | null>(null);
  const [requests,      setRequests]      = useState<RequestItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [myItems,       setMyItems]       = useState<ProductItem[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [expandedItem,  setExpandedItem]  = useState<number | null>(null);
  const [expandedReq,   setExpandedReq]   = useState<number | null>(null);
  const [expandedReg,   setExpandedReg]   = useState<number | null>(null);
  const [prodModal,     setProdModal]     = useState<ProductItem | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) { window.location.href = `/${lang}/login`; return; }
    const h = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        const me = await fetch(`${API}/me`, { headers: h }).then(r => r.json());
        if (me.code) { window.location.href = `/${lang}/login`; return; }
        setUser(me);

        const isAdmin    = me.roles?.includes("administrator");
        const isSupplier = me.roles?.includes("tb_supplier") || me.roles?.includes("TrustBridge_Supplier");

        const reqs = await fetch(`${API}/requests?lang=${lang}`, { headers: h }).then(r => r.json());
        console.log("REQUESTS RAW:", reqs); // debug — remove after confirming fields
        setRequests(Array.isArray(reqs) ? reqs : []);

        if (isAdmin) {
          const [items, regs] = await Promise.all([
            fetch(`${API}/items-admin?lang=${lang}`, { headers: h }).then(r => r.json()),
            fetch(`${API}/registrations`,            { headers: h }).then(r => r.json()),
          ]);
          setMyItems(Array.isArray(items) ? items : []);
          setRegistrations(Array.isArray(regs) ? regs : []);
        } else if (isSupplier) {
          const items = await fetch(`${API}/my-items?lang=${lang}`, { headers: h }).then(r => r.json());
          setMyItems(Array.isArray(items) ? items : []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [lang]);

  const handleItemAction = async (id: number, action: "approve" | "reject") => {
    const token = localStorage.getItem("trustbridge_token");
    const res = await fetch(`${API}/item-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    if (data.success) { alert(action === "approve" ? t(lang,"alert_approved") : t(lang,"alert_deleted")); setProdModal(null); window.location.reload(); }
    else alert(data.message || t(lang,"alert_error"));
  };

  const handleRegAction = async (id: number, action: "approve" | "reject", role?: string) => {
    const token = localStorage.getItem("trustbridge_token");
    const res = await fetch(`${API}/registration-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action, role: role || "tb_buyer" }),
    });
    const data = await res.json();
    if (data.success) { alert(action === "approve" ? t(lang,"alert_approved") : t(lang,"alert_rejected")); window.location.reload(); }
    else alert(data.message || t(lang,"alert_error"));
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="db-loading"><div className="db-spinner" /><p className="db-loading-txt">{t(lang,"loading")}</p></div>
    </>
  );

  const isAdmin    = user?.roles?.includes("administrator");
  const isSupplier = user?.roles?.includes("tb_supplier") || user?.roles?.includes("TrustBridge_Supplier");
  const isBuyer    = !isAdmin && !isSupplier;

  const mainReqs = isAdmin ? requests.filter(r => !r.parent_request) : requests;
  const subReqs  = isAdmin ? requests.filter(r => !!r.parent_request) : [];

  const stats = {
    total:    myItems.length,
    active:   myItems.filter(i => i.wp_status === "publish").length,
    pending:  myItems.filter(i => i.wp_status === "pending").length,
    rejected: myItems.filter(i => i.wp_status === "draft").length,
    reqs:     mainReqs.length,
    newReqs:  mainReqs.filter(r => r.status === "nou" || r.status === "neu").length,
  };

  return (
    <>
      <style>{css}</style>

      {/* ── PRODUCT MODAL (Admin) ── */}
      {prodModal && (
        <div className="db-modal-overlay" onClick={e => e.target === e.currentTarget && setProdModal(null)}>
          <div className="db-modal">
            <div className="db-modal-hdr">
              <div>
                <div style={{display:"flex",gap:6,marginBottom:6}}>
                  <span className="db-badge db-b-gray">REF: {prodModal.internal_id || prodModal.id}</span>
                  <span className="db-badge db-b-teal">{prodModal.type || "Angebot"}</span>
                </div>
                <h2 className="db-modal-title">{prodModal.title}</h2>
              </div>
              <button onClick={() => setProdModal(null)} className="db-modal-close">✕</button>
            </div>
            <div className="db-modal-body">
              <div className="db-modal-left">
                <p className="db-lbl">{t(lang,"d_photos")}</p>
                {[prodModal.image, ...(prodModal.gallery || [])].filter(Boolean).length > 0 ? (
                  <div className="db-img-grid">
                    {[prodModal.image, ...(prodModal.gallery || [])].filter((x): x is string => !!x).map((img, i) => (
                      <div key={i} className={`db-img-wrap ${i === 0 ? "db-img-main" : "db-img-thumb"}`}>
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : <div className="db-img-empty">Keine Bilder</div>}
                {prodModal.description && (
                  <>
                    <p className="db-lbl" style={{marginTop:16}}>{t(lang,"d_description")}</p>
                    <div className="db-prose" dangerouslySetInnerHTML={{ __html: prodModal.description }} />
                  </>
                )}
              </div>
              <div className="db-modal-right">
                <div className="db-modal-grid">
                  <DR label={t(lang,"th_status")}       value={prodModal.wp_status === "publish" ? `✅ ${t(lang,"s_live")}` : `⏳ ${t(lang,"s_waiting")}`} />
                  <DR label={t(lang,"th_product")}      value={prodModal.price ? `${prodModal.price} ${prodModal.currency}` : t(lang,"on_request")} />
                  <DR label={t(lang,"d_price_unit")}    value={prodModal.price_unit} />
                  <DR label={t(lang,"d_vat")}           value={prodModal.vat_note} />
                  <DR label={t(lang,"d_article")}       value={prodModal.article_number} />
                  <DR label={t(lang,"d_brand")}         value={prodModal.brand} />
                  <DR label={t(lang,"d_origin")}        value={prodModal.origin} />
                  <DR label={t(lang,"d_city")}          value={prodModal.location_city} />
                  <DR label={t(lang,"d_condition")}     value={prodModal.condition} />
                  <DR label={t(lang,"d_moq")}           value={prodModal.moq ? `${prodModal.moq} ${prodModal.moq_unit||""}`.trim() : null} />
                  <DR label={t(lang,"d_incoterm")}      value={prodModal.incoterm} />
                  <DR label={t(lang,"d_delivery_time")} value={prodModal.delivery_time} />
                  <DR label={t(lang,"d_pickup")}        value={prodModal.pickup_location} />
                  <DR label={t(lang,"d_transport")}     value={prodModal.transport_option} />
                  <DR label={t(lang,"d_countries")}     value={Array.isArray(prodModal.delivery_countries) ? prodModal.delivery_countries.join(", ") : (prodModal.delivery_countries as any)} />
                  <DR label={t(lang,"d_service_type")}  value={prodModal.service_type} />
                  <DR label={t(lang,"d_service_mode")}  value={prodModal.service_mode} />
                  <DR label={t(lang,"d_availability")}  value={prodModal.availability} />
                  <DR label={t(lang,"d_billing")}       value={prodModal.billing_model} />
                  {prodModal.service_area?.length ? <DR label={t(lang,"d_service_area")} value={Array.isArray(prodModal.service_area) ? prodModal.service_area.join(", ") : String(prodModal.service_area)} /> : null}
                  <DR label={t(lang,"d_pub")}           value={prodModal.publication_status} />
                  <DR label={t(lang,"d_contact")}       value={prodModal.contact_permission} />
                  {prodModal.document_types?.length ? <DR label={t(lang,"d_doc_types")} value={Array.isArray(prodModal.document_types) ? prodModal.document_types.join(", ") : String(prodModal.document_types)} /> : null}
                </div>
                {(prodModal.technical_specs || prodModal.packaging) && (
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
                    {prodModal.technical_specs && (
                      <div>
                        <p className="db-lbl" style={{marginBottom:5}}>🔧 {t(lang,"d_specs")}</p>
                        <p style={{fontSize:12.5,color:"#94a3b8",lineHeight:1.6,margin:0,whiteSpace:"pre-wrap",background:"#111827",border:"1px solid #1e2d47",borderRadius:8,padding:"10px 12px"}}>{prodModal.technical_specs}</p>
                      </div>
                    )}
                    {prodModal.packaging && (
                      <div>
                        <p className="db-lbl" style={{marginBottom:5}}>📦 {t(lang,"d_packaging")}</p>
                        <p style={{fontSize:12.5,color:"#94a3b8",lineHeight:1.6,margin:0,whiteSpace:"pre-wrap",background:"#111827",border:"1px solid #1e2d47",borderRadius:8,padding:"10px 12px"}}>{prodModal.packaging}</p>
                      </div>
                    )}
                  </div>
                )}
                {prodModal.documents?.length ? (
                  <div>
                    <p className="db-lbl" style={{marginBottom:6}}>📄 {t(lang,"d_documents")} ({prodModal.documents.length})</p>
                    <div className="db-docs">
                      {prodModal.documents.map(d => (
                        <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="db-doc-link">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          {d.name || d.url.split("/").pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="db-modal-supplier">
                  <p className="db-lbl" style={{color:"#2dd4bf"}}>{t(lang,"th_supplier")}</p>
                  <p style={{fontSize:15,fontWeight:800,color:"#f1f5f9",margin:"4px 0 2px"}}>{prodModal.supplier_name || "—"}</p>
                  <p style={{fontSize:12,color:"#0d9488"}}>{prodModal.supplier_email}</p>
                </div>
                {isAdmin && (
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                    {prodModal.wp_status !== "publish" && (
                      <button onClick={() => handleItemAction(prodModal.id,"approve")} className="db-btn-approve-big">
                        ✓ {t(lang,"btn_approve").toUpperCase()}
                      </button>
                    )}
                    <button onClick={() => { if(confirm(t(lang,"confirm_delete"))) handleItemAction(prodModal.id,"reject"); }} className="db-btn-danger-big">
                      ✕ {t(lang,"btn_delete").toUpperCase()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="db-page">

        {/* ── HEADER ── */}
        <div className="db-hdr">
          <div className="db-hdr-grid" /><div className="db-hdr-glow" />
          <div className="db-hdr-inner">
            <div>
              <p className="db-hdr-chip">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                {t(lang,"dashboard")}
              </p>
              <h1 className="db-hdr-title">{t(lang,"welcome")}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
              <p className="db-hdr-sub">{t(lang,"overview")}</p>
              <div className="db-hdr-meta">
                <span>{t(lang,"company")}: <strong>{user?.company || "—"}</strong></span>
                <span className="db-dot" />
                <span>{t(lang,"role")}: <strong>{user?.roles?.[0]}</strong></span>
              </div>
            </div>
            <div className="db-hdr-actions">
              {isSupplier && (
                <Link href={`/${lang}/offer-create`} className="db-new-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {t(lang,"new_offer")}
                </Link>
              )}
              <button onClick={() => { localStorage.clear(); window.location.href = `/${lang}/login`; }} className="db-logout-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                {t(lang,"logout")}
              </button>
            </div>
          </div>
        </div>

        <div className="db-body">

          {/* ── STATS (supplier & admin) ── */}
          {(isSupplier || isAdmin) && (
            <div className="db-stats">
              {([
                { val:stats.total,    lbl:t(lang,"stat_total"),    c:"#0d9488" },
                { val:stats.active,   lbl:t(lang,"stat_active"),   c:"#22c55e" },
                { val:stats.pending,  lbl:t(lang,"stat_pending"),  c:"#f59e0b" },
                { val:stats.rejected, lbl:t(lang,"stat_rejected"), c:"#ef4444" },
                { val:stats.reqs,     lbl:t(lang,"stat_requests"), c:"#3b82f6" },
                { val:stats.newReqs,  lbl:t(lang,"stat_new"),      c:"#a855f7" },
              ]).map(({val,lbl,c}) => (
                <div key={lbl} className="db-stat" style={{"--sc":c} as React.CSSProperties}>
                  <div className="db-stat-glow" />
                  <p className="db-stat-val">{val}</p>
                  <p className="db-stat-lbl">{lbl}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── NAV CARDS ── */}
          <div className="db-nav-grid">
            <NavCard href={`/${lang}/marketplace`} icon="🌐" title={t(lang,"marketplace")} desc={t(lang,"marketplace_desc")} color="teal" />
            {isSupplier && <>
              <NavCard href={`/${lang}/dashboard`} icon="📥" title={t(lang,"inbox")}  desc={t(lang,"inbox_desc")}  color="blue" />
              <NavCard href={`/${lang}/dashboard`} icon="📊" title={t(lang,"offers")} desc={t(lang,"offers_desc")} color="violet" />
            </>}
            {isBuyer && <>
              <NavCard href={`/${lang}/request-basket`} icon="🛒" title={t(lang,"basket")}  desc={t(lang,"basket_desc")}  color="blue" />
              <NavCard href={`/${lang}/request-basket`} icon="➕" title={t(lang,"new_req")} desc={t(lang,"new_req_desc")} color="orange" />
            </>}
          </div>

          {/* ── ADMIN: PRODUCT APPROVAL ── */}
          {isAdmin && (
            <Card title={t(lang,"prod_approval")} badge={t(lang,"control")} badgeColor="orange">
              {myItems.length === 0
                ? <Empty txt={t(lang,"no_pending")} />
                : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr>
                        <Th>{t(lang,"th_product")}</Th><Th>{t(lang,"th_supplier")}</Th>
                        <Th>{t(lang,"th_status")}</Th><Th right>{t(lang,"th_action")}</Th>
                      </tr></thead>
                      <tbody>
                        {myItems.map(item => (
                          <tr key={item.id} className="db-tr">
                            <td className="db-td">
                              <p className="db-name">{item.title}</p>
                              <p className="db-meta">{item.category}</p>
                            </td>
                            <td className="db-td">
                              <p className="db-name">{item.supplier_name || "—"}</p>
                              <p className="db-meta">{item.supplier_email}</p>
                            </td>
                            <td className="db-td"><ItemStatusBadge wpStatus={item.wp_status||""} lang={lang} /></td>
                            <td className="db-td" style={{textAlign:"right"}}>
                              <div className="db-action-row">
                                <button onClick={() => setProdModal(item)} className="db-btn-sm db-btn-outline">{t(lang,"btn_details")}</button>
                                {item.wp_status !== "publish" && (
                                  <button onClick={() => handleItemAction(item.id,"approve")} className="db-btn-sm db-btn-green">{t(lang,"btn_approve")}</button>
                                )}
                                <button onClick={() => handleItemAction(item.id,"reject")} className="db-btn-sm db-btn-red">{t(lang,"btn_delete")}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </Card>
          )}

          {/* ── SUPPLIER: MY OFFERS (expandable) ── */}
          {isSupplier && !isAdmin && (
            <Card title={t(lang,"my_listings")}>
              {myItems.length === 0
                ? <Empty txt={t(lang,"no_listings")} action={{ label:t(lang,"new_offer"), href:`/${lang}/offer-create` }} />
                : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr>
                        <Th style={{width:240}}>{t(lang,"th_product")}</Th>
                        <Th>{t(lang,"th_type")}</Th>
                        <Th>{t(lang,"th_supplier")/* category */}</Th>
                        <Th>{t(lang,"th_product")/* price */}</Th>
                        <Th>{t(lang,"stat_total")/* qty */}</Th>
                        <Th>{t(lang,"th_status")}</Th>
                        <Th style={{width:100}}>{t(lang,"th_action")}</Th>
                      </tr></thead>
                      <tbody>
                        {myItems.map(item => {
                          const open = expandedItem === item.id;
                          const price = item.price_status === "request" || !item.price
                            ? t(lang,"on_request")
                            : `${item.price} ${item.currency}${item.price_unit ? " / "+item.price_unit : ""}`;
                          return (
                            <React.Fragment key={item.id}>
                              <tr className={`db-tr${open?" db-tr-open":""}`}>
                                <td className="db-td">
                                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                                    {item.image
                                      ? <img src={item.image} alt="" className="db-thumb" />
                                      : <div className="db-thumb db-thumb-ph"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                                    }
                                    <div>
                                      <p className="db-name">{item.title}</p>
                                      {item.article_number && <p className="db-meta">#{item.article_number}</p>}
                                      {item.location_city  && <p className="db-meta">📍 {item.location_city}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="db-td"><span className="db-pill">{item.type}</span></td>
                                <td className="db-td">
                                  <p className="db-name">{item.category}</p>
                                  {item.subcategory && <p className="db-meta">{item.subcategory}</p>}
                                </td>
                                <td className="db-td">
                                  <p className="db-mono">{price}</p>
                                  {item.vat_note && <p className="db-meta">{item.vat_note}</p>}
                                </td>
                                <td className="db-td">
                                  {item.quantity
                                    ? <p className="db-mono">{item.quantity} {item.unit}</p>
                                    : <span className="db-meta">–</span>
                                  }
                                  {item.moq && <p className="db-meta">MOQ: {item.moq} {item.moq_unit}</p>}
                                </td>
                                <td className="db-td"><ItemStatusBadge wpStatus={item.wp_status||""} lang={lang} /></td>
                                <td className="db-td">
                                  <button className="db-expand-btn" onClick={() => setExpandedItem(open ? null : item.id)}>
                                    {open ? t(lang,"btn_hide") : t(lang,"btn_show")}
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s"}} aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                                  </button>
                                </td>
                              </tr>
                              {open && (
                                <tr className="db-detail-row">
                                  <td colSpan={7}>
                                    <div className="db-detail">
                                      {(item.short_description || item.description) && (
                                        <div className="db-detail-block">
                                          {item.short_description && <><p className="db-detail-lbl">{t(lang,"d_short")}</p><p className="db-detail-prose">{item.short_description}</p></>}
                                          {item.description && <><p className="db-detail-lbl" style={{marginTop:10}}>{t(lang,"d_description")}</p><p className="db-detail-prose">{item.description}</p></>}
                                        </div>
                                      )}
                                      <div className="db-detail-grid">
                                        <div className="db-detail-col">
                                          <p className="db-detail-sec">📦 {t(lang,"th_product")}</p>
                                          <DR label={t(lang,"d_article")}     value={item.article_number} />
                                          <DR label={t(lang,"d_brand")}       value={item.brand} />
                                          <DR label={t(lang,"d_origin")}      value={item.origin} />
                                          <DR label={t(lang,"d_city")}        value={item.location_city} />
                                          <DR label={t(lang,"d_condition")}   value={item.condition} />
                                          <DR label={t(lang,"d_moq")}         value={item.moq ? `${item.moq} ${item.moq_unit}` : null} />
                                          <DR label={t(lang,"d_service_type")} value={item.service_type} />
                                          <DR label={t(lang,"d_service_mode")} value={item.service_mode} />
                                          <DR label={t(lang,"d_availability")} value={item.availability} />
                                          <DR label={t(lang,"d_billing")}      value={item.billing_model} />
                                          {item.service_area?.length && <DR label={t(lang,"d_service_area")} value={Array.isArray(item.service_area) ? item.service_area.join(", ") : String(item.service_area)} />}
                                        </div>
                                        <div className="db-detail-col">
                                          <p className="db-detail-sec">💶 {t(lang,"th_offer")}</p>
                                          <DR label={t(lang,"th_offer")}     value={item.price ? `${item.price} ${item.currency}` : null} />
                                          <DR label={t(lang,"d_price_unit")} value={item.price_unit} />
                                          <DR label={t(lang,"d_vat")}        value={item.vat_note} />
                                          <p className="db-detail-sec" style={{marginTop:14}}>🚚 {t(lang,"d_incoterm")}</p>
                                          <DR label={t(lang,"d_incoterm")}      value={item.incoterm} />
                                          <DR label={t(lang,"d_delivery_time")} value={item.delivery_time} />
                                          <DR label={t(lang,"d_pickup")}        value={item.pickup_location} />
                                          <DR label={t(lang,"d_transport")}     value={item.transport_option} />
                                          {item.delivery_countries?.length && <DR label={t(lang,"d_countries")} value={Array.isArray(item.delivery_countries) ? item.delivery_countries.join(", ") : String(item.delivery_countries)} />}
                                        </div>
                                        <div className="db-detail-col">
                                          <p className="db-detail-sec">👁 {t(lang,"d_pub")}</p>
                                          <DR label={t(lang,"d_pub")}     value={item.publication_status} />
                                          <DR label={t(lang,"d_contact")} value={item.contact_permission} />
                                          {item.document_types?.length && <DR label={t(lang,"d_doc_types")} value={Array.isArray(item.document_types) ? item.document_types.join(", ") : String(item.document_types)} />}
                                          {item.technical_specs && <><p className="db-detail-sec" style={{marginTop:12}}>🔧 {t(lang,"d_specs")}</p><p className="db-detail-prose">{item.technical_specs}</p></>}
                                          {item.packaging && <><p className="db-detail-sec" style={{marginTop:10}}>📦 {t(lang,"d_packaging")}</p><p className="db-detail-prose">{item.packaging}</p></>}
                                        </div>
                                      </div>
                                      {item.gallery?.length ? (
                                        <div className="db-detail-block">
                                          <p className="db-detail-lbl">{t(lang,"d_photos")} ({item.gallery.length})</p>
                                          <div className="db-gallery">
                                            {item.gallery.map((u,i) => <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="db-gallery-img" /></a>)}
                                          </div>
                                        </div>
                                      ) : null}
                                      {item.documents?.length ? (
                                        <div className="db-detail-block">
                                          <p className="db-detail-lbl">{t(lang,"d_documents")} ({item.documents.length})</p>
                                          <div className="db-docs">
                                            {item.documents.map(d => (
                                              <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="db-doc-link">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                {d.name || d.url.split("/").pop()}
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </Card>
          )}

          {/* ── REQUESTS (all roles) ── */}
          <Card
            title={isAdmin ? t(lang,"main_reqs") : isSupplier ? t(lang,"inbox") : t(lang,"basket")}
            action={isBuyer ? { label:t(lang,"new_req"), href:`/${lang}/request-basket` } : undefined}
          >
            {mainReqs.length === 0
              ? <Empty txt={t(lang,"no_reqs")} />
              : (
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead><tr>
                      <Th>{t(lang,"th_id")}</Th>
                      <Th>{t(lang,"th_date")}</Th>
                      <Th>{t(lang,"th_product")}</Th>
                      <Th>{t(lang,"th_company")}</Th>
                      <Th>{t(lang,"th_country")}</Th>
                      <Th>{t(lang,"th_offer")}</Th>
                      <Th>{t(lang,"th_status")}</Th>
                      <Th style={{width:100}}>{t(lang,"th_action")}</Th>
                    </tr></thead>
                    <tbody>
                      {mainReqs.map(req => {
                        const open = expandedReq === req.id;
                        const offerDisplay = req.offer_price ? `${req.offer_price} ${req.offer_currency||"EUR"}` : "–";
                        // Resolve product name: direct field → first item title → fallback
                        const productLabel = req.custom_product || req.items?.[0]?.title || "—";
                        return (
                          <React.Fragment key={req.id}>
                            <tr className={`db-tr${open?" db-tr-open":""}`}>
                              <td className="db-td">
                                <p className="db-mono">#{req.id}</p>
                              </td>
                              <td className="db-td">
                                <p className="db-meta">{req.date || "—"}</p>
                              </td>
                              <td className="db-td">
                                {req.custom_product && <p className="db-name">{req.custom_product}</p>}
                                {req.title?.includes("Smart Sourcing") && <p className="db-meta db-source-badge">Smart Sourcing</p>}
                              </td>
                              <td className="db-td">
                                <p className="db-name">{req.company||"—"}</p>
                                <p className="db-meta">{req.email}</p>
                              </td>
                              <td className="db-td">
                                <span className="db-meta">{req.delivery_country||"—"}</span>
                              </td>
                              <td className="db-td">
                                <p className="db-mono">{offerDisplay}</p>
                                {req.customer_decision && (
                                  <p className={`db-decision ${req.customer_decision==="accepted"?"db-d-ok":"db-d-no"}`}>
                                    {req.customer_decision==="accepted" ? t(lang,"dec_accepted") : t(lang,"dec_rejected")}
                                  </p>
                                )}
                              </td>
                              <td className="db-td"><StatusBadge status={req.status} lang={lang} /></td>
                              <td className="db-td">
                                <div className="db-action-row">
                                  <button className="db-expand-btn" onClick={() => setExpandedReq(open ? null : req.id)}>
                                    {open ? t(lang,"btn_hide") : t(lang,"btn_show")}
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s"}} aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {open && (
                              <tr className="db-detail-row">
                                <td colSpan={8}>
                                  <div className="db-detail">
                                    <div className="db-detail-grid">

                                      {/* ── Col 1: Client + Smart Sourcing ── */}
                                      <div className="db-detail-col">
                                        <p className="db-detail-sec">📋 {t(lang,"th_id")}</p>
                                        <DR label={t(lang,"th_email")}   value={req.email} />
                                        <DR label={t(lang,"th_country")} value={req.delivery_country} />
                                        <DR label="Transport"            value={req.transport_needed} />
                                        <DR label="Confidențialitate"    value={req.confidentiality} />
                                        {req.title && <DR label="Request ID" value={req.title.split(" - ")[0]} />}
                                        {(req.custom_product || req.custom_message) && <>
                                          <p className="db-detail-sec" style={{marginTop:12}}>📦 {t(lang,"th_product")}</p>
                                          <DR label={t(lang,"th_product")} value={req.custom_product} />
                                          <DR label="Cantitate / Menge"   value={req.custom_quantity || null} />
                                          {req.custom_message && (
                                            <div style={{marginTop:6}}>
                                              <p className="db-detail-lbl">{t(lang,"d_description")}</p>
                                              <p className="db-detail-prose">{req.custom_message}</p>
                                            </div>
                                          )}
                                        </>}
                                      </div>

                                      {/* ── Col 2: Offer ── */}
                                      <div className="db-detail-col">
                                        <p className="db-detail-sec">💶 {t(lang,"th_offer")}</p>
                                        <DR label={t(lang,"th_offer")}  value={req.offer_price ? `${req.offer_price} ${req.offer_currency}` : null} />
                                        <DR label="Lieferzeit"          value={req.offer_delivery_time} />
                                        <DR label="Bedingungen"         value={req.offer_terms} />
                                        {req.offer_message && (
                                          <>
                                            <p className="db-detail-lbl" style={{marginTop:8}}>Nachricht</p>
                                            <p className="db-detail-prose">{req.offer_message}</p>
                                          </>
                                        )}
                                      </div>

                                      {/* ── Col 3: Decision (conditional) ── */}
                                      {req.customer_decision ? (
                                        <div className="db-detail-col">
                                          <p className="db-detail-sec">✅ {t(lang,"th_decision")}</p>
                                          <DR label={t(lang,"th_decision")} value={req.customer_decision === "accepted" ? t(lang,"dec_accepted") : t(lang,"dec_rejected")} />
                                          {req.customer_decision_message && (
                                            <p className="db-detail-prose" style={{marginTop:6}}>{req.customer_decision_message}</p>
                                          )}
                                        </div>
                                      ) : <div className="db-detail-col" />}

                                    </div>

                                    {/* ── Items table ── */}
                                    {req.items?.length ? (
                                      <div className="db-detail-block">
                                        <p className="db-detail-lbl">{t(lang,"req_items")} ({req.items.length})</p>
                                        <div className="db-table-wrap">
                                          <table className="db-table db-table-sm">
                                            <thead><tr>
                                              <Th>{t(lang,"req_item")}</Th>
                                              <Th>Menge</Th>
                                              <Th>Einheit</Th>
                                              <Th>Lieferort</Th>
                                              <Th>Termin</Th>
                                              <Th>Bemerkung</Th>
                                            </tr></thead>
                                            <tbody>
                                              {req.items.map((it,i) => (
                                                <tr key={i} className="db-tr">
                                                  <td className="db-td"><p className="db-name">{it.title}</p></td>
                                                  <td className="db-td"><span className="db-mono">{it.quantity||"–"}</span></td>
                                                  <td className="db-td"><span className="db-meta">{it.unit||"–"}</span></td>
                                                  <td className="db-td"><span className="db-meta">{it.delivery_location||"–"}</span></td>
                                                  <td className="db-td"><span className="db-meta">{it.desired_date||"–"}</span></td>
                                                  <td className="db-td"><span className="db-meta">{it.customer_note||"–"}</span></td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    ) : null}

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </Card>

          {/* ── SUB-REQUESTS (admin + supplier) ── */}
          {(isAdmin || isSupplier) && subReqs.length > 0 && (
            <Card title={t(lang,"sub_reqs")} accentColor="orange">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr>
                    <Th>{t(lang,"th_id")}</Th><Th>Parent</Th>
                    <Th>{t(lang,"th_company")}</Th><Th>{t(lang,"th_country")}</Th>
                    <Th>{t(lang,"th_status")}</Th>
                    <Th style={{width:100}}>{t(lang,"th_action")}</Th>
                  </tr></thead>
                  <tbody>
                    {subReqs.map(req => (
                      <tr key={req.id} className="db-tr">
                        <td className="db-td"><p className="db-mono">#{req.id}</p><p className="db-meta">{req.date}</p></td>
                        <td className="db-td"><span className="db-parent-badge">#{req.parent_request}</span></td>
                        <td className="db-td"><p className="db-name">{req.company||"—"}</p></td>
                        <td className="db-td"><span className="db-meta">{req.delivery_country||"—"}</span></td>
                        <td className="db-td"><StatusBadge status={req.status} lang={lang} /></td>
                        <td className="db-td">
                          <Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="db-btn-sm db-btn-outline">{t(lang,"btn_open")}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── REGISTRATIONS (admin only) ── */}
          {isAdmin && (
            <Card title={t(lang,"new_regs")}>
              {registrations.length === 0
                ? <Empty txt={t(lang,"no_regs")} />
                : (
                  <div className="db-regs">
                    {registrations.map(reg => {
                      const open = expandedReg === reg.id;
                      const pkgKey = reg.package || "";
                      return (
                        <div key={reg.id} className={`db-reg-card${open?" db-reg-open":""}`}>
                          <div className="db-reg-head" onClick={() => setExpandedReg(open ? null : reg.id)}>
                            <div style={{display:"flex",alignItems:"center",gap:14}}>
                              <span className="db-mono">#{reg.id}</span>
                              <div>
                                <p className="db-name">{reg.company}</p>
                                <p className="db-meta">{reg.date}</p>
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              {pkgKey && <PkgBadge pkg={pkgKey} lang={lang} />}
                              <StatusBadge status={reg.status||"nou"} lang={lang} />
                              {reg.lang && <span className="db-lang-badge">{reg.lang.toUpperCase()}</span>}
                              <svg className={`db-chevron${open?" db-chevron-open":""}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                          </div>
                          {open && (
                            <div className="db-reg-body">
                              <div className="db-reg-fields">
                                {([
                                  [t(lang,"th_contact"), reg.contact_name],
                                  [t(lang,"th_email"),   reg.email],
                                  [t(lang,"th_phone"),   reg.phone||"—"],
                                  [t(lang,"th_country"), reg.country||"—"],
                                  [t(lang,"th_vat"),     reg.vat||"—"],
                                  [t(lang,"th_type"),    reg.business_type||"—"],
                                  [t(lang,"th_lang"),    reg.lang?.toUpperCase()||"—"],
                                  [t(lang,"th_package"), pkgKey ? t(lang,`pkg_${pkgKey}`) || pkgKey : "—"],
                                ] as [string,string][]).map(([label,value]) => (
                                  <div key={label} className="db-reg-field">
                                    <span className="db-reg-label">{label}</span>
                                    <span className="db-reg-value">{value}</span>
                                  </div>
                                ))}
                              </div>
                              {reg.message && (
                                <div className="db-reg-msg">
                                  <p className="db-reg-label">{t(lang,"th_message")}</p>
                                  <p className="db-reg-msg-text">{reg.message}</p>
                                </div>
                              )}
                              <div className="db-reg-actions">
                                <select id={`role-${reg.id}`}
                                  defaultValue={reg.business_type === "supplier" ? "tb_supplier" : "tb_buyer"}
                                  className="db-role-select">
                                  <option value="tb_buyer">Buyer</option>
                                  <option value="tb_supplier">Supplier</option>
                                  <option value="tb_partner">Partner</option>
                                </select>
                                <button
                                  disabled={reg.status === "approved"}
                                  onClick={() => {
                                    const s = document.getElementById(`role-${reg.id}`) as HTMLSelectElement;
                                    handleRegAction(reg.id, "approve", s.value);
                                  }}
                                  className="db-btn-sm db-btn-green">✓ {t(lang,"btn_approve")}</button>
                                <button
                                  disabled={reg.status === "approved"}
                                  onClick={() => handleRegAction(reg.id, "reject")}
                                  className="db-btn-sm db-btn-red">✕ {t(lang,"btn_reject")}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              }
            </Card>
          )}

        </div>
      </main>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ title, badge, badgeColor, accentColor, action, children }: {
  title: string; badge?: string; badgeColor?: string; accentColor?: string;
  action?: { label: string; href: string }; children: React.ReactNode;
}) {
  return (
    <div className="db-card">
      <div className="db-card-hdr">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div className={`db-card-line${accentColor==="orange"?" db-line-orange":""}`} />
          <h2 className="db-card-title">
            {title}
            {badge && <span className={`db-card-badge${badgeColor==="orange"?" db-badge-orange":""}`}>{badge}</span>}
          </h2>
        </div>
        {action && <Link href={action.href} className="db-btn-sm db-btn-teal">{action.label}</Link>}
      </div>
      {children}
    </div>
  );
}

function NavCard({ href, icon, title, desc, color }: { href:string; icon:string; title:string; desc:string; color:string }) {
  const c: Record<string,string> = { teal:"db-nav-teal", blue:"db-nav-blue", violet:"db-nav-violet", orange:"db-nav-orange" };
  return (
    <Link href={href} className={`db-nav-card ${c[color]||"db-nav-teal"}`}>
      <span className="db-nav-icon">{icon}</span>
      <p className="db-nav-title">{title}</p>
      <p className="db-nav-desc">{desc}</p>
    </Link>
  );
}

function Th({ children, right, style }: { children:React.ReactNode; right?:boolean; style?: React.CSSProperties }) {
  return <th className="db-th" style={{textAlign:right?"right":"left",...style}}>{children}</th>;
}

function Empty({ txt, action }: { txt:string; action?:{label:string;href:string} }) {
  return (
    <div className="db-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{color:"#1e2d47"}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p style={{fontSize:14,color:"#475569",margin:0}}>{txt}</p>
      {action && <Link href={action.href} className="db-btn-sm db-btn-teal">{action.label}</Link>}
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .db-page { font-family:'DM Sans',sans-serif; background:#0e1420; min-height:100vh; color:#cbd5e1; padding-bottom:80px; }
  .db-loading { font-family:'DM Sans',sans-serif; background:#0e1420; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; }
  .db-spinner { width:34px; height:34px; border:3px solid rgba(13,148,136,.15); border-top-color:#0d9488; border-radius:50%; animation:db-spin .7s linear infinite; }
  .db-loading-txt { font-family:'DM Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:#475569; }
  @keyframes db-spin { to { transform:rotate(360deg); } }

  /* Header */
  .db-hdr { position:relative; overflow:hidden; padding:52px 32px 44px; border-bottom:1px solid #1e2d47; }
  .db-hdr-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(99,179,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.04) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 90% 80% at 50% 0%,black 30%,transparent 100%); }
  .db-hdr-glow { position:absolute; top:-100px; left:50%; transform:translateX(-50%); width:800px; height:340px; background:radial-gradient(ellipse,rgba(13,148,136,.1) 0%,rgba(59,130,246,.04) 45%,transparent 70%); pointer-events:none; }
  .db-hdr-inner { position:relative; max-width:1200px; margin:0 auto; display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; }
  .db-hdr-chip { display:inline-flex; align-items:center; gap:7px; font-family:'DM Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:#2dd4bf; background:rgba(13,148,136,.08); border:1px solid rgba(13,148,136,.2); border-radius:100px; padding:4px 12px; margin-bottom:10px; }
  .db-hdr-title { font-size:clamp(20px,3.5vw,30px); font-weight:800; letter-spacing:-.025em; color:#f1f5f9; margin:0 0 5px; }
  .db-hdr-sub { font-size:13px; color:#475569; margin:0 0 8px; }
  .db-hdr-meta { display:flex; align-items:center; gap:10px; font-size:13px; color:#475569; }
  .db-hdr-meta strong { color:#94a3b8; }
  .db-dot { width:3px; height:3px; border-radius:50%; background:#2a3f60; }
  .db-hdr-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .db-new-btn { display:inline-flex; align-items:center; gap:7px; background:#0d9488; color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; padding:10px 18px; border-radius:9px; text-decoration:none; transition:background .17s,transform .13s; }
  .db-new-btn:hover { background:#0b7c72; transform:translateY(-1px); }
  .db-logout-btn { display:inline-flex; align-items:center; gap:7px; background:transparent; border:1px solid #1e2d47; border-radius:9px; padding:10px 16px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#475569; cursor:pointer; transition:border-color .15s,color .15s; }
  .db-logout-btn:hover { border-color:#ef4444; color:#f87171; }

  /* Body */
  .db-body { max-width:1200px; margin:0 auto; padding:28px 24px 0; display:flex; flex-direction:column; gap:18px; }

  /* Stats */
  .db-stats { display:grid; grid-template-columns:repeat(6,1fr); gap:11px; }
  @media(max-width:900px){.db-stats{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:540px){.db-stats{grid-template-columns:repeat(2,1fr);}}
  .db-stat { position:relative; overflow:hidden; background:#141c2e; border:1px solid #1e2d47; border-radius:14px; padding:16px 14px; transition:transform .14s; }
  .db-stat:hover { transform:translateY(-2px); }
  .db-stat-glow { position:absolute; top:-28px; right:-28px; width:80px; height:80px; background:radial-gradient(circle,color-mix(in srgb,var(--sc) 18%,transparent),transparent 70%); pointer-events:none; }
  .db-stat-val { font-family:'DM Mono',monospace; font-size:24px; font-weight:500; color:var(--sc); margin:0 0 3px; line-height:1; }
  .db-stat-lbl { font-size:10px; font-weight:700; color:#475569; letter-spacing:.06em; text-transform:uppercase; margin:0; }

  /* Nav cards */
  .db-nav-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  @media(max-width:640px){.db-nav-grid{grid-template-columns:1fr;}}
  .db-nav-card { background:#141c2e; border:1px solid #1e2d47; border-radius:14px; padding:20px; text-decoration:none; display:flex; flex-direction:column; gap:8px; transition:border-color .17s,transform .14s,box-shadow .17s; }
  .db-nav-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.25); }
  .db-nav-teal:hover   { border-color:#0d9488; }
  .db-nav-blue:hover   { border-color:#3b82f6; }
  .db-nav-violet:hover { border-color:#7c3aed; }
  .db-nav-orange:hover { border-color:#f97316; }
  .db-nav-icon { font-size:22px; }
  .db-nav-title { font-size:14px; font-weight:700; color:#e2e8f0; margin:0; }
  .db-nav-desc  { font-size:12px; color:#475569; margin:0; line-height:1.5; }

  /* Cards */
  .db-card { background:#141c2e; border:1px solid #1e2d47; border-radius:16px; overflow:hidden; box-shadow:0 2px 14px rgba(0,0,0,.2); }
  .db-card-hdr { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:18px 24px; border-bottom:1px solid #1e2d47; background:rgba(255,255,255,.015); }
  .db-card-line { width:3px; height:17px; border-radius:2px; background:#0d9488; flex-shrink:0; }
  .db-line-orange { background:#f97316; }
  .db-card-title { font-size:14px; font-weight:700; color:#e2e8f0; margin:0; }
  .db-card-badge { font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; border-radius:100px; padding:2px 8px; margin-left:8px; vertical-align:middle; background:rgba(13,148,136,.1); color:#2dd4bf; border:1px solid rgba(13,148,136,.2); }
  .db-badge-orange { background:rgba(249,115,22,.1); color:#fb923c; border-color:rgba(249,115,22,.2); }

  /* Table */
  .db-table-wrap { overflow-x:auto; }
  .db-table { width:100%; border-collapse:collapse; font-size:13px; }
  .db-table.db-table-sm .db-th,.db-table.db-table-sm .db-td { padding:9px 14px; }
  .db-th { text-align:left; padding:11px 18px; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; border-bottom:1px solid #1e2d47; background:rgba(255,255,255,.01); white-space:nowrap; }
  .db-tr { border-bottom:1px solid #1a2638; transition:background .12s; }
  .db-tr:last-child { border-bottom:none; }
  .db-tr:hover:not(.db-detail-row) { background:rgba(255,255,255,.02); }
  .db-tr-open { background:rgba(13,148,136,.04) !important; border-bottom:none !important; }
  .db-td { padding:12px 18px; vertical-align:middle; }
  .db-name  { font-size:13px; font-weight:600; color:#e2e8f0; margin:0 0 2px; }
  .db-meta  { font-size:11px; color:#475569; margin:0; }
  .db-mono  { font-family:'DM Mono',monospace; font-size:13px; font-weight:500; color:#e2e8f0; margin:0 0 2px; }
  .db-pill  { font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; background:rgba(255,255,255,.05); color:#64748b; border:1px solid #1e2d47; border-radius:6px; padding:3px 8px; white-space:nowrap; }
  .db-decision { font-size:11px; font-weight:700; margin:2px 0 0; }
  .db-d-ok { color:#4ade80; }
  .db-d-no { color:#f87171; }
  .db-parent-badge { font-family:'DM Mono',monospace; font-size:11px; background:rgba(168,85,247,.1); color:#c084fc; border:1px solid rgba(168,85,247,.2); border-radius:6px; padding:2px 8px; }
  .db-lang-badge { font-family:'DM Mono',monospace; font-size:9px; background:#111827; border:1px solid #1e2d47; border-radius:4px; padding:2px 6px; color:#64748b; }
  .db-source-badge { display:inline-block; font-family:'DM Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; background:rgba(249,115,22,.08); color:#fb923c; border:1px solid rgba(249,115,22,.2); border-radius:5px; padding:1px 6px; margin-top:3px; }

  /* Badges */
  .db-badge { display:inline-flex; align-items:center; font-size:10px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; border-radius:6px; padding:3px 9px; white-space:nowrap; }
  .db-b-green  { background:rgba(34,197,94,.1);   color:#4ade80; border:1px solid rgba(34,197,94,.2); }
  .db-b-amber  { background:rgba(245,158,11,.1);  color:#fcd34d; border:1px solid rgba(245,158,11,.2); }
  .db-b-red    { background:rgba(239,68,68,.1);   color:#f87171; border:1px solid rgba(239,68,68,.2); }
  .db-b-gray   { background:rgba(100,116,139,.1); color:#94a3b8; border:1px solid rgba(100,116,139,.2); }
  .db-b-teal   { background:rgba(13,148,136,.1);  color:#2dd4bf; border:1px solid rgba(13,148,136,.2); }
  .db-b-blue   { background:rgba(59,130,246,.1);  color:#93c5fd; border:1px solid rgba(59,130,246,.2); }
  .db-b-cyan   { background:rgba(6,182,212,.1);   color:#67e8f9; border:1px solid rgba(6,182,212,.2); }
  .db-b-purple { background:rgba(168,85,247,.1);  color:#c084fc; border:1px solid rgba(168,85,247,.2); }

  /* Buttons */
  .db-action-row { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .db-btn-sm { border-radius:7px; padding:6px 12px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700; cursor:pointer; border:1px solid; white-space:nowrap; transition:background .14s; text-decoration:none; display:inline-block; }
  .db-btn-outline { background:transparent; border-color:#1e2d47; color:#64748b; }
  .db-btn-outline:hover { border-color:#2a3f60; color:#94a3b8; }
  .db-btn-teal    { background:rgba(13,148,136,.1); border-color:rgba(13,148,136,.2); color:#2dd4bf; }
  .db-btn-teal:hover { background:rgba(13,148,136,.18); }
  .db-btn-green   { background:rgba(34,197,94,.1); border-color:rgba(34,197,94,.2); color:#4ade80; }
  .db-btn-green:hover { background:rgba(34,197,94,.18); }
  .db-btn-green:disabled { opacity:.4; cursor:not-allowed; }
  .db-btn-red     { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.2); color:#f87171; }
  .db-btn-red:hover { background:rgba(239,68,68,.18); }
  .db-btn-red:disabled { opacity:.4; cursor:not-allowed; }

  /* Expand button */
  .db-expand-btn { display:inline-flex; align-items:center; gap:5px; background:transparent; border:1px solid #1e2d47; border-radius:7px; padding:6px 11px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; color:#64748b; cursor:pointer; transition:border-color .14s,color .14s; white-space:nowrap; }
  .db-expand-btn:hover { border-color:#2a3f60; color:#94a3b8; }

  /* Thumbnail */
  .db-thumb { width:40px; height:40px; border-radius:8px; object-fit:cover; flex-shrink:0; border:1px solid #1e2d47; }
  .db-thumb-ph { background:#111827; display:flex; align-items:center; justify-content:center; color:#2a3f60; }

  /* Detail row */
  .db-detail-row { background:#111827 !important; border-bottom:1px solid #1e2d47 !important; }
  .db-detail-row td { padding:0 !important; }
  .db-detail { padding:22px 20px; border-top:1px solid #1e2d47; }
  .db-detail-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:18px; }
  @media(max-width:720px){.db-detail-grid{grid-template-columns:1fr;}}
  .db-detail-col { display:flex; flex-direction:column; gap:0; }
  .db-detail-sec { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#0d9488; margin:0 0 9px; }
  .db-detail-block { margin-bottom:14px; }
  .db-detail-lbl { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#64748b; margin:0 0 8px; }
  .db-detail-prose { font-size:12.5px; color:#94a3b8; line-height:1.6; margin:0; white-space:pre-wrap; }
  .db-dr { display:flex; align-items:flex-start; gap:8px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.03); }
  .db-dl { font-size:11px; font-weight:600; color:#475569; min-width:120px; flex-shrink:0; }
  .db-dv { font-size:12.5px; color:#cbd5e1; }
  .db-gallery { display:flex; flex-wrap:wrap; gap:7px; }
  .db-gallery-img { width:66px; height:66px; border-radius:7px; object-fit:cover; border:1px solid #1e2d47; transition:opacity .14s; }
  .db-gallery-img:hover { opacity:.8; }
  .db-docs { display:flex; flex-wrap:wrap; gap:7px; }
  .db-doc-link { display:inline-flex; align-items:center; gap:5px; background:#0e1420; border:1px solid #1e2d47; border-radius:7px; padding:6px 11px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; transition:border-color .14s,color .14s; }
  .db-doc-link:hover { border-color:#2a3f60; color:#94a3b8; }

  /* Registrations */
  .db-regs { display:flex; flex-direction:column; }
  .db-reg-card { border-bottom:1px solid #1e2d47; }
  .db-reg-card:last-child { border-bottom:none; }
  .db-reg-open { background:#111827; }
  .db-reg-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 20px; cursor:pointer; transition:background .12s; }
  .db-reg-head:hover { background:rgba(255,255,255,.02); }
  .db-reg-body { border-top:1px solid #1e2d47; }
  .db-reg-fields { display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
  @media(max-width:760px){.db-reg-fields{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:440px){.db-reg-fields{grid-template-columns:1fr;}}
  .db-reg-field { padding:12px 18px; border-right:1px solid #1e2d47; border-bottom:1px solid #1e2d47; }
  .db-reg-field:nth-child(4n) { border-right:none; }
  .db-reg-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; display:block; margin-bottom:3px; }
  .db-reg-value { font-size:13px; font-weight:600; color:#e2e8f0; display:block; word-break:break-all; }
  .db-reg-msg { padding:12px 18px; border-bottom:1px solid #1e2d47; background:rgba(255,255,255,.01); }
  .db-reg-msg-text { font-size:13px; color:#94a3b8; line-height:1.6; margin-top:4px; }
  .db-reg-actions { display:flex; align-items:center; gap:9px; padding:13px 18px; flex-wrap:wrap; }
  .db-role-select { background:#0e1420; border:1px solid #1e2d47; border-radius:7px; padding:6px 12px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; color:#e2e8f0; outline:none; cursor:pointer; }
  .db-chevron { color:#2a3f60; transition:transform .2s; flex-shrink:0; }
  .db-chevron-open { transform:rotate(180deg); color:#0d9488; }

  /* Empty */
  .db-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; gap:12px; text-align:center; }

  /* Modal */
  .db-modal-overlay { position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.6); backdrop-filter:blur(6px); padding:16px; }
  .db-modal { background:#141c2e; border:1px solid #1e2d47; border-radius:20px; width:100%; max-width:860px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.5); }
  .db-modal-hdr { position:sticky; top:0; z-index:10; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:20px 24px; border-bottom:1px solid #1e2d47; background:#141c2e; }
  .db-modal-title { font-size:20px; font-weight:800; color:#f1f5f9; margin:6px 0 0; }
  .db-modal-close { width:32px; height:32px; flex-shrink:0; background:#111827; border:1px solid #1e2d47; border-radius:7px; display:flex; align-items:center; justify-content:center; color:#64748b; cursor:pointer; font-size:12px; transition:all .14s; }
  .db-modal-close:hover { background:rgba(239,68,68,.1); color:#f87171; border-color:rgba(239,68,68,.2); }
  .db-modal-body { display:grid; grid-template-columns:1fr 1fr; gap:24px; padding:24px; }
  @media(max-width:640px){.db-modal-body{grid-template-columns:1fr;}}
  .db-modal-left,.db-modal-right { display:flex; flex-direction:column; gap:16px; }
  .db-lbl { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#475569; }
  .db-img-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
  .db-img-wrap { position:relative; border-radius:9px; overflow:hidden; background:#111827; border:1px solid #1e2d47; }
  .db-img-main { grid-column:span 2; height:190px; }
  .db-img-thumb { height:110px; }
  .db-img-empty { height:110px; border-radius:9px; border:1px dashed #1e2d47; display:flex; align-items:center; justify-content:center; font-size:13px; color:#475569; }
  .db-prose { background:#111827; border:1px solid #1e2d47; border-radius:9px; padding:14px; font-size:13px; color:#94a3b8; line-height:1.65; }
  .db-modal-grid { display:flex; flex-direction:column; gap:0; }
  .db-modal-supplier { background:rgba(13,148,136,.06); border:1px solid rgba(13,148,136,.15); border-radius:11px; padding:14px; }
  .db-btn-approve-big { background:rgba(34,197,94,.1); color:#4ade80; border:1px solid rgba(34,197,94,.2); border-radius:9px; padding:12px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background .14s; width:100%; }
  .db-btn-approve-big:hover { background:rgba(34,197,94,.18); }
  .db-btn-danger-big { background:rgba(239,68,68,.1); color:#f87171; border:1px solid rgba(239,68,68,.2); border-radius:9px; padding:12px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background .14s; width:100%; }
  .db-btn-danger-big:hover { background:rgba(239,68,68,.18); }
`;
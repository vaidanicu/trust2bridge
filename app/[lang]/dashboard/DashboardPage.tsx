"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── INTERFEȚE PENTRU TIPARE ────────────────────────────────────────────────

interface TranslationDict {
  [key: string]: string;
}

interface Translations {
  [lang: string]: TranslationDict;
}

interface User {
  name: string;
  company?: string;
  roles: string[];
}

interface ProductItem {
  id: number;
  internal_id?: string;
  title: string;
  description: string;
  image?: string;
  gallery?: string[];
  price?: string;
  currency?: string;
  unit?: string;
  country?: string;
  category?: string;
  subcategory?: string;
  wp_status?: string;
  supplier_name?: string;
  supplier_email?: string;
  type?: string;
}

interface RequestItem {
  id: number;
  date?: string;
  company?: string;
  delivery_country?: string;
  status: string;
  parent_request?: number;
}

interface RegistrationItem {
  id: number;
  date: string;
  company: string;
  contact_name: string;
  email: string;
  vat?: string;
  country?: string;
  status?: string;
  business_type?: string;
}

// ─── 1. OBIECTUL DE TRADUCERI ───────────────────────────────────────────────
const translations: Translations = {
  de: {
    welcome: "Willkommen",
    company: "Firma",
    role: "Rolle",
    logout: "Abmelden",
    loading: "Lade Dashboard...",
    marketplace: "Marktplatz",
    marketplace_desc: "Produkte und Dienstleistungen ansehen.",
    inbox: "Eingehende Anfragen",
    inbox_desc: "Neue Lieferantenanfragen prüfen.",
    offers: "Angebote",
    offers_desc: "Antworten und Angebote verwalten.",
    basket: "Anfragekorb",
    basket_desc: "Ihre aktuelle Beschaffungsanfrage bearbeiten.",
    new_req: "Neue Anfrage",
    new_req_desc: "Produkt oder Dienstleistung suchen lassen.",
    admin_area: "Admin Bereich",
    prod_approval: "Produktfreigabe",
    control: "Kontrolle",
    no_pending_prods: "Keine Produkte zur Freigabe.",
    no_pending_prods_desc: "Sobald Produkte eingereicht werden, erscheinen sie hier.",
    my_listings: "Meine Angebote",
    no_listings: "Noch keine Angebote vorhanden.",
    main_reqs_title: "Hauptanfragen von Kunden",
    sub_reqs_title: "Sub-Anfragen an Anbieter",
    new_regs_title: "Neue Registrierungen",
    no_regs: "Keine neuen Registrierungen.",
    no_regs_desc: "Sobald sich ein Unternehmen registriert, erscheint es hier.",
    no_reqs: "Noch keine Anfragen vorhanden.",
    no_reqs_desc: "Sobald Anfragen vorhanden sind, erscheinen sie hier.",
    t_product: "Produkt",
    t_supplier: "Anbieter",
    t_status: "Status",
    t_action: "Aktion",
    t_id: "ID",
    t_date: "Datum",
    t_company: "Firma",
    t_country: "Zielland",
    t_contact: "Kontakt",
    t_email: "E-Mail",
    t_vat: "USt-IdNr.",
    t_reg_country: "Land",
    t_type: "Typ",
    btn_details: "PRÜFEN / DETAILS",
    btn_approve: "Freigeben",
    btn_delete: "Löschen",
    btn_reject: "Ablehnen",
    btn_open: "Anfrage öffnen",
    m_gallery: "Galerie Foto",
    m_no_images: "Keine Bilder",
    m_desc: "Detaillierte Beschreibung",
    m_price: "Preis",
    m_unit: "Einheit",
    m_cat: "Hauptkategorie",
    m_subcat: "Unterkategorie",
    m_supp_info: "Anbieter Information",
    m_internal_id: "Interne ID",
    m_on_request: "Auf Anfrage",
    m_approve_prod: "PRODUKT FREIGEBEN (APPROVE)",
    m_delete_prod: "PRODUKT LÖSCHEN (DELETE)",
    s_live: "Live",
    s_waiting: "Wartend",
    s_active: "Aktiv",
    s_in_review: "In Prüfung",
    s_new: "Neu",
    s_processing: "In Bearbeitung",
    s_sent_partner: "An Partner gesendet",
    s_sent_supp: "An Anbieter gesendet",
    s_offer_rec: "Angebot erhalten",
    s_completed: "Abgeschlossen",
    s_rejected: "Abgelehnt",
    confirm_delete: "Produkt unwiderruflich löschen?",
    alert_reg_approved: "Registrierung genehmigt.",
    alert_reg_rejected: "Registrierung abgelehnt.",
    alert_prod_approved: "Produkt freigegeben.",
    alert_prod_deleted: "Produkt gelöscht.",
    alert_error: "Fehler.",
    alert_server_error: "Serverfehler."
  },
  hu: {
    welcome: "Üdvözöljük",
    company: "Cég",
    role: "Szerepkör",
    logout: "Kijelentkezés",
    loading: "Vezérlőpult betöltése...",
    marketplace: "Piactér",
    marketplace_desc: "Termékek és szolgáltatások megtekintése.",
    inbox: "Beérkező kérések",
    inbox_desc: "Új beszállítói ajánlatkérések ellenőrzése.",
    offers: "Ajánlatok",
    offers_desc: "Válaszok és ajánlatok kezelése.",
    basket: "Ajánlatkérő kosár",
    basket_desc: "Aktuális beszerzési igény szerkesztése.",
    new_req: "Új ajánlatkérés",
    new_req_desc: "Termék vagy szolgáltatás keresése.",
    admin_area: "Admin felület",
    prod_approval: "Termék jóváhagyása",
    control: "Ellenőrzés",
    no_pending_prods: "Nincs jóváhagyásra váró termék.",
    no_pending_prods_desc: "A beküldött termékek itt fognak megjelenni.",
    my_listings: "Saját ajánlataim",
    no_listings: "Még nincsenek ajánlatai.",
    main_reqs_title: "Fő ügyfélkérések",
    sub_reqs_title: "Beszállítói al-kérések",
    new_regs_title: "Új regisztrációk",
    no_regs: "Nincsenek új regisztrációk.",
    no_regs_desc: "A regisztrált cégek itt fognak megjelenni.",
    no_reqs: "Jelenleg nincsenek kérések.",
    no_reqs_desc: "A beérkező kérések itt fognak megjelenni.",
    t_product: "Termék",
    t_supplier: "Beszállító",
    t_status: "Állapot",
    t_action: "Művelet",
    t_id: "ID",
    t_date: "Dátum",
    t_company: "Cég",
    t_country: "Célország",
    t_contact: "Kapcsolattartó",
    t_email: "E-mail",
    t_vat: "Adószám",
    t_reg_country: "Ország",
    t_type: "Típus",
    btn_details: "ELLENŐRZÉS / RÉSZLETEK",
    btn_approve: "Jóváhagyás",
    btn_delete: "Törlés",
    btn_reject: "Elutasítás",
    btn_open: "Megnyitás",
    m_gallery: "Fotógaléria",
    m_no_images: "Nincsenek képek",
    m_desc: "Részletes leírás",
    m_price: "Ár",
    m_unit: "Egység",
    m_cat: "Főkategória",
    m_subcat: "Alkategória",
    m_supp_info: "Beszállító adatai",
    m_internal_id: "Belső ID",
    m_on_request: "Ajánlat alapján",
    m_approve_prod: "TERMÉK JÓVÁHAGYÁSA (APPROVE)",
    m_delete_prod: "TERMÉK TÖRLÉSE (DELETE)",
    s_live: "Élő",
    s_waiting: "Várakozik",
    s_active: "Aktív",
    s_in_review: "Ellenőrzés alatt",
    s_new: "Új",
    s_processing: "Feldolgozás alatt",
    s_sent_partner: "Partnernek továbbítva",
    s_sent_supp: "Beszállítónak továbbítva",
    s_offer_rec: "Ajánlat beérkezett",
    s_completed: "Befejezve",
    s_rejected: "Elutasítva",
    confirm_delete: "Véglegesen törli a terméket?",
    alert_reg_approved: "Regisztráció jóváhagyva.",
    alert_reg_rejected: "Regisztráció elutasítva.",
    alert_prod_approved: "Termék jóváhagyva.",
    alert_prod_deleted: "Termék törölve.",
    alert_error: "Hiba történt.",
    alert_server_error: "Szerverhiba."
  },
  ro: {
    welcome: "Bun venit",
    company: "Companie",
    role: "Rol",
    logout: "Deconectare",
    loading: "Se încarcă tabloul de bord...",
    marketplace: "Piață (Marketplace)",
    marketplace_desc: "Vizualizați produse și servicii.",
    inbox: "Cereri primite",
    inbox_desc: "Verificați cererile noi de la furnizori.",
    offers: "Oferte",
    offers_desc: "Gestionați răspunsurile și ofertele.",
    basket: "Coș cereri",
    basket_desc: "Editați cererea curentă de achiziție.",
    new_req: "Cerere nouă",
    new_req_desc: "Solicitați căutarea unui produs sau serviciu.",
    admin_area: "Zonă Admin",
    prod_approval: "Aprobare Produse",
    control: "Control",
    no_pending_prods: "Nu există produse pentru aprobare.",
    no_pending_prods_desc: "Produsele trimise vor apărea aici.",
    my_listings: "Ofertele mele",
    no_listings: "Nu aveți nicio ofertă momentan.",
    main_reqs_title: "Cereri principale clienți",
    sub_reqs_title: "Sub-cereri către furnizori",
    new_regs_title: "Înregistrări noi",
    no_regs: "Nu există înregistrări noi.",
    no_regs_desc: "Companiile înregistrate vor apărea aici.",
    no_reqs: "Nu există cereri momentan.",
    no_reqs_desc: "Cererile primite vor apărea aici.",
    t_product: "Produs",
    t_supplier: "Furnizor",
    t_status: "Status",
    t_action: "Acțiune",
    t_id: "ID",
    t_date: "Data",
    t_company: "Companie",
    t_country: "Țară destinație",
    t_contact: "Contact",
    t_email: "Email",
    t_vat: "CIF",
    t_reg_country: "Țară",
    t_type: "Tip",
    btn_details: "VERIFICĂ / DETALII",
    btn_approve: "Aprobă",
    btn_delete: "Șterge",
    btn_reject: "Respinge",
    btn_open: "Deschide cererea",
    m_gallery: "Galerie Foto",
    m_no_images: "Fără imagini",
    m_desc: "Descriere detaliată",
    m_price: "Preț",
    m_unit: "Unitate",
    m_cat: "Categorie principală",
    m_subcat: "Subcategorie",
    m_supp_info: "Informații furnizor",
    m_internal_id: "ID Intern",
    m_on_request: "La cerere",
    m_approve_prod: "APROBĂ PRODUSUL",
    m_delete_prod: "ȘTERGE PRODUSUL",
    s_live: "Activ",
    s_waiting: "În așteptare",
    s_active: "Activ",
    s_in_review: "În verificare",
    s_new: "Nou",
    s_processing: "În procesare",
    s_sent_partner: "Trimis la partener",
    s_sent_supp: "Trimis la furnizor",
    s_offer_rec: "Ofertă primită",
    s_completed: "Finalizat",
    s_rejected: "Respins",
    confirm_delete: "Ștergeți produsul definitiv?",
    alert_reg_approved: "Înregistrare aprobată.",
    alert_reg_rejected: "Înregistrare respinsă.",
    alert_prod_approved: "Produs aprobat.",
    alert_prod_deleted: "Produs șters.",
    alert_error: "Eroare.",
    alert_server_error: "Eroare de server."
  }
};

// ─── 2. COMPONENTE AJUTĂTOARE ────────────────────────────────────────────────

interface ProductModalProps {
  item: ProductItem;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  isAdmin: boolean;
  dict: TranslationDict;
  lang: string;
}

function ProductModal({
  item,
  onClose,
  onApprove,
  onReject,
  isAdmin,
  dict,
  lang,
}: ProductModalProps) {
  const isLive = item.wp_status === "publish";
  const allImages = [item.image, ...(item.gallery || [])].filter(
    (img): img is string => !!img
  );

  const priceDisplay =
    formatConvertedPrice(item.price, lang) ||
    (item.price ? `${item.price} ${item.currency || "EUR"}` : dict.m_on_request);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 backdrop-blur px-8 py-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter">REF: {item.internal_id || item.id}</span>
              <span className="text-[10px] font-black bg-[#108280]/10 px-2 py-0.5 rounded text-[#108280] uppercase">{item.type || "Angebot"}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{item.title}</h2>
          </div>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all font-bold">✕</button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{dict.m_gallery}</p>
              {allImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {allImages.map((img: string, i: number) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl border bg-slate-50 ${i === 0 ? "col-span-2 h-64" : "h-40"}`}>
                      <Image 
                        src={img} 
                        alt="Preview" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-dashed italic">{dict.m_no_images}</div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{dict.m_desc}</p>
              <div className="prose prose-sm text-slate-700 max-w-none bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner" dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DataBox label={dict.t_status} value={isLive ? `✅ ${dict.s_live.toUpperCase()}` : `⏳ ${dict.s_waiting.toUpperCase()}`} highlight={!isLive} />
             <DataBox label={dict.m_price} value={priceDisplay} />
              <DataBox label={dict.m_unit} value={item.unit || "-"} />
              <DataBox label={dict.t_country} value={item.country || "N/A"} />
              <DataBox label={dict.m_cat} value={item.category || "-"} />
              <DataBox label={dict.m_subcat} value={item.subcategory || "-"} />
            </div>

            <div className="p-6 rounded-[2rem] bg-[#108280]/5 border border-[#108280]/20 space-y-4">
              <p className="text-xs font-black uppercase text-[#108280] tracking-widest">{dict.m_supp_info}</p>
              <div>
                <p className="text-lg font-black text-slate-900">{item.supplier_name || "---"}</p>
                <p className="text-sm text-slate-500 font-medium">{item.supplier_email}</p>
              </div>
              <div className="pt-4 border-t border-[#108280]/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{dict.m_internal_id}</span>
                <p className="text-xs font-mono text-slate-600">{item.internal_id || "N/A"}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-3 pt-4">
                {!isLive && (
                  <button onClick={() => onApprove?.(item.id)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                    ✓ {dict.m_approve_prod}
                  </button>
                )}
                <button onClick={() => { if (confirm(dict.confirm_delete)) onReject?.(item.id); }} className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all">
                  ✕ {dict.m_delete_prod}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? "bg-yellow-50 border-yellow-200" : "bg-slate-50 border-slate-100"}`}>
      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-yellow-700" : "text-slate-800"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status, dict }: { status: string; dict: TranslationDict }) {
  let label = dict.s_new;
  let classes = "bg-gray-100 text-gray-700";

  switch (status) {
    case "nou": label = dict.s_new; classes = "bg-blue-100 text-blue-700"; break;
    case "pending":
    case "pending_review": label = dict.s_waiting; classes = "bg-yellow-100 text-yellow-700"; break;
    case "processing": label = dict.s_processing; classes = "bg-indigo-100 text-indigo-700"; break;
    case "sent_to_partner": label = dict.s_sent_partner; classes = "bg-purple-100 text-purple-700"; break;
    case "sent_to_supplier": label = dict.s_sent_supp; classes = "bg-cyan-100 text-cyan-700"; break;
    case "offer_received": label = dict.s_offer_rec; classes = "bg-green-100 text-green-700"; break;
    case "completed": label = dict.s_completed; classes = "bg-emerald-100 text-emerald-700"; break;
    case "rejected": label = dict.s_rejected; classes = "bg-red-100 text-red-700"; break;
  }
  return <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${classes}`}>{label}</span>;
}

// ─── 3. PAGINA PRINCIPALĂ DASHBOARD ──────────────────────────────────────────

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

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) { window.location.href = `/${lang}/login`; return; }

    async function loadDashboard() {
      try {
        const token = localStorage.getItem("trustbridge_token");
        const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
        const meData = await meRes.json();
        if (meData.code) { window.location.href = `/${lang}/login`; return; }
        setUser(meData);

        const isAdmin = meData.roles?.includes("administrator");
        const isSupplier = meData.roles?.includes("tb_supplier") || meData.roles?.includes("TrustBridge_Supplier");

        const reqRes = await fetch(`${API}/requests`, { headers: { Authorization: `Bearer ${token}` } });
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        if (isAdmin) {
          const itemsRes = await fetch(`${API}/items-admin?lang=${lang}`, { headers: { Authorization: `Bearer ${token}` } });
          const itemsData = await itemsRes.json();
          setMyItems(Array.isArray(itemsData) ? itemsData : []);

          const regRes = await fetch(`${API}/registrations`, { headers: { Authorization: `Bearer ${token}` } });
          const regData = await regRes.json();
          setRegistrations(Array.isArray(regData) ? regData : []);
        } else if (isSupplier) {
          const itemsRes = await fetch(`${API}/my-items?lang=${lang}`, { headers: { Authorization: `Bearer ${token}` } });
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
  }, [lang]);

  const handleRegistrationAction = async (id: number, action: "approve" | "reject", selectedRole?: string) => {
    const token = localStorage.getItem("trustbridge_token");
    const role = selectedRole || "tb_buyer";
    try {
      const res = await fetch(`${API}/registration-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, action, role }),
      });
      const data = await res.json();
      if (data.success) {
        alert(action === "approve" ? dict.alert_reg_approved : dict.alert_reg_rejected);
        window.location.reload();
      } else { alert(data.message || dict.alert_error); }
    } catch { alert(dict.alert_server_error); }
  };

  const handleItemAction = async (id: number, action: "approve" | "reject") => {
    const token = localStorage.getItem("trustbridge_token");
    try {
      const res = await fetch(`${API}/item-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(action === "approve" ? dict.alert_prod_approved : dict.alert_prod_deleted);
        setSelectedItem(null);
        window.location.reload();
      } else { alert(data.message || dict.alert_error); }
    } catch { alert(dict.alert_server_error); }
  };

  if (loading) return <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center"><p className="font-black text-slate-600">{dict.loading}</p></main>;

  const isAdmin = user?.roles?.includes("administrator");
  const isSupplier = user?.roles?.includes("tb_supplier") || user?.roles?.includes("TrustBridge_Supplier");
  const visibleRequests = isAdmin
    ? requests.filter((req) => !req.parent_request)
    : requests;

  const subRequests = isAdmin
    ? requests.filter((req) => req.parent_request)
    : [];

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-20">
      {selectedItem && (
       <ProductModal 
  item={selectedItem} 
  onClose={() => setSelectedItem(null)} 
  isAdmin={!!isAdmin} 
  dict={dict}
  lang={lang}
  onApprove={(id) => handleItemAction(id, "approve")} 
  onReject={(id) => handleItemAction(id, "reject")} 
/>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white shadow-lg">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">TrustBridge Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">{dict.welcome}, {user?.name}</h1>
          <p className="mt-2 text-white/80">{dict.company}: {user?.company || "-"} · {dict.role}: {user?.roles?.[0]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Nav Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          <DashboardCard title={dict.marketplace} text={dict.marketplace_desc} href={`/${lang}/marketplace`} icon="🌐" />
          {isSupplier ? (
            <>
              <DashboardCard title={dict.inbox} text={dict.inbox_desc} href={`/${lang}/dashboard`} icon="📥" />
              <DashboardCard title={dict.offers} text={dict.offers_desc} href={`/${lang}/dashboard`} icon="📦" />
            </>
          ) : (
            <>
              <DashboardCard title={dict.basket} text={dict.basket_desc} href={`/${lang}/request-basket`} icon="🛒" />
              <DashboardCard title={dict.new_req} text={dict.new_req_desc} href={`/${lang}/request-basket`} icon="➕" />
            </>
          )}
        </div>

        {/* ADMIN: PRODUCT APPROVAL */}
       {isAdmin && (
  <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-wider text-[#108280]">{dict.admin_area}</p>
      <h2 className="text-2xl font-black flex items-center gap-2">
        {dict.prod_approval} 
        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-full uppercase">{dict.control}</span>
      </h2>
    </div>

    {myItems.length === 0 ? (
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <h3 className="text-xl font-black">{dict.no_pending_prods}</h3>
        <p className="mt-2 text-sm text-slate-500">{dict.no_pending_prods_desc}</p>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_product}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_supplier}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_status}</th>
              <th className="p-4 text-right font-black text-[10px] uppercase">{dict.t_action}</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {myItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <p className="font-black text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-600">{item.supplier_name || "---"}</p>
                  <p className="text-[10px] text-slate-400">{item.supplier_email}</p>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                    item.wp_status === "publish" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.wp_status === "publish" ? dict.s_live : dict.s_waiting}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedItem(item)} 
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-[#108280] transition"
                    >
                      {dict.btn_details}
                    </button>
                    
                    {item.wp_status !== "publish" ? (
                      <button 
                        onClick={() => handleItemAction(item.id, "approve")} 
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white"
                      >
                        {dict.btn_approve}
                      </button>
                    ) : null}

                    <button 
                      onClick={() => handleItemAction(item.id, "reject")} 
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white"
                    >
                      {dict.btn_delete}
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

        {/* SUPPLIER: MY LISTINGS */}
        {isSupplier && !isAdmin && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-black mb-6 text-[#108280]">{dict.my_listings}</h2>
            {myItems.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center"><h3 className="text-xl font-black">{dict.no_listings}</h3></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <div><h4 className="font-black text-slate-800">{item.title}</h4><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Ref: {item.internal_id || item.id}</p></div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${item.wp_status === "publish" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{item.wp_status === "publish" ? `✅ ${dict.s_active}` : `⏳ ${dict.s_in_review}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TABLE */}
        <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div><p className="text-xs font-black uppercase tracking-wider text-[#108280]">{isAdmin ? dict.admin_area : isSupplier ? "Supplier" : dict.new_req}</p><h2 className="text-2xl font-black">{isAdmin ? dict.main_reqs_title : isSupplier ? dict.inbox : dict.basket}</h2></div>
            {!isSupplier && !isAdmin && <Link href={`/${lang}/request-basket`} className="rounded-xl bg-[#108280] px-5 py-3 text-sm font-black uppercase text-white hover:bg-[#0d6b69]">{dict.new_req}</Link>}
          </div>
          {visibleRequests.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center"><h3 className="text-xl font-black">{dict.no_reqs}</h3><p className="mt-2 text-sm text-slate-500">{dict.no_reqs_desc}</p></div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr><th className="p-4 font-black text-[10px] uppercase">{dict.t_id}</th><th className="p-4 font-black text-[10px] uppercase">{dict.t_date}</th><th className="p-4 font-black text-[10px] uppercase">{dict.t_company}</th><th className="p-4 font-black text-[10px] uppercase">{dict.t_country}</th><th className="p-4 font-black text-[10px] uppercase">{dict.t_status}</th><th className="p-4 font-black text-[10px] uppercase">{dict.t_action}</th></tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {visibleRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-black">#{req.id}</td><td className="p-4 text-slate-600">{req.date || "-"}</td><td className="p-4 font-bold">{req.company || "-"}</td><td className="p-4 text-slate-600">{req.delivery_country || "-"}</td>
                      <td className="p-4"><StatusBadge status={req.status} dict={dict} /></td>
                      <td className="p-4"><Link href={`/${lang}/dashboard/requests?id=${req.id}`} className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-[#108280] hover:text-white transition">{dict.btn_open}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── SECȚIUNEA SUB-ANFRAGEN (SUB-CERERI) ─── */}
        {(isAdmin || isSupplier) && subRequests.length > 0 && (
          <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-wider text-orange-600">
                {dict.sub_reqs_title}
              </p>
              <h2 className="text-2xl font-black">{dict.sub_reqs_title}</h2>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4 font-black text-[10px] uppercase">{dict.t_id}</th>
                    <th className="p-4 font-black text-[10px] uppercase">{dict.t_date}</th>
                    <th className="p-4 font-black text-[10px] uppercase">Parent ID</th>
                    <th className="p-4 font-black text-[10px] uppercase">{dict.t_company}</th>
                    <th className="p-4 font-black text-[10px] uppercase">{dict.t_status}</th>
                    <th className="p-4 font-black text-[10px] uppercase">{dict.t_action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {subRequests.map((subReq) => (
                    <tr key={subReq.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-black">#{subReq.id}</td>
                      <td className="p-4 text-slate-600">{subReq.date || "-"}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">
                          #{subReq.parent_request}
                        </span>
                      </td>
                      <td className="p-4 font-bold">{subReq.company || "-"}</td>
                      <td className="p-4">
                        <StatusBadge status={subReq.status} dict={dict} />
                      </td>
                      <td className="p-4">
                        <Link 
                          href={`/${lang}/dashboard/requests?id=${subReq.id}`} 
                          className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-[#108280] hover:text-white transition"
                        >
                          {dict.btn_open}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN: REGISTRATIONS */}
{isAdmin && (
  <div className="mb-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl">
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-wider text-[#108280]">{dict.admin_area}</p>
      <h2 className="text-2xl font-black">{dict.new_regs_title}</h2>
    </div>
    {registrations.length === 0 ? (
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <h3 className="text-xl font-black">{dict.no_regs}</h3>
        <p className="mt-2 text-sm text-slate-500">{dict.no_regs_desc}</p>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_id}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_date}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_company}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_contact}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_email}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_vat}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_reg_country}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_status}</th>
              <th className="p-4 font-black text-[10px] uppercase">{dict.t_action}</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-black">#{reg.id}</td>
                <td className="p-4 text-slate-600">{reg.date}</td>
                <td className="p-4 font-bold">{reg.company}</td>
                <td className="p-4">{reg.contact_name}</td>
                <td className="p-4">{reg.email}</td>
                <td className="p-4 font-mono text-slate-600">{reg.vat || "-"}</td>
                <td className="p-4 text-slate-600">{reg.country || "-"}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase 
                    ${reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {reg.status || dict.s_new}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <select id={`role-${reg.id}`} 
                      defaultValue={reg.business_type === "supplier" ? "tb_supplier" : "tb_buyer"} 
                      className="rounded-lg border px-3 py-2 text-xs font-bold">
                      <option value="tb_buyer">Buyer</option>
                      <option value="tb_supplier">Supplier</option>
                      <option value="tb_partner">Partner</option>
                    </select>
                    <div className="flex gap-2">
                      <button disabled={reg.status === "approved"}
                        onClick={() => { 
                          const s = document.getElementById(`role-${reg.id}`) as HTMLSelectElement; 
                          handleRegistrationAction(reg.id, "approve", s.value); 
                        }} 
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white disabled:opacity-30">
                        {dict.btn_approve}
                      </button>
                      <button disabled={reg.status === "approved"}
                        onClick={() => handleRegistrationAction(reg.id, "reject")} 
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-30">
                        {dict.btn_reject}
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

        <button onClick={() => { localStorage.clear(); window.location.href = `/${lang}/login`; }} className="mt-4 rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-slate-800 transition">
          {dict.logout}
        </button>
      </section>
    </main>
  );
}

function DashboardCard({ title, text, href, icon }: { title: string; text: string; href: string; icon: string }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 font-medium">{text}</p>
    </Link>
  );
}
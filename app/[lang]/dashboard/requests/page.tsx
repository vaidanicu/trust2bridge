"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

type Lang = "de" | "ro" | "hu";
type StatusKey =
  | "pending_review"
  | "nou"
  | "processing"
  | "sent_to_partner"
  | "sent_to_supplier"
  | "offer_received"
  | "completed"
  | "rejected";

interface SupplierInfo {
  id: number;
  name: string;
  email: string;
  company: string;
}

interface EnrichedItem {
  id?: number | string;
  title?: string;
  internal_id?: string;
  category?: string;
  subcategory?: string;
  country?: string;
  supplier_id?: string | number;
  supplier_name?: string;
  supplier_email?: string;
  supplier_company?: string;
  price_status?: string;
  price?: string;
  unit?: string;
  quantity?: string;
  delivery_location?: string;
  desired_date?: string;
  customer_note?: string;
}

interface UserData {
  id?: number;
  email?: string;
  name?: string;
  company?: string;
  roles?: string[];
}

interface RequestData {
  id: number;
  date?: string;
  company?: string;
  email?: string;
  delivery_country?: string;
  transport_needed?: string;
  confidentiality?: string;
  status?: StatusKey | string;
  parent_request?: string | number;
  supplier_id?: string | number;
  items?: EnrichedItem[];
  custom_product?: string;
  custom_quantity?: string;
  custom_message?: string;
  offer_price?: string;
  offer_currency?: "EUR" | "HUF" | "RON" | string;
  offer_delivery_time?: string;
  offer_terms?: string;
  offer_message?: string;
  customer_decision?: "accepted" | "rejected" | string;
customer_decision_message?: string;
}

const translations = {
  de: {
    loadingRequest: "Lade Anfrage...",
    loadingPage: "Lade Seite...",
    notFound: "Anfrage nicht gefunden.",
    backDashboard: "Zurück zum Dashboard",
    requestLabel: "TrustBridge Anfrage",
    date: "Datum",
    status: "Status",
    positions: "Positionen",
    productsTitle: "Produkte in dieser Anfrage",
    smartSourcing: "Smart Sourcing Anfrage",
    requestWithoutTitle: "Anfrage ohne Produkttitel",
    quantityUnit: "Menge / Einheit",
    targetCountry: "Zielland",
    description: "Beschreibung",
    noProducts: "Keine Produkte gefunden.",
    position: "Position",
    product: "Produkt",
    internalId: "Interne ID",
    category: "Kategorie",
    country: "Land",
    supplier: "Anbieter",
    priceOnRequest: "Preis auf Anfrage",
    quantity: "Menge",
    deliveryPlace: "Lieferort",
    deadline: "Termin",
    note: "Bemerkung",
    offerReceived: "Angebot erhalten",
    supplierOffer: "Lieferantenangebot",
    decisionSaved: "Die Entscheidung wurde gespeichert.",
    priceOffer: "Preis / Angebot",
    deliveryTime: "Lieferzeit",
    terms: "Bedingungen",
    message: "Nachricht",
    overview: "Übersicht",
    requestData: "Anfragedaten",
    company: "Firma",
    email: "E-Mail",
    transport: "Transport",
    confidentiality: "Vertraulichkeit",
    subRequest: "Sub-Anfrage",
    yes: "Ja",
    no: "Nein",
    adminControl: "Admin Steuerung",
    changeStatus: "Status ändern",
    saveStatus: "Status speichern",
    saving: "Wird gespeichert...",
    sendToSupplier: "An Anbieter senden",
    sending: "Wird gesendet...",
    onlySubRequest: "Hinweis: An Anbieter senden funktioniert nur bei Sub-Anfragen.",
    offerSubmit: "Angebot abgeben",
    updateOffer: "Angebot aktualisieren",
    sendOffer: "Angebot senden",
    pricePlaceholder: "Preis / Angebot *",
    deliveryPlaceholder: "Lieferzeit, z. B. 7-10 Tage",
    messagePlaceholder: "Nachricht / Bedingungen",
    currency: "Währung",
    deliveryChoose: "Lieferzeit wählen",
    termsChoose: "Bedingungen wählen",
    extraMessage: "Zusätzliche Nachricht",
    deliveryOptions: [
  { value: "1_3_days", label: "1-3 Tage" },
  { value: "4_7_days", label: "4-7 Tage" },
  { value: "7_10_days", label: "7-10 Tage" },
  { value: "10_14_days", label: "10-14 Tage" },
  { value: "2_4_weeks", label: "2-4 Wochen" },
  { value: "agreement", label: "Nach Vereinbarung" },
],
    termOptions: [
  { value: "price_includes_delivery", label: "Preis inklusive Lieferung" },
  { value: "price_excludes_delivery", label: "Preis exklusive Lieferung" },
  { value: "bank_transfer", label: "Zahlung per Überweisung" },
  { value: "delivery_after_payment", label: "Lieferung nach Zahlungseingang" },
  { value: "valid_7_days", label: "Angebot gültig 7 Tage" },
  { value: "valid_14_days", label: "Angebot gültig 14 Tage" },
],
    notReleased: "Noch nicht freigegeben",
    notReleasedText: "Diese Anfrage wurde noch nicht von TrustBridge zur Angebotsabgabe freigegeben.",
    nextStep: "Nächster Schritt",
    nextSupplier: "Bitte prüfen Sie die Anfrage und senden Sie ein Angebot an TrustBridge.",
    nextCustomer: "TrustBridge prüft die Anfrage und leitet sie bei Bedarf an passende Partner oder Lieferanten weiter.",
    searchMore: "Weitere Produkte suchen",
    confirmSend: "Diese Anfrage wirklich an den Anbieter senden?",
    sentSupplier: "Anfrage wurde an Anbieter gesendet.",
    serverError: "Serverfehler.",
    sendError: "Fehler beim Senden.",
    statusUpdated: "Status wurde aktualisiert.",
    updateError: "Fehler beim Aktualisieren.",
    offerSent: "Angebot wurde gesendet.",
    loadingSupplier: "Lade Anbieterdaten...",
    customerDecision: "Entscheidung des Kunden",
    decisionMessage: "Nachricht / Bemerkung",
    wantHotel: "Ich wünsche Hotel",
    wantTransport: "Ich wünsche zusätzlichen Transport",
    wantCustoms: "Ich wünsche Zollhilfe",
    wantInsurance: "Ich wünsche Versicherung",
    acceptOffer: "Angebot akzeptieren",
    rejectOffer: "Angebot ablehnen",
    statuses: {
      pending_review: "Wartet auf Prüfung",
      nou: "Neu",
      processing: "In Bearbeitung",
      sent_to_partner: "An Partner weitergeleitet",
      sent_to_supplier: "An Anbieter gesendet",
      offer_received: "Angebot erhalten",
      completed: "Abgeschlossen",
      rejected: "Abgelehnt",
    },
  },
  ro: {
   customerDecision: "Decizia clientului",
    decisionMessage: "Mesaj / observație",
    wantHotel: "Doresc hotel",
    wantTransport: "Doresc transport suplimentar",
    wantCustoms: "Doresc ajutor vamal",
    wantInsurance: "Doresc asigurare",
    acceptOffer: "Accept oferta",
    rejectOffer: "Refuz oferta",
    decisionSaved: "Decizia a fost salvată.",
    loadingRequest: "Se încarcă cererea...",
    loadingPage: "Se încarcă pagina...",
    notFound: "Cererea nu a fost găsită.",
    backDashboard: "Înapoi la Dashboard",
    requestLabel: "Cerere TrustBridge",
    date: "Data",
    status: "Status",
    positions: "Poziții",
    productsTitle: "Produse în această cerere",
    smartSourcing: "Cerere Smart Sourcing",
    requestWithoutTitle: "Cerere fără titlu produs",
    quantityUnit: "Cantitate / unitate",
    targetCountry: "Țara de destinație",
    description: "Descriere",
    noProducts: "Nu au fost găsite produse.",
    position: "Poziția",
    product: "Produs",
    internalId: "ID intern",
    category: "Categorie",
    country: "Țară",
    supplier: "Furnizor",
    priceOnRequest: "Preț la cerere",
    quantity: "Cantitate",
    deliveryPlace: "Loc livrare",
    deadline: "Termen",
    note: "Observație",
    offerReceived: "Ofertă primită",
    supplierOffer: "Oferta furnizorului",
    priceOffer: "Preț / Ofertă",
    deliveryTime: "Timp livrare",
    terms: "Condiții",
    message: "Mesaj",
    overview: "Prezentare",
    requestData: "Datele cererii",
    company: "Companie",
    email: "E-mail",
    transport: "Transport",
    confidentiality: "Confidențialitate",
    subRequest: "Sub-cerere",
    yes: "Da",
    no: "Nu",
    adminControl: "Control Admin",
    changeStatus: "Schimbă statusul",
    saveStatus: "Salvează statusul",
    saving: "Se salvează...",
    sendToSupplier: "Trimite către furnizor",
    sending: "Se trimite...",
    onlySubRequest: "Notă: trimiterea către furnizor funcționează doar pentru sub-cereri.",
    offerSubmit: "Trimite ofertă",
    updateOffer: "Actualizează oferta",
    sendOffer: "Trimite oferta",
    pricePlaceholder: "Preț / Ofertă *",
    deliveryPlaceholder: "Timp livrare, ex. 7-10 zile",
    messagePlaceholder: "Mesaj / Condiții",
    currency: "Monedă",
    deliveryChoose: "Alege timpul de livrare",
    termsChoose: "Alege condițiile",
    extraMessage: "Mesaj suplimentar",
    deliveryOptions: [
  { value: "1_3_days", label: "1-3 zile" },
  { value: "4_7_days", label: "4-7 zile" },
  { value: "7_10_days", label: "7-10 zile" },
  { value: "10_14_days", label: "10-14 zile" },
  { value: "2_4_weeks", label: "2-4 săptămâni" },
  { value: "agreement", label: "După acord" },
],
   termOptions: [
  { value: "price_includes_delivery", label: "Preț cu livrare inclusă" },
  { value: "price_excludes_delivery", label: "Preț fără livrare" },
  { value: "bank_transfer", label: "Plată prin transfer bancar" },
  { value: "delivery_after_payment", label: "Livrare după primirea plății" },
  { value: "valid_7_days", label: "Ofertă valabilă 7 zile" },
  { value: "valid_14_days", label: "Ofertă valabilă 14 zile" },
],
    notReleased: "Încă nu este aprobată",
    notReleasedText: "Această cerere nu a fost încă aprobată de TrustBridge pentru transmiterea unei oferte.",
    nextStep: "Următorul pas",
    nextSupplier: "Vă rugăm să verificați cererea și să trimiteți o ofertă către TrustBridge.",
    nextCustomer: "TrustBridge verifică cererea și o transmite, dacă este necesar, către parteneri sau furnizori potriviți.",
    searchMore: "Caută alte produse",
    confirmSend: "Trimitem această cerere către furnizor?",
    sentSupplier: "Cererea a fost trimisă către furnizor.",
    serverError: "Eroare server.",
    sendError: "Eroare la trimitere.",
    statusUpdated: "Statusul a fost actualizat.",
    updateError: "Eroare la actualizare.",
    offerSent: "Oferta a fost trimisă.",
    loadingSupplier: "Se încarcă datele furnizorului...",
    statuses: {
      pending_review: "Așteaptă verificare",
      nou: "Nou",
      processing: "În procesare",
      sent_to_partner: "Trimis către partener",
      sent_to_supplier: "Trimis către furnizor",
      offer_received: "Ofertă primită",
      completed: "Finalizat",
      rejected: "Respins",
    },
  },
  hu: {customerDecision: "Ügyfél döntése",
decisionMessage: "Üzenet / megjegyzés",
wantHotel: "Szállást kérek",
wantTransport: "További szállítást kérek",
wantCustoms: "Vámügyintézési segítséget kérek",
wantInsurance: "Biztosítást kérek",
acceptOffer: "Ajánlat elfogadása",
rejectOffer: "Ajánlat elutasítása",
decisionSaved: "A döntés mentve.",
    loadingRequest: "Ajánlatkérés betöltése...",
    loadingPage: "Oldal betöltése...",
    notFound: "Az ajánlatkérés nem található.",
    backDashboard: "Vissza az irányítópultra",
    requestLabel: "TrustBridge ajánlatkérés",
    date: "Dátum",
    status: "Státusz",
    positions: "Tételek",
    productsTitle: "Termékek ebben az ajánlatkérésben",
    smartSourcing: "Smart Sourcing ajánlatkérés",
    requestWithoutTitle: "Ajánlatkérés termékcím nélkül",
    quantityUnit: "Mennyiség / egység",
    targetCountry: "Célország",
    description: "Leírás",
    noProducts: "Nem találhatók termékek.",
    position: "Tétel",
    product: "Termék",
    internalId: "Belső ID",
    category: "Kategória",
    country: "Ország",
    supplier: "Beszállító",
    priceOnRequest: "Ár kérésre",
    quantity: "Mennyiség",
    deliveryPlace: "Szállítási hely",
    deadline: "Határidő",
    note: "Megjegyzés",
    offerReceived: "Ajánlat érkezett",
    supplierOffer: "Beszállítói ajánlat",
    priceOffer: "Ár / Ajánlat",
    deliveryTime: "Szállítási idő",
    terms: "Feltételek",
    message: "Üzenet",
    overview: "Áttekintés",
    requestData: "Ajánlatkérés adatai",
    company: "Cég",
    email: "E-mail",
    transport: "Szállítás",
    confidentiality: "Bizalmasság",
    subRequest: "Al-ajánlatkérés",
    yes: "Igen",
    no: "Nem",
    adminControl: "Admin vezérlés",
    changeStatus: "Státusz módosítása",
    saveStatus: "Státusz mentése",
    saving: "Mentés...",
    sendToSupplier: "Küldés beszállítónak",
    sending: "Küldés...",
    onlySubRequest: "Megjegyzés: beszállítónak küldés csak al-ajánlatkéréseknél működik.",
    offerSubmit: "Ajánlat küldése",
    updateOffer: "Ajánlat frissítése",
    sendOffer: "Ajánlat küldése",
    pricePlaceholder: "Ár / Ajánlat *",
    deliveryPlaceholder: "Szállítási idő, pl. 7-10 nap",
    messagePlaceholder: "Üzenet / Feltételek",
    currency: "Pénznem",
    deliveryChoose: "Szállítási idő kiválasztása",
    termsChoose: "Feltételek kiválasztása",
    extraMessage: "További üzenet",
    deliveryOptions: [
  { value: "1_3_days", label: "1-3 nap" },
  { value: "4_7_days", label: "4-7 nap" },
  { value: "7_10_days", label: "7-10 nap" },
  { value: "10_14_days", label: "10-14 nap" },
  { value: "2_4_weeks", label: "2-4 hét" },
  { value: "agreement", label: "Megállapodás szerint" },
],
   termOptions: [
  { value: "price_includes_delivery", label: "Az ár tartalmazza a szállítást" },
  { value: "price_excludes_delivery", label: "Az ár nem tartalmazza a szállítást" },
  { value: "bank_transfer", label: "Fizetés banki átutalással" },
  { value: "delivery_after_payment", label: "Szállítás fizetés beérkezése után" },
  { value: "valid_7_days", label: "Ajánlat érvényes 7 napig" },
  { value: "valid_14_days", label: "Ajánlat érvényes 14 napig" },
],
    notReleased: "Még nincs jóváhagyva",
    notReleasedText: "Ezt az ajánlatkérést a TrustBridge még nem hagyta jóvá ajánlattételre.",
    nextStep: "Következő lépés",
    nextSupplier: "Kérjük, ellenőrizze az ajánlatkérést, és küldjön ajánlatot a TrustBridge számára.",
    nextCustomer: "A TrustBridge ellenőrzi az ajánlatkérést, és szükség esetén továbbítja megfelelő partnereknek vagy beszállítóknak.",
    searchMore: "További termékek keresése",
    confirmSend: "Biztosan elküldi ezt az ajánlatkérést a beszállítónak?",
    sentSupplier: "Az ajánlatkérés elküldve a beszállítónak.",
    serverError: "Szerverhiba.",
    sendError: "Hiba a küldés során.",
    statusUpdated: "A státusz frissítve.",
    updateError: "Hiba a frissítés során.",
    offerSent: "Az ajánlat elküldve.",
    loadingSupplier: "Beszállítói adatok betöltése...",
    statuses: {
      pending_review: "Ellenőrzésre vár",
      nou: "Új",
      processing: "Feldolgozás alatt",
      sent_to_partner: "Partnernek elküldve",
      sent_to_supplier: "Beszállítónak elküldve",
      offer_received: "Ajánlat érkezett",
      completed: "Lezárva",
      rejected: "Elutasítva",
    },
  },
};

type T = (typeof translations)["de"];

const supplierCache: Record<string, SupplierInfo | null> = {};

function normalizeCountry(value: any) {
  const v = String(value || "")
    .toLowerCase()
    .replace("romu00e2nia", "romania")
    .replace("rumu00e4nien", "rumanien")
    .replace("românia", "romania")
    .replace("rumänien", "rumanien")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["romania", "rumanien", "ro"].includes(v)) return "romania";
  if (["deutschland", "germany", "de"].includes(v)) return "germany";
  if (["ungarn", "hungary", "hu"].includes(v)) return "hungary";
  if (["osterreich", "austria", "at"].includes(v)) return "austria";
  if (["schweiz", "switzerland", "ch"].includes(v)) return "switzerland";

  return v;
}

function translateCountry(value: any, lang: string) {
  const key = normalizeCountry(value);

  const labels: any = {
    de: {
      romania: "Rumänien",
      germany: "Deutschland",
      hungary: "Ungarn",
      austria: "Österreich",
      switzerland: "Schweiz",
    },
    ro: {
      romania: "România",
      germany: "Germania",
      hungary: "Ungaria",
      austria: "Austria",
      switzerland: "Elveția",
    },
    hu: {
      romania: "Románia",
      germany: "Németország",
      hungary: "Magyarország",
      austria: "Ausztria",
      switzerland: "Svájc",
    },
  };

  return labels[lang]?.[key] || value || "-";
}



async function fetchSupplierInfo(supplierId: string | number): Promise<SupplierInfo | null> {
  const key = String(supplierId);
  if (key in supplierCache) return supplierCache[key];

  try {
    const res = await fetch(`${API}/supplier-info/${key}`, { cache: "no-store" });
    if (!res.ok) {
      supplierCache[key] = null;
      return null;
    }

    const data = (await res.json()) as SupplierInfo;
    supplierCache[key] = data;
    return data;
  } catch {
    supplierCache[key] = null;
    return null;
  }
}

function SupplierCard({ item, t }: { item: EnrichedItem; t: T }) {
  const initialSupplier =
    item.supplier_id && item.supplier_id !== "unknown" && (item.supplier_name || item.supplier_email)
      ? {
          id: Number(item.supplier_id),
          name: item.supplier_name || "",
          email: item.supplier_email || "",
          company: item.supplier_company || "",
        }
      : undefined;

  const [supplier, setSupplier] = useState<SupplierInfo | null | undefined>(
    item.supplier_id && item.supplier_id !== "unknown" ? initialSupplier : null
  );

  useEffect(() => {
    const sid = item.supplier_id;

    if (!sid || sid === "unknown") return;

    let active = true;

    fetchSupplierInfo(sid).then((data) => {
      if (!active) return;

      if (data) {
        setSupplier(data);
      } else if (!item.supplier_name && !item.supplier_email) {
        setSupplier(null);
      }
    });

    return () => {
      active = false;
    };
  }, [item.supplier_id, item.supplier_name, item.supplier_email]);

  if (supplier === undefined) {
    return (
      <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-400 animate-pulse">
        {t.loadingSupplier}
      </div>
    );
  }

  if (!supplier) return null;

  return (
    <div className="mt-3 rounded-xl border border-[#108280]/20 bg-[#108280]/5 px-4 py-3">
      <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#108280]">
        {t.supplier}
      </p>
      <div className="space-y-1">
        {supplier.name && <p className="text-sm font-bold text-slate-900">{supplier.name}</p>}
        {supplier.company && <p className="text-sm text-slate-600">{supplier.company}</p>}
        {supplier.email && <p className="text-sm text-slate-500">{supplier.email}</p>}
        {!supplier.name && !supplier.company && !supplier.email && (
          <p className="text-sm text-slate-400">ID: {supplier.id}</p>
        )}
      </div>
    </div>
  );
}

function deliveryLabelToValue(value?: string) {
  const map: Record<string, string> = {
    "1-3 Tage": "1_3_days",
    "1-3 zile": "1_3_days",
    "1-3 nap": "1_3_days",
    "4-7 Tage": "4_7_days",
    "4-7 zile": "4_7_days",
    "4-7 nap": "4_7_days",
    "7-10 Tage": "7_10_days",
    "7-10 zile": "7_10_days",
    "7-10 nap": "7_10_days",
    "10-14 Tage": "10_14_days",
    "10-14 zile": "10_14_days",
    "10-14 nap": "10_14_days",
    "2-4 Wochen": "2_4_weeks",
    "2-4 săptămâni": "2_4_weeks",
    "2-4 hét": "2_4_weeks",
    "Nach Vereinbarung": "agreement",
    "După acord": "agreement",
    "Megállapodás szerint": "agreement",
  };

  return map[value || ""] || value || "";
}

function termsLabelToValue(value?: string) {
  const map: Record<string, string> = {
    "Preis inklusive Lieferung": "price_includes_delivery",
    "Preț cu livrare inclusă": "price_includes_delivery",
    "Az ár tartalmazza a szállítást": "price_includes_delivery",
    "Preis exklusive Lieferung": "price_excludes_delivery",
    "Preț fără livrare": "price_excludes_delivery",
    "Az ár nem tartalmazza a szállítást": "price_excludes_delivery",
    "Zahlung per Überweisung": "bank_transfer",
    "Plată prin transfer bancar": "bank_transfer",
    "Fizetés banki átutalással": "bank_transfer",
    "Lieferung nach Zahlungseingang": "delivery_after_payment",
    "Livrare după primirea plății": "delivery_after_payment",
    "Szállítás fizetés beérkezése után": "delivery_after_payment",
    "Angebot gültig 7 Tage": "valid_7_days",
    "Ofertă valabilă 7 zile": "valid_7_days",
    "Ajánlat érvényes 7 napig": "valid_7_days",
    "Angebot gültig 14 Tage": "valid_14_days",
    "Ofertă valabilă 14 zile": "valid_14_days",
    "Ajánlat érvényes 14 napig": "valid_14_days",
  };

  return map[value || ""] || value || "";
}


function RequestDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawLang = pathname.split("/")[1] || "de";
  const lang: Lang = rawLang === "ro" || rawLang === "hu" || rawLang === "de" ? rawLang : "de";
  const t = translations[lang];
  const id = searchParams.get("id");

  const [user, setUser] = useState<UserData | null>(null);
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const statusLabel = (status: string) =>
    t.statuses[status as StatusKey] || status || "pending_review";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      router.push(`/${lang}/login`);
      return;
    }

    if (!id) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    let active = true;

    async function loadRequest() {
      try {
        const meRes = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const meData = (await meRes.json()) as UserData & { code?: string };

        if (meData.code) {
          router.push(`/${lang}/login`);
          return;
        }

        const res = await fetch(`${API}/requests?lang=${lang}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = (await res.json()) as RequestData[];

        const found = Array.isArray(data)
          ? data.find((req: RequestData) => String(req.id) === String(id))
          : null;

        if (!active) return;

        setUser(meData);
        setRequestData(found || null);
      } catch (error) {
        console.error("Request details error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRequest();

    return () => {
      active = false;
    };
  }, [id, router, lang]);

  if (loading) {
    return <main className="min-h-screen bg-[#f4f6f8] p-10">{t.loadingRequest}</main>;
  }

  if (!requestData) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black">{t.notFound}</h1>
          <Link
            href={`/${lang}/dashboard`}
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white"
          >
            {t.backDashboard}
          </Link>
        </div>
      </main>
    );
  }

  const items: EnrichedItem[] = requestData.items || [];
  const role = user?.roles?.[0];

  const isSupplier =
    user?.roles?.includes("tb_supplier") ||
    user?.roles?.includes("TrustBridge_Supplier");

  const isAdmin = role === "administrator";

  const hasOffer = Boolean(
    requestData.offer_price ||
    requestData.offer_delivery_time ||
    requestData.offer_terms ||
    requestData.offer_message
    
  );
const hasCustomerDecision = Boolean(requestData.customer_decision);
  const isSubRequest = Boolean(requestData.parent_request);

  const supplierCanOffer =
    isSupplier &&
    (requestData.status === "sent_to_supplier" || requestData.status === "offer_received");

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${lang}/dashboard`}
            className="text-sm font-bold text-white/80 hover:text-white"
          >
            ← {t.backDashboard}
          </Link>

          <p className="mt-6 text-xs font-black uppercase tracking-wider text-white/70">
            {t.requestLabel}
          </p>

          <h1 className="mt-2 text-4xl font-black">#{requestData.id}</h1>

          <p className="mt-2 text-white/80">
            {t.date}: {requestData.date || "-"} · {t.status}:{" "}
            {statusLabel(requestData.status || "pending_review")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Products card */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              {t.positions}
            </p>

            <h2 className="mt-1 text-2xl font-black">{t.productsTitle}</h2>

            {items.length === 0 ? (
              requestData.custom_product || requestData.custom_message ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-[#108280]">
                    {t.smartSourcing}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-slate-950">
                    {requestData.custom_product || t.requestWithoutTitle}
                  </h3>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <InfoBox label={t.quantityUnit} value={requestData.custom_quantity || "-"} />
                    <InfoBox label={t.targetCountry} value={requestData.delivery_country || "-"} />
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-5">
                    <p className="text-xs font-black uppercase text-slate-500">{t.description}</p>
                    <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-slate-800">
                      {requestData.custom_message || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-slate-50 p-6 text-slate-500">{t.noProducts}</p>
              )
            ) : (
              <div className="mt-6 space-y-5">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
                          {t.position} {index + 1}
                        </span>

                        <h3 className="mt-3 text-xl font-black">{item.title || t.product}</h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {t.internalId}: {item.internal_id || "-"} · {t.category}:{" "}
                          {item.category || "-"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {t.country}:{" "}
                          {translateCountry(item.country || requestData.delivery_country, lang)}
                        </p>

                        <SupplierCard item={item} t={t} />
                      </div>

                      <span className="h-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                        {item.price_status === "request"
                          ? t.priceOnRequest
                          : item.price_status || t.priceOnRequest}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <InfoBox
                        label={t.quantity}
                        value={`${item.quantity || "1"} ${item.unit || ""}`}
                      />
                      <InfoBox label={t.deliveryPlace} value={item.delivery_location || "-"} />
                      <InfoBox label={t.deadline} value={item.desired_date || "-"} />
                      <InfoBox label={t.note} value={item.customer_note || "-"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offer received card */}
          {hasOffer && (
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-green-700">
                {t.offerReceived}
              </p>

              <h2 className="mt-1 text-2xl font-black">{t.supplierOffer}</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBox
                  label={t.priceOffer}
                  value={
                    requestData.offer_price
                      ? `${requestData.offer_price} ${requestData.offer_currency || "EUR"}`
                      : "-"
                  }
                />
                <InfoBox label={t.deliveryTime} value={requestData.offer_delivery_time || "-"} />
                <InfoBox label={t.terms} value={requestData.offer_terms || "-"} />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">{t.message}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {requestData.offer_message || "-"}
                </p>
                {!isSupplier && !isAdmin && !hasCustomerDecision && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("trustbridge_token");
    const form = e.currentTarget;
const formData = new FormData(form);

const submitter = (e.nativeEvent as unknown as { submitter?: HTMLButtonElement }).submitter;
const decision = submitter?.value || "";

      try {
        const res = await fetch(`${API}/request-customer-decision`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: requestData.id,
            decision,
            message: formData.get("message"),
            hotel: formData.get("hotel") === "on",
            transport: formData.get("transport") === "on",
            customs: formData.get("customs") === "on",
            insurance: formData.get("insurance") === "on",
          }),
        });

        const data = await res.json();

        if (data.success) {
         alert(t.decisionSaved);
          window.location.reload();
        } else {
          alert(data.message || "Eroare.");
        }
      } catch {
        alert("Eroare server.");
      }
    }}
    className="mt-6 rounded-2xl border bg-slate-50 p-5"
  >
    <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
      {t.customerDecision}
    </p>

    <textarea
      name="message"
      rows={3}
      placeholder={t.decisionMessage}
      className="mt-4 w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
    />

    <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700">
      <label className="flex gap-2">
        <input name="hotel" type="checkbox" />
       {t.wantHotel}
      </label>

      <label className="flex gap-2">
        <input name="transport" type="checkbox" />
        {t.wantTransport}
      </label>

      <label className="flex gap-2">
        <input name="customs" type="checkbox" />
       {t.wantCustoms}
      </label>

      <label className="flex gap-2">
        <input name="insurance" type="checkbox" />
        {t.wantInsurance}
      </label>
    </div>

    <div className="mt-5 grid gap-3 md:grid-cols-2">
     <button
  type="submit"
  name="decision"
  value="accepted"
  className="rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white"
>
  {t.acceptOffer}
</button>

<button
  type="submit"
  name="decision"
  value="rejected"
  className="rounded-xl bg-red-600 py-4 text-sm font-black uppercase text-white"
>
  {t.rejectOffer}
</button>
    </div>
  </form>
)}
{hasCustomerDecision && (
  <div className="mt-6 rounded-2xl border bg-white p-5">
    <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
      {t.customerDecision}
    </p>

    <div
      className={`mt-3 rounded-xl px-4 py-4 text-sm font-black uppercase ${
        requestData.customer_decision === "accepted"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {requestData.customer_decision === "accepted"
        ? t.acceptOffer
        : t.rejectOffer}
    </div>

    {requestData.customer_decision_message && (
      <p className="mt-3 text-sm font-semibold text-slate-600">
        {requestData.customer_decision_message}
      </p>
    )}
  </div>
)}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          {/* Overview card */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              {t.overview}
            </p>

            <h2 className="mt-1 text-xl font-black">{t.requestData}</h2>

            <div className="mt-5 space-y-3 text-sm">
              <DetailRow
                label={t.status}
                value={statusLabel(requestData.status || "pending_review")}
              />
              <DetailRow label={t.company} value={requestData.company || "-"} />
              <DetailRow label={t.email} value={requestData.email || "-"} />
              <DetailRow
                label={t.targetCountry}
                value={translateCountry(requestData.delivery_country, lang)}
              />
              <DetailRow label={t.transport} value={requestData.transport_needed || "-"} />
              <DetailRow label={t.confidentiality} value={requestData.confidentiality || "-"} />
              <DetailRow label={t.subRequest} value={isSubRequest ? t.yes : t.no} />
            </div>
          </div>

          {/* Admin panel */}
          {isAdmin && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {t.adminControl}
              </p>

              <h2 className="mt-1 text-xl font-black">{t.changeStatus}</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("trustbridge_token");
                  const formData = new FormData(e.currentTarget);

                  setStatusLoading(true);

                  try {
                    const res = await fetch(`${API}/request-status`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        request_id: requestData.id,
                        status: formData.get("status"),
                      }),
                    });

                    const data = (await res.json()) as { success?: boolean; message?: string };

                    if (data.success) {
                      alert(t.statusUpdated);
                      window.location.reload();
                    } else {
                      alert(data.message || t.updateError);
                    }
                  } catch {
                    alert(t.serverError);
                  } finally {
                    setStatusLoading(false);
                  }
                }}
                className="mt-5 space-y-4"
              >
                <select
                  name="status"
                  defaultValue={requestData.status || "pending_review"}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                >
                  <option value="pending_review">{t.statuses.pending_review}</option>
                  <option value="nou">{t.statuses.nou}</option>
                  <option value="processing">{t.statuses.processing}</option>
                  <option value="sent_to_partner">{t.statuses.sent_to_partner}</option>
                  <option value="sent_to_supplier">{t.statuses.sent_to_supplier}</option>
                  <option value="offer_received">{t.statuses.offer_received}</option>
                  <option value="completed">{t.statuses.completed}</option>
                  <option value="rejected">{t.statuses.rejected}</option>
                </select>

                <button
                  disabled={statusLoading}
                  className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black uppercase text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {statusLoading ? t.saving : t.saveStatus}
                </button>
              </form>

              {isSubRequest && requestData.status !== "offer_received" && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {t.sendToSupplier}
                  </p>

                  <div className="flex gap-2">
                    <input
                      id="manual-supplier-id"
                      type="number"
                      defaultValue={requestData.supplier_id || ""}
                      placeholder="Supplier ID"
                      className="w-full rounded-xl border p-3 text-sm outline-none focus:border-[#108280]"
                    />

                    <button
                      type="button"
                      disabled={sendLoading}
                      onClick={async () => {
                        const token = localStorage.getItem("trustbridge_token");
                        const input = document.getElementById(
                          "manual-supplier-id"
                        ) as HTMLInputElement | null;
                        const supplierId = input?.value?.trim();

                        if (!supplierId || Number.isNaN(Number(supplierId))) {
                          alert("Introduceți un Supplier ID numeric valid.");
                          return;
                        }

                        if (!confirm(t.confirmSend)) return;

                        setSendLoading(true);

                        try {
                          const res = await fetch(`${API}/request-send-to-supplier`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              id: requestData.id,
                              supplier_id: Number(supplierId),
                            }),
                          });

                          const data = (await res.json()) as {
                            success?: boolean;
                            message?: string;
                          };

                          if (data.success) {
                            alert(t.sentSupplier);
                            window.location.reload();
                          } else {
                            alert(data.message || t.sendError);
                          }
                        } catch {
                          alert(t.serverError);
                        } finally {
                          setSendLoading(false);
                        }
                      }}
                      className="rounded-xl bg-[#108280] px-4 py-3 text-sm font-black text-white hover:bg-[#0d6b69] disabled:opacity-50 whitespace-nowrap"
                    >
                      {sendLoading ? t.sending : "→"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    Supplier ID curent:{" "}
                    <strong>{requestData.supplier_id || "nedefinit"}</strong>
                  </p>
                </div>
              )}

              {!isSubRequest && (
                <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-xs font-bold text-yellow-700">
                  {t.onlySubRequest}
                </p>
              )}
            </div>
          )}

          {/* Supplier offer form */}
          {supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {t.supplierOffer}
              </p>

              <h2 className="mt-1 text-xl font-black">{t.offerSubmit}</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("trustbridge_token");
                  const formData = new FormData(e.currentTarget);

                  setOfferLoading(true);

                  try {
                    const res = await fetch(`${API}/request-offer`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        request_id: requestData.id,
                        price: formData.get("price"),
                        currency: formData.get("currency"),
                        delivery_time: formData.get("delivery_time"),
                        terms: formData.get("terms"),
                        message: formData.get("message"),
                      }),
                    });

                    const data = (await res.json()) as { success?: boolean; message?: string };

                    if (data.success) {
                      alert(t.offerSent);
                      window.location.reload();
                    } else {
                      alert(data.message || t.sendError);
                    }
                  } catch {
                    alert(t.serverError);
                  } finally {
                    setOfferLoading(false);
                  }
                }}
                className="mt-5 space-y-4"
              >
                {/* Preț + Monedă */}
                <div className="flex gap-2">
                  <input
                    name="price"
                    required
                    defaultValue={requestData.offer_price || ""}
                    placeholder={t.pricePlaceholder}
                    className="flex-1 rounded-xl border p-3 outline-none focus:border-[#108280]"
                  />
                  <select
                    name="currency"
                    defaultValue={requestData.offer_currency || "EUR"}
                    className="rounded-xl border p-3 font-bold outline-none focus:border-[#108280]"
                  >
                    <option value="EUR">EUR</option>
                    <option value="RON">RON</option>
                    <option value="HUF">HUF</option>
                  </select>
                </div>

                {/* Timp livrare */}
                <select
                  name="delivery_time"
                 defaultValue={deliveryLabelToValue(requestData.offer_delivery_time)}
                  className="w-full rounded-xl border p-3 text-slate-700 outline-none focus:border-[#108280]"
                >
                  <option value="" disabled>
                    {t.deliveryChoose}
                  </option>
                 {t.deliveryOptions.map((opt) => (
  <option key={opt.value} value={opt.value}>
    {opt.label}
  </option>
))}
                </select>

                {/* Condiții */}
                <select
                  name="terms"
                  defaultValue={termsLabelToValue(requestData.offer_terms)}
                  className="w-full rounded-xl border p-3 text-slate-700 outline-none focus:border-[#108280]"
                >
                  <option value="" disabled>
                    {t.termsChoose}
                  </option>
                  {t.termOptions.map((opt) => (
  <option key={opt.value} value={opt.value}>
    {opt.label}
  </option>
))}
                </select>

                {/* Mesaj suplimentar */}
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={requestData.offer_message || ""}
                  placeholder={t.extraMessage}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />

                <button
                  disabled={offerLoading}
                  className="w-full rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50"
                >
                  {offerLoading ? t.sending : hasOffer ? t.updateOffer : t.sendOffer}
                </button>
              </form>
            </div>
          )}

          {/* Supplier - not yet released */}
          {isSupplier && !supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{t.notReleased}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t.notReleasedText}</p>
            </div>
          )}

          {/* Next step */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">{t.nextStep}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isSupplier ? t.nextSupplier : t.nextCustomer}
            </p>

            <Link
              href={isSupplier ? `/${lang}/dashboard` : `/${lang}/marketplace`}
              className="mt-5 block rounded-xl bg-[#108280] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
            >
              {isSupplier ? t.backDashboard : t.searchMore}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function RequestDetailsPage() {
  const pathname = usePathname();
  const rawLang = pathname.split("/")[1] || "de";
  const lang: Lang = rawLang === "ro" || rawLang === "hu" || rawLang === "de" ? rawLang : "de";

  return (
    <Suspense fallback={<div className="p-10 font-black">{translations[lang].loadingPage}</div>}>
      <RequestDetailsContent />
    </Suspense>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2">
      <span className="text-slate-500">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
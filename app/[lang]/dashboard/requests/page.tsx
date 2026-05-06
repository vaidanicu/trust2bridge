"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

type Lang = "de" | "ro" | "hu";

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
    priceOffer: "Preis / Angebot",
    deliveryTime: "Lieferzeit",
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
    onlySubRequest:
      "Hinweis: An Anbieter senden funktioniert nur bei Sub-Anfragen.",
    offerSubmit: "Angebot abgeben",
    updateOffer: "Angebot aktualisieren",
    sendOffer: "Angebot senden",
    pricePlaceholder: "Preis / Angebot *",
    deliveryPlaceholder: "Lieferzeit, z. B. 7-10 Tage",
    messagePlaceholder: "Nachricht / Bedingungen",
    notReleased: "Noch nicht freigegeben",
    notReleasedText:
      "Diese Anfrage wurde noch nicht von TrustBridge zur Angebotsabgabe freigegeben.",
    nextStep: "Nächster Schritt",
    nextSupplier:
      "Bitte prüfen Sie die Anfrage und senden Sie ein Angebot an TrustBridge.",
    nextCustomer:
      "TrustBridge prüft die Anfrage und leitet sie bei Bedarf an passende Partner oder Lieferanten weiter.",
    searchMore: "Weitere Produkte suchen",
    confirmSend: "Diese Anfrage wirklich an den Anbieter senden?",
    sentSupplier: "Anfrage wurde an Anbieter gesendet.",
    serverError: "Serverfehler.",
    sendError: "Fehler beim Senden.",
    statusUpdated: "Status wurde aktualisiert.",
    updateError: "Fehler beim Aktualisieren.",
    offerSent: "Angebot wurde gesendet.",
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
    onlySubRequest:
      "Notă: trimiterea către furnizor funcționează doar pentru sub-cereri.",
    offerSubmit: "Trimite ofertă",
    updateOffer: "Actualizează oferta",
    sendOffer: "Trimite oferta",
    pricePlaceholder: "Preț / Ofertă *",
    deliveryPlaceholder: "Timp livrare, ex. 7-10 zile",
    messagePlaceholder: "Mesaj / Condiții",
    notReleased: "Încă nu este aprobată",
    notReleasedText:
      "Această cerere nu a fost încă aprobată de TrustBridge pentru transmiterea unei oferte.",
    nextStep: "Următorul pas",
    nextSupplier:
      "Vă rugăm să verificați cererea și să trimiteți o ofertă către TrustBridge.",
    nextCustomer:
      "TrustBridge verifică cererea și o transmite, dacă este necesar, către parteneri sau furnizori potriviți.",
    searchMore: "Caută alte produse",
    confirmSend: "Trimitem această cerere către furnizor?",
    sentSupplier: "Cererea a fost trimisă către furnizor.",
    serverError: "Eroare server.",
    sendError: "Eroare la trimitere.",
    statusUpdated: "Statusul a fost actualizat.",
    updateError: "Eroare la actualizare.",
    offerSent: "Oferta a fost trimisă.",
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

  hu: {
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
    onlySubRequest:
      "Megjegyzés: beszállítónak küldés csak al-ajánlatkéréseknél működik.",
    offerSubmit: "Ajánlat küldése",
    updateOffer: "Ajánlat frissítése",
    sendOffer: "Ajánlat küldése",
    pricePlaceholder: "Ár / Ajánlat *",
    deliveryPlaceholder: "Szállítási idő, pl. 7-10 nap",
    messagePlaceholder: "Üzenet / Feltételek",
    notReleased: "Még nincs jóváhagyva",
    notReleasedText:
      "Ezt az ajánlatkérést a TrustBridge még nem hagyta jóvá ajánlattételre.",
    nextStep: "Következő lépés",
    nextSupplier:
      "Kérjük, ellenőrizze az ajánlatkérést, és küldjön ajánlatot a TrustBridge számára.",
    nextCustomer:
      "A TrustBridge ellenőrzi az ajánlatkérést, és szükség esetén továbbítja megfelelő partnereknek vagy beszállítóknak.",
    searchMore: "További termékek keresése",
    confirmSend: "Biztosan elküldi ezt az ajánlatkérést a beszállítónak?",
    sentSupplier: "Az ajánlatkérés elküldve a beszállítónak.",
    serverError: "Szerverhiba.",
    sendError: "Hiba a küldés során.",
    statusUpdated: "A státusz frissítve.",
    updateError: "Hiba a frissítés során.",
    offerSent: "Az ajánlat elküldve.",
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

function RequestDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawLang = pathname.split("/")[1] || "de";
  const lang: Lang =
    rawLang === "ro" || rawLang === "hu" || rawLang === "de"
      ? rawLang
      : "de";

  const t = translations[lang];
  const id = searchParams.get("id");

  const [user, setUser] = useState<any>(null);
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const statusLabel = (status: string) =>
    t.statuses[status as keyof typeof t.statuses] || status || "pending_review";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("trustbridge_token");

    if (!token) {
      router.push(`/${lang}/login`);
      return;
    }

    async function loadRequest() {
      try {
        const meRes = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meData = await meRes.json();
        setUser(meData);

        const res = await fetch(`${API}/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const found = Array.isArray(data)
          ? data.find((req: any) => String(req.id) === String(id))
          : null;

        setRequestData(found || null);
      } catch (error) {
        console.error("Request details error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRequest();
    } else {
      setLoading(false);
    }
  }, [id, router, lang]);

  async function sendToSupplier() {
    const token = localStorage.getItem("trustbridge_token");
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
        }),
      });

      const data = await res.json();

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
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] p-10">
        {t.loadingRequest}
      </main>
    );
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

  const items = requestData.items || [];
  const role = user?.roles?.[0];

  const isSupplier =
    user?.roles?.includes("tb_supplier") ||
    user?.roles?.includes("TrustBridge_Supplier");

  const isAdmin = role === "administrator";
  const hasOffer = Boolean(requestData.offer_price || requestData.offer_message);
  const isSubRequest = Boolean(requestData.parent_request);

  const canSendToSupplier =
    isAdmin &&
    isSubRequest &&
    requestData.status !== "sent_to_supplier" &&
    requestData.status !== "offer_received";

  const supplierCanOffer =
    isSupplier &&
    (requestData.status === "sent_to_supplier" ||
      requestData.status === "offer_received");

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
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

          <h1 className="mt-2 text-4xl font-black">
            #{requestData.id}
          </h1>

          <p className="mt-2 text-white/80">
            {t.date}: {requestData.date || "-"} · {t.status}:{" "}
            {statusLabel(requestData.status || "pending_review")}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              {t.positions}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {t.productsTitle}
            </h2>

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
                    <InfoBox
                      label={t.quantityUnit}
                      value={requestData.custom_quantity || "-"}
                    />

                    <InfoBox
                      label={t.targetCountry}
                      value={requestData.delivery_country || "-"}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-5">
                    <p className="text-xs font-black uppercase text-slate-500">
                      {t.description}
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-slate-800">
                      {requestData.custom_message || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-slate-50 p-6 text-slate-500">
                  {t.noProducts}
                </p>
              )
            ) : (
              <div className="mt-6 space-y-5">
                {items.map((item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
                          {t.position} {index + 1}
                        </span>

                        <h3 className="mt-3 text-xl font-black">
                          {item.title || t.product}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {t.internalId}: {item.internal_id || "-"} ·{" "}
                          {t.category}: {item.category || "-"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {t.country}: {item.country || "-"} · {t.supplier}:{" "}
                          {item.supplier_name || item.supplier_id || "-"}
                        </p>
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
                      <InfoBox
                        label={t.deliveryPlace}
                        value={item.delivery_location || "-"}
                      />
                      <InfoBox
                        label={t.deadline}
                        value={item.desired_date || "-"}
                      />
                      <InfoBox
                        label={t.note}
                        value={item.customer_note || "-"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasOffer && (
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-green-700">
                {t.offerReceived}
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {t.supplierOffer}
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBox
                  label={t.priceOffer}
                  value={requestData.offer_price || "-"}
                />
                <InfoBox
                  label={t.deliveryTime}
                  value={requestData.offer_delivery_time || "-"}
                />
                <InfoBox
                  label={t.supplier}
                  value={requestData.offer_supplier_email || "-"}
                />
                <InfoBox
                  label={t.date}
                  value={requestData.offer_created_at || "-"}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  {t.message}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {requestData.offer_message || "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              {t.overview}
            </p>

            <h2 className="mt-1 text-xl font-black">
              {t.requestData}
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <DetailRow
                label={t.status}
                value={statusLabel(requestData.status || "pending_review")}
              />
              <DetailRow label={t.company} value={requestData.company || "-"} />
              <DetailRow label={t.email} value={requestData.email || "-"} />
              <DetailRow
                label={t.targetCountry}
                value={requestData.delivery_country || "-"}
              />
              <DetailRow
                label={t.transport}
                value={requestData.transport_needed || "-"}
              />
              <DetailRow
                label={t.confidentiality}
                value={requestData.confidentiality || "-"}
              />
              <DetailRow
                label={t.subRequest}
                value={isSubRequest ? t.yes : t.no}
              />
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {t.adminControl}
              </p>

              <h2 className="mt-1 text-xl font-black">
                {t.changeStatus}
              </h2>

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

                    const data = await res.json();

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
                  <option value="pending_review">
                    {t.statuses.pending_review}
                  </option>
                  <option value="nou">{t.statuses.nou}</option>
                  <option value="processing">
                    {t.statuses.processing}
                  </option>
                  <option value="sent_to_partner">
                    {t.statuses.sent_to_partner}
                  </option>
                  <option value="sent_to_supplier">
                    {t.statuses.sent_to_supplier}
                  </option>
                  <option value="offer_received">
                    {t.statuses.offer_received}
                  </option>
                  <option value="completed">
                    {t.statuses.completed}
                  </option>
                  <option value="rejected">
                    {t.statuses.rejected}
                  </option>
                </select>

                <button
                  disabled={statusLoading}
                  className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black uppercase text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {statusLoading ? t.saving : t.saveStatus}
                </button>
              </form>

              {canSendToSupplier && (
                <button
                  onClick={sendToSupplier}
                  disabled={sendLoading}
                  className="mt-4 w-full rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50"
                >
                  {sendLoading ? t.sending : t.sendToSupplier}
                </button>
              )}

              {!isSubRequest && (
                <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-xs font-bold text-yellow-700">
                  {t.onlySubRequest}
                </p>
              )}
            </div>
          )}

          {supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                {t.supplierOffer}
              </p>

              <h2 className="mt-1 text-xl font-black">
                {t.offerSubmit}
              </h2>

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
                        delivery_time: formData.get("delivery_time"),
                        message: formData.get("message"),
                      }),
                    });

                    const data = await res.json();

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
                <input
                  name="price"
                  required
                  defaultValue={requestData.offer_price || ""}
                  placeholder={t.pricePlaceholder}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />

                <input
                  name="delivery_time"
                  defaultValue={requestData.offer_delivery_time || ""}
                  placeholder={t.deliveryPlaceholder}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />

                <textarea
                  name="message"
                  rows={4}
                  defaultValue={requestData.offer_message || ""}
                  placeholder={t.messagePlaceholder}
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#108280]"
                />

                <button
                  disabled={offerLoading}
                  className="w-full rounded-xl bg-[#108280] py-4 text-sm font-black uppercase text-white hover:bg-[#0d6b69] disabled:opacity-50"
                >
                  {offerLoading
                    ? t.sending
                    : hasOffer
                    ? t.updateOffer
                    : t.sendOffer}
                </button>
              </form>
            </div>
          )}

          {isSupplier && !supplierCanOffer && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">
                {t.notReleased}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.notReleasedText}
              </p>
            </div>
          )}

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              {t.nextStep}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isSupplier ? t.nextSupplier : t.nextCustomer}
            </p>

            <Link
              href={
                isSupplier
                  ? `/${lang}/dashboard`
                  : `/${lang}/marketplace`
              }
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
  const lang: Lang =
    rawLang === "ro" || rawLang === "hu" || rawLang === "de"
      ? rawLang
      : "de";

  return (
    <Suspense
      fallback={
        <div className="p-10 font-black">
          {translations[lang].loadingPage}
        </div>
      }
    >
      <RequestDetailsContent />
    </Suspense>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
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
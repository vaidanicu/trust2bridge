"use client";

import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function MarketplacePage({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const formRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // null = se încarcă, true = logat, false = nelogat
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  const [sourcingForm, setSourcingForm] = useState({
    company: "",
    product: "",
    quantity: "",
    deliveryCountry: "",
    email: "",
    message: "",
  });

  const countries = [
    "Österreich",
    "Ungarn",
    "Schweiz",
    "Deutschland",
    "Rumänien",
  ];

  const priorities = dict.marketplace?.priorities || [];

  const t =
    lang === "ro"
      ? {
          badge: "Sourcing inteligent",
          title: "Nu s-a găsit nicio ofertă potrivită",
          text: "Nu ați găsit ce căutați? Trimiteți-ne cererea, iar TrustBridge vă ajută să găsiți furnizori potriviți.",
          company: "Firma / Compania",
          product: "Produs / Serviciu",
          quantity: "Cantitate / Unitate",
          country: "Țara de livrare",
          email: "E-mailul dvs.",
          message: "Descrieți ce căutați...",
          submit: "Trimite cererea",
          reset: "Resetează filtrele",
          success: "Cererea dvs. a fost trimisă cu succes către TrustBridge.",
          error: "Eroare la trimitere. Vă rugăm să încercați din nou.",
          loginRequired: "Trebuie să fiți autentificat pentru a trimite o cerere.",
          loginBtn: "Autentifică-te",
        }
      : lang === "hu"
      ? {
          badge: "Okos beszerzés",
          title: "Nem található megfelelő ajánlat",
          text: "Nem találta meg, amit keres? Küldje el nekünk az igényét, és a TrustBridge segít megfelelő beszállítókat találni.",
          company: "Cég / Vállalat",
          product: "Termék / Szolgáltatás",
          quantity: "Mennyiség / Egység",
          country: "Szállítási ország",
          email: "Az Ön e-mail címe",
          message: "Írja le, mit keres...",
          submit: "Ajánlatkérés küldése",
          reset: "Szűrők törlése",
          success: "Kérése sikeresen elküldésre került a TrustBridge részére.",
          error: "Hiba történt a küldés során. Kérjük, próbálja újra.",
          loginRequired: "A kérés elküldéséhez be kell jelentkeznie.",
          loginBtn: "Bejelentkezés",
        }
      : {
          badge: "Smart Sourcing",
          title: "Kein passendes Angebot gefunden",
          text: "Sie haben nicht gefunden, was Sie suchen? Senden Sie uns Ihre Anfrage und TrustBridge hilft Ihnen passende Lieferanten zu finden.",
          company: "Firma / Unternehmen",
          product: "Produkt / Dienstleistung",
          quantity: "Menge / Einheit",
          country: "Zielland / Lieferland",
          email: "Ihre E-Mail",
          message: "Beschreiben Sie bitte, was Sie suchen...",
          submit: "Anfrage senden",
          reset: "Filter zurücksetzen",
          success: "Ihre Anfrage wurde erfolgreich an TrustBridge gesendet.",
          error: "Fehler beim Senden. Bitte versuchen Sie es erneut.",
          loginRequired: "Sie müssen angemeldet sein, um eine Anfrage zu senden.",
          loginBtn: "Anmelden",
        };

  // Verifică autentificarea din localStorage (doar client-side)
  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    const userRaw = localStorage.getItem("trustbridge_user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setIsAuthenticated(true);
        if (user?.email) {
          setSourcingForm((prev) => ({ ...prev, email: user.email }));
        }
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Sync URL params → filters
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlCountry = searchParams.get("country");
    const urlQuery = searchParams.get("q");

    if (urlCategory) setCategory(urlCategory);
    if (urlCountry) setCountry(urlCountry);
    if (urlQuery) setQuery(urlQuery);
  }, [searchParams]);

  // Scroll to sourcing form if ?smart=1
  useEffect(() => {
    const smart = searchParams.get("smart");

    if (smart === "1") {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [searchParams]);

  // Load marketplace items
  useEffect(() => {
    async function loadItems() {
      try {
       const res = await fetch(`${API}/items?lang=${lang}`, {
  cache: "no-store",
});
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Marketplace error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setCountry("");
  };

  const renderItemPrice = (item: any) => {
    const priceValue = item.price || item.tb_price;
    const convertedPrice = formatConvertedPrice(priceValue, lang);

    if (convertedPrice) {
      return (
        <span className="text-xl font-black italic text-red-600 tracking-tighter">
          {convertedPrice}
        </span>
      );
    }

    return (
      <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase text-orange-700 border border-orange-200">
        {dict.common?.price_on_request || "Preis auf Anfrage"}
      </span>
    );
  };

  const normalizeText = (value: any) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizeCountry = (value: any) => {
    const v = normalizeText(value);

    if (["romania", "românia", "rumanien", "rumänien", "ro"].includes(v)) return "romania";
    if (["ungarn", "hungary", "magyarorszag", "magyarország", "hu"].includes(v)) return "ungarn";
    if (["deutschland", "germany", "de"].includes(v)) return "deutschland";
    if (["osterreich", "österreich", "austria", "at"].includes(v)) return "osterreich";
    if (["schweiz", "switzerland", "ch"].includes(v)) return "schweiz";

    return v;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.title || ""} ${item.description || ""} ${
        item.category || ""
      } ${item.type || ""} ${item.country || ""}`.toLowerCase();

      const selectedQuery = normalizeText(query);
      const selectedCategory = normalizeText(category);
      const selectedCountry = normalizeCountry(country);

      const itemCategory = normalizeText(item.category);
      const itemType = normalizeText(item.type);
      const itemCountry = normalizeCountry(item.country);

      const matchesQuery = !selectedQuery || normalizeText(text).includes(selectedQuery);

      const matchesCategory =
        !selectedCategory ||
        itemCategory.includes(selectedCategory) ||
        itemType.includes(selectedCategory) ||
        selectedCategory.includes(itemCategory) ||
        selectedCategory.includes(itemType) ||
        (selectedCategory.includes("dienstleistung") &&
          (itemCategory.includes("dienstleistung") || itemType.includes("service")));

      const matchesCountry =
        !selectedCountry || itemCountry === selectedCountry;

      return matchesQuery && matchesCategory && matchesCountry;
    });
  }, [items, query, category, country]);

  const handleSourcingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Guard: redirect la login dacă nu e autentificat
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(`/${lang}/marketplace?smart=1`);
      router.push(`/${lang}/login?callbackUrl=${callbackUrl}`);
      return;
    }

    const token = localStorage.getItem("trustbridge_token");

    try {
      const res = await fetch(`${API}/custom-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          company: sourcingForm.company,
          product: sourcingForm.product,
          quantity: sourcingForm.quantity,
          country: sourcingForm.deliveryCountry,
          email: sourcingForm.email,
          message: sourcingForm.message,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Request failed");
      }

      alert(t.success);

      // Păstrează emailul după reset
      const userRaw = localStorage.getItem("trustbridge_user");
      const userEmail = userRaw ? JSON.parse(userRaw)?.email ?? "" : "";

      setSourcingForm({
        company: "",
        product: "",
        quantity: "",
        deliveryCountry: "",
        email: userEmail,
        message: "",
      });
    } catch (error) {
      console.error("Custom request error:", error);
      alert(t.error);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white border-b-4 border-slate-900 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            {dict.marketplace?.badge || "TrustBridge B2B"}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl italic uppercase">
            {dict.marketplace?.hero_title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85 font-medium">
            {dict.marketplace?.hero_subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${lang}/offer-create`}
              className="rounded-xl bg-white px-8 py-4 text-center font-black uppercase text-[#0b5f5d] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all active:shadow-none"
            >
              {dict.marketplace?.button_guided}
            </Link>

            <Link
              href={`/${lang}/request-basket`}
              className="rounded-xl border-2 border-white px-8 py-4 text-center font-black uppercase text-white hover:bg-white/10 transition-all"
            >
              {dict.marketplace?.button_basket}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Search Bar */}
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase italic">
            {dict.marketplace?.search_title}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.marketplace?.search_placeholder}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none focus:ring-4 ring-[#108280]/10"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none bg-white cursor-pointer"
            >
              <option value="">{dict.marketplace?.all_categories}</option>
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
              <option value="Dienstleistung">Dienstleistung</option>
              <option value="Dienstleistungen">Dienstleistungen</option>
              <option value="service">Service</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none bg-white cursor-pointer"
            >
              <option value="">{dict.marketplace?.all_countries}</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit space-y-6">
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase italic">
                {dict.marketplace?.filter_title}
              </h3>

              <div className="mt-6">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">
                  {dict.marketplace?.filter_where}
                </p>

                <div className="space-y-2 text-sm">
                  {countries.map((c) => {
                    const active = country.toLowerCase() === c.toLowerCase();

                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCountry(active ? "" : c)}
                        className={`block w-full rounded-xl border-2 px-4 py-3 text-left font-bold transition-all ${
                          active
                            ? "border-[#108280] bg-[#108280]/10 text-[#108280]"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {active ? "●" : "○"} {c}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCountry("")}
                    className="block w-full rounded-xl border-2 border-slate-100 px-4 py-3 text-left font-bold hover:border-slate-300"
                  >
                    {!country ? "●" : "○"} {dict.marketplace?.all_countries}
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#108280]/10 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-[#108280]">
                  TrustBridge Vorteil
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Wir unterstützen Sie bei Lieferantensuche, Angebotsvergleich und sicherer B2B-Abwicklung.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase text-white/50 tracking-widest">
                Hilfe benötigt?
              </p>

              <h4 className="mt-2 font-black italic uppercase leading-tight">
                Nicht sicher, was Sie brauchen?
              </h4>

              <Link
                href={`/${lang}/guided-request`}
                className="mt-4 block rounded-lg bg-[#108280] p-3 text-center text-xs font-black uppercase hover:bg-[#0d6b69] transition-colors"
              >
                Guided Request →
              </Link>
            </div>
          </aside>

          {/* Results */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
                  {dict.marketplace?.results_label}
                </p>

                <h2 className="text-3xl font-black uppercase italic">
                  {loading
                    ? "..."
                    : `${filteredItems.length} ${
                        dict.marketplace?.results_found || "gefunden"
                      }`}
                </h2>
              </div>

              {(query || category || country) && (
                <button
                  onClick={resetFilters}
                  className="hidden md:inline-flex rounded-xl border-2 border-slate-900 bg-white px-5 py-3 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-3xl border-2 border-slate-200 bg-white animate-pulse"
                  />
                ))}
              </div>
            ) : filteredItems.length === 0 || searchParams.get("smart") === "1" ? (
              <div
                ref={formRef}
                className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12"
              >
                <div className="mx-auto max-w-3xl text-center">
                  <span className="inline-flex rounded-full bg-[#108280]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#108280]">
                    {t.badge}
                  </span>

                  <h3 className="mt-5 text-3xl font-black uppercase italic text-slate-950">
                    {t.title}
                  </h3>

                  <p className="mt-4 text-base font-medium leading-7 text-slate-500">
                    {t.text}
                  </p>
                </div>

                {/* Banner login — vizibil doar pentru utilizatori neautentificați */}
                {isAuthenticated === false && (
                  <div className="mx-auto mt-8 max-w-3xl rounded-2xl border-2 border-amber-300 bg-amber-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-bold text-amber-800">
                      {t.loginRequired}
                    </p>
                    <Link
                      href={`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/marketplace?smart=1`)}`}
                      className="shrink-0 rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase text-white hover:bg-amber-600 transition-colors"
                    >
                      {t.loginBtn}
                    </Link>
                  </div>
                )}

                <form
                  className="mx-auto mt-10 max-w-3xl space-y-5"
                  onSubmit={handleSourcingSubmit}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={sourcingForm.company}
                      onChange={(e) =>
                        setSourcingForm({ ...sourcingForm, company: e.target.value })
                      }
                      placeholder={t.company}
                      className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                    />

                    <input
                      type="text"
                      required
                      value={sourcingForm.product}
                      onChange={(e) =>
                        setSourcingForm({ ...sourcingForm, product: e.target.value })
                      }
                      placeholder={t.product}
                      className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                    />

                    <input
                      type="text"
                      value={sourcingForm.quantity}
                      onChange={(e) =>
                        setSourcingForm({ ...sourcingForm, quantity: e.target.value })
                      }
                      placeholder={t.quantity}
                      className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <input
                      type="text"
                      value={sourcingForm.deliveryCountry}
                      onChange={(e) =>
                        setSourcingForm({ ...sourcingForm, deliveryCountry: e.target.value })
                      }
                      placeholder={t.country}
                      className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                    />

                    <input
                      type="email"
                      required
                      value={sourcingForm.email}
                      onChange={(e) =>
                        setSourcingForm({ ...sourcingForm, email: e.target.value })
                      }
                      placeholder={t.email}
                      className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                    />
                  </div>

                  <textarea
                    required
                    rows={5}
                    value={sourcingForm.message}
                    onChange={(e) =>
                      setSourcingForm({ ...sourcingForm, message: e.target.value })
                    }
                    placeholder={t.message}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10"
                  />

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isAuthenticated === null}
                      className="rounded-2xl bg-[#108280] px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#0d6b69] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticated === null ? "..." : t.submit}
                    </button>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50"
                    >
                      {t.reset}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col rounded-3xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none overflow-hidden"
                  >
                    <div className="relative h-56 w-full border-b-4 border-slate-900 bg-slate-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center italic text-slate-300 font-bold uppercase tracking-widest">
                          {dict.common?.no_image || "Kein Bild"}
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span className="rounded-lg bg-white border-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {item.country || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#108280]">
                            {item.category || item.type || "Allgemein"}
                          </p>

                          <h3 className="mt-1 text-2xl font-black leading-tight text-slate-900 group-hover:text-[#108280] transition-colors line-clamp-2 uppercase italic">
                            {item.title}
                          </h3>
                        </div>

                        <div className="text-right">{renderItemPrice(item)}</div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">
                        {item.description || dict.marketplace?.no_description}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <InfoCard
                          label={dict.marketplace?.info_supplier || "Anbieter"}
                          value={item.supplier_name || "TrustBridge"}
                        />

                        <InfoCard
                          label={dict.marketplace?.info_min_qty || "MOQ"}
                          value={`${item.min_qty || "1"} ${item.unit || "Unit"}`}
                        />
                      </div>

                      <div className="mt-6 flex items-stretch gap-3">
                        <div className="flex-1 min-h-[56px] flex">
                          <AddToRequestButton
                            item={item}
                            dict={dict}
                            lang={lang}
                          />
                        </div>

                        <Link
                          href={`/${lang}/details?id=${item.id}`}
                          className="flex-1 flex items-center justify-center min-h-[56px] rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-center text-xs font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-slate-50"
                        >
                          {dict.marketplace?.details_btn || "Details"}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 rounded-[3rem] border-4 border-slate-900 bg-slate-950 p-12 text-white shadow-[12px_12px_0px_0px_rgba(16,130,128,1)]">
          <h2 className="text-4xl font-black uppercase italic leading-none">
            {dict.marketplace?.footer_title}
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 font-medium">
            {dict.marketplace?.footer_text}
          </p>

          <Link
            href={`/${lang}/offer-create`}
            className="mt-10 inline-block rounded-2xl bg-white px-10 py-5 font-black uppercase text-slate-950 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:translate-y-1 transition-all"
          >
            {dict.marketplace?.button_guided}
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-slate-100 bg-slate-50/50 p-3">
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-800 truncate leading-tight">
        {value}
      </p>
    </div>
  );
}
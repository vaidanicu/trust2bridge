"use client";

import AddToRequestButton from "../../components/AddToRequestButton";
import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatConvertedPrice } from "@/lib/currency";
import { useRouter } from "next/navigation";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── Categories ───────────────────────────────────────────────────────────────
interface Subcategory { key: string; label: string; }
interface MainCategory { key: string; label: string; subcategories: Subcategory[]; }

const CATEGORIES: Record<string, MainCategory[]> = {
  de: [
    {
      key: "food", label: "Food",
      subcategories: [
        { key: "frischeprodukte",   label: "Frischeprodukte" },
        { key: "trockenwaren",      label: "Trockenwaren" },
        { key: "getraenke",         label: "Getränke" },
        { key: "snacks",            label: "Snacks / Süßigkeiten" },
        { key: "spezialernaehrung", label: "Spezialernährung" },
      ],
    },
    {
      key: "non-food", label: "Non-Food",
      subcategories: [
        { key: "haushalt",   label: "Haushalt" },
        { key: "hygiene",    label: "Hygiene" },
        { key: "reinigung",  label: "Reinigung" },
        { key: "verpackung", label: "Verpackung" },
        { key: "technik",    label: "Technik" },
        { key: "auto",       label: "Auto" },
        { key: "buero",      label: "Büro" },
        { key: "berufe",     label: "Berufe" },
      ],
    },
    {
      key: "dienstleistungen", label: "Dienstleistungen",
      subcategories: [
        { key: "beratung", label: "Beratung" },
        { key: "schulung", label: "Schulung" },
        { key: "logistik", label: "Logistik" },
        { key: "service",  label: "Service" },
      ],
    },
  ],
  hu: [
    {
      key: "food", label: "Élelmiszer",
      subcategories: [
        { key: "frischeprodukte",   label: "Friss termékek" },
        { key: "trockenwaren",      label: "Szárazáruk" },
        { key: "getraenke",         label: "Italok" },
        { key: "snacks",            label: "Snackek / Édességek" },
        { key: "spezialernaehrung", label: "Speciális táplálkozás" },
      ],
    },
    {
      key: "non-food", label: "Non-Food",
      subcategories: [
        { key: "haushalt",   label: "Háztartás" },
        { key: "hygiene",    label: "Higiénia" },
        { key: "reinigung",  label: "Tisztítás" },
        { key: "verpackung", label: "Csomagolás" },
        { key: "technik",    label: "Technika" },
        { key: "auto",       label: "Autó" },
        { key: "buero",      label: "Iroda" },
        { key: "berufe",     label: "Szakmák" },
      ],
    },
    {
      key: "dienstleistungen", label: "Szolgáltatások",
      subcategories: [
        { key: "beratung", label: "Tanácsadás" },
        { key: "schulung", label: "Oktatás" },
        { key: "logistik", label: "Logisztika" },
        { key: "service",  label: "Szerviz" },
      ],
    },
  ],
  ro: [
    {
      key: "food", label: "Food",
      subcategories: [
        { key: "frischeprodukte",   label: "Produse proaspete" },
        { key: "trockenwaren",      label: "Produse uscate" },
        { key: "getraenke",         label: "Băuturi" },
        { key: "snacks",            label: "Gustări / Dulciuri" },
        { key: "spezialernaehrung", label: "Alimentație specială" },
      ],
    },
    {
      key: "non-food", label: "Non-Food",
      subcategories: [
        { key: "haushalt",   label: "Gospodărie" },
        { key: "hygiene",    label: "Igienă" },
        { key: "reinigung",  label: "Curățenie" },
        { key: "verpackung", label: "Ambalaje" },
        { key: "technik",    label: "Tehnică" },
        { key: "auto",       label: "Auto" },
        { key: "buero",      label: "Birou" },
        { key: "berufe",     label: "Profesii" },
      ],
    },
    {
      key: "dienstleistungen", label: "Servicii",
      subcategories: [
        { key: "beratung", label: "Consultanță" },
        { key: "schulung", label: "Instruire" },
        { key: "logistik", label: "Logistică" },
        { key: "service",  label: "Service" },
      ],
    },
  ],
};

// ─── Category config ──────────────────────────────────────────────────────────
const CAT_CONFIG: Record<string, { icon: string; iconBg: string; iconColor: string; activeBg: string; activeText: string; dotActive: string }> = {
  food: {
    icon: "🥗",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
    dotActive: "bg-emerald-500",
  },
  "non-food": {
    icon: "📦",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    activeBg: "bg-slate-50",
    activeText: "text-slate-700",
    dotActive: "bg-slate-500",
  },
  dienstleistungen: {
    icon: "💼",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    dotActive: "bg-blue-500",
  },
};

// ─── Synonym map ──────────────────────────────────────────────────────────────
const synonymMap: Record<string, string[]> = {
  feuerschlauch:     ["feuerwehrschlauch", "schlauch", "hose", "c52"],
  feuerwehrschlauch: ["feuerschlauch", "schlauch", "hose", "c52"],
  schlauch:          ["feuerschlauch", "feuerwehrschlauch", "hose"],
  kabel:             ["leitung", "draht", "wire", "cable"],
  leitung:           ["kabel", "draht", "wire", "cable"],
  fleisch:           ["meat", "rindfleisch", "schweinefleisch", "geflugel", "hackfleisch"],
  rindfleisch:       ["fleisch", "beef", "rind", "meat"],
  schweinefleisch:   ["fleisch", "pork", "schwein", "meat"],
  huhn:              ["geflugel", "chicken", "hahnchen", "poulet"],
  hahnchen:          ["huhn", "geflugel", "chicken"],
  geflugel:          ["huhn", "hahnchen", "chicken", "poulet"],
  ol:                ["oil", "speiseol", "olivenol", "rapsol"],
  speiseol:          ["ol", "oil", "olivenol", "rapsol"],
  olivenol:          ["ol", "oil", "speiseol"],
  mehl:              ["flour", "weizen", "roggen"],
  brot:              ["bread", "backware", "brotchen"],
  reinigung:         ["cleaning", "reinigungsmittel", "putzmittel", "hygiene"],
  reinigungsmittel:  ["reinigung", "putzmittel", "cleaning"],
  verpackung:        ["packaging", "karton", "folie"],
  karton:            ["verpackung", "box", "schachtel"],
  werkzeug:          ["tool", "tools", "equipment", "gerat"],
  transport:         ["logistik", "logistics", "spedition", "lieferung"],
  logistik:          ["transport", "logistics", "spedition"],
  elektronik:        ["electronic", "electronics", "elektro"],
  sicherheit:        ["safety", "security", "schutz"],
  wasser:            ["water", "mineralwasser", "trinkwasser"],
  hygiene:           ["reinigung", "sanitar", "desinfektion"],
  frischeprodukte:   ["frisch", "fresh", "friss", "proaspat"],
  trockenwaren:      ["trocken", "dry", "szaraz", "uscat"],
  getraenke:         ["drink", "drinks", "ital", "bauturi"],
  snacks:            ["sussigkeiten", "snack", "edes", "dulciuri", "gustari"],
  haushalt:          ["household", "haztartas", "gospodarie"],
  buero:             ["office", "iroda", "birou"],
  berufe:            ["profession", "szakma", "profesii", "beruf"],
  beratung:          ["consulting", "tanacs", "consultanta"],
  schulung:          ["training", "oktatas", "instruire", "kurs"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalizeText = (value: any) =>
  String(value || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeCountry = (value: any) => {
  const v = normalizeText(value);
  if (["romania", "rumanien", "ro"].some((x) => v.includes(x))) return "romania";
  if (["ungarn", "hungary", "magyarorszag", "hu"].some((x) => v.includes(x))) return "ungarn";
  if (["deutschland", "germany", "de"].includes(v)) return "deutschland";
  if (["osterreich", "austria", "at"].some((x) => v.includes(x))) return "osterreich";
  if (["schweiz", "switzerland", "ch"].includes(v)) return "schweiz";
  return v;
};

const expandQuery = (q: string): string[] => {
  const base = normalizeText(q);
  if (!base) return [];
  return [base, ...(synonymMap[base] || []).map(normalizeText)];
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MarketplacePage({ dict, lang }: { dict: any; lang: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const formRef = useRef<HTMLDivElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [country, setCountry] = useState("");
  const [openCatKey, setOpenCatKey] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [sourcingForm, setSourcingForm] = useState({
    company: "", product: "", quantity: "", deliveryCountry: "", email: "", message: "",
  });

  const countries = ["Österreich", "Ungarn", "Schweiz", "Deutschland", "Rumänien"];
  const categories = CATEGORIES[lang] || CATEGORIES.de;

  const t = lang === "ro" ? {
    badge: "Sourcing inteligent",
    title: "Nu s-a găsit nicio ofertă potrivită",
    text: "Nu ați găsit ce căutați? Trimiteți-ne cererea, iar TrustBridge vă ajută să găsiți furnizori potriviți.",
    company: "Firma / Compania", product: "Produs / Serviciu", quantity: "Cantitate / Unitate",
    country: "Țara de livrare", email: "E-mailul dvs.", message: "Descrieți ce căutați...",
    submit: "Trimite cererea", reset: "Resetează filtrele",
    success: "Cererea dvs. a fost trimisă cu succes către TrustBridge.",
    error: "Eroare la trimitere. Vă rugăm să încercați din nou.",
    loginRequired: "Trebuie să fiți autentificat pentru a trimite o cerere.",
    loginBtn: "Autentifică-te", search_hint: "Sugestii",
    cat_label: "Categorii", all_label: "Toate",
  } : lang === "hu" ? {
    badge: "Okos beszerzés",
    title: "Nem található megfelelő ajánlat",
    text: "Nem találta meg, amit keres? Küldje el nekünk az igényét, és a TrustBridge segít megfelelő beszállítókat találni.",
    company: "Cég / Vállalat", product: "Termék / Szolgáltatás", quantity: "Mennyiség / Egység",
    country: "Szállítási ország", email: "Az Ön e-mail címe", message: "Írja le, mit keres...",
    submit: "Ajánlatkérés küldése", reset: "Szűrők törlése",
    success: "Kérése sikeresen elküldésre került a TrustBridge részére.",
    error: "Hiba történt a küldés során. Kérjük, próbálja újra.",
    loginRequired: "A kérés elküldéséhez be kell jelentkeznie.",
    loginBtn: "Bejelentkezés", search_hint: "Javaslatok",
    cat_label: "Kategóriák", all_label: "Összes",
  } : {
    badge: "Smart Sourcing",
    title: "Kein passendes Angebot gefunden",
    text: "Sie haben nicht gefunden, was Sie suchen? Senden Sie uns Ihre Anfrage und TrustBridge hilft Ihnen passende Lieferanten zu finden.",
    company: "Firma / Unternehmen", product: "Produkt / Dienstleistung", quantity: "Menge / Einheit",
    country: "Zielland / Lieferland", email: "Ihre E-Mail", message: "Beschreiben Sie bitte, was Sie suchen...",
    submit: "Anfrage senden", reset: "Filter zurücksetzen",
    success: "Ihre Anfrage wurde erfolgreich an TrustBridge gesendet.",
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut.",
    loginRequired: "Sie müssen angemeldet sein, um eine Anfrage zu senden.",
    loginBtn: "Anmelden", search_hint: "Vorschläge",
    cat_label: "Kategorien", all_label: "Alle",
  };

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    const userRaw = localStorage.getItem("trustbridge_user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setIsAuthenticated(true);
        if (user?.email) setSourcingForm((p) => ({ ...p, email: user.email }));
      } catch { setIsAuthenticated(false); }
    } else { setIsAuthenticated(false); }
  }, []);

  // ── Sync URL params ─────────────────────────────────────────────────────────
  useEffect(() => {
    const urlCat     = searchParams.get("category");
    const urlSub     = searchParams.get("sub");
    const urlCountry = searchParams.get("country");
    const urlQuery   = searchParams.get("q");
    if (urlCat)     { setCategory(urlCat); setOpenCatKey(urlCat); }
    if (urlSub)     setSubcategory(urlSub);
    if (urlCountry) setCountry(urlCountry);
    if (urlQuery)   setQuery(urlQuery);
  }, [searchParams]);

  // ── Scroll smart ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("smart") === "1")
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  }, [searchParams]);

  // ── Load items ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(`${API}/items?lang=${lang}`, { cache: "no-store" });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) { console.error("Marketplace error:", e); }
      finally { setLoading(false); }
    }
    loadItems();
  }, [lang]);

  // ── Close autocomplete on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Autocomplete suggestions ────────────────────────────────────────────────
  const suggestions = useMemo(() => {
    const q = normalizeText(query);
    if (!q || q.length < 2) return [];
    const seen = new Set<string>();
    const results: { id: string; title: string; category: string }[] = [];
    for (const item of items) {
      const itemText = normalizeText(`${item.title || ""} ${item.description || ""} ${item.category || ""} ${item.type || ""}`);
      if (expandQuery(query).some((t) => itemText.includes(t)) && item.title && !seen.has(item.title)) {
        seen.add(item.title);
        results.push({ id: item.id, title: item.title, category: item.category || item.type || "" });
      }
      if (results.length >= 6) break;
    }
    return results;
  }, [query, items]);

  // ── Filtered items ──────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemText = normalizeText(
        `${item.title || ""} ${item.description || ""} ${item.category || ""} ${item.type || ""} ${item.country || ""} ${item.subcategory || ""}`
      );
      const selCat      = normalizeText(category);
      const selSub      = normalizeText(subcategory);
      const selCountry  = normalizeCountry(country);
      const itemCat     = normalizeText(item.category);
      const itemType    = normalizeText(item.type);
      const itemSub     = normalizeText(item.subcategory || "");
      const itemCountry = normalizeCountry(item.country);

      const queryTerms = expandQuery(query);
      const matchesQuery = !query || queryTerms.some((term) => itemText.includes(term));

      const matchesCategory =
        !selCat ||
        itemCat.includes(selCat) ||
        itemType.includes(selCat) ||
        selCat.includes(itemCat) ||
        selCat.includes(itemType) ||
        (selCat.includes("dienstleistung") && (itemCat.includes("dienstleistung") || itemType.includes("service")));

      const subTerms = selSub ? expandQuery(subcategory) : [];
      const matchesSub = !selSub || itemSub === selSub || subTerms.some((t) => itemText.includes(t));

      const matchesCountry = !selCountry || itemCountry === selCountry;

      return matchesQuery && matchesCategory && matchesSub && matchesCountry;
    });
  }, [items, query, category, subcategory, country]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const resetFilters = () => {
    setQuery(""); setCategory(""); setSubcategory(""); setCountry(""); setOpenCatKey(null);
  };

  const selectCategory = (key: string) => {
    if (category === key && openCatKey === key) {
      setCategory(""); setSubcategory(""); setOpenCatKey(null);
    } else {
      setCategory(key); setSubcategory(""); setOpenCatKey(key);
    }
  };

  const selectSubcategory = (catKey: string, subKey: string) => {
    setCategory(catKey);
    setSubcategory(subcategory === subKey ? "" : subKey);
  };

  const renderItemPrice = (item: any) => {
    const convertedPrice = formatConvertedPrice(item.price || item.tb_price, lang);
    if (convertedPrice) return <span className="text-xl font-black italic text-red-600 tracking-tighter">{convertedPrice}</span>;
    return <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase text-orange-700 border border-orange-200">{dict.common?.price_on_request || "Preis auf Anfrage"}</span>;
  };

  const handleSourcingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push(`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/marketplace?smart=1`)}`); return; }
    const token = localStorage.getItem("trustbridge_token");
    try {
      const res = await fetch(`${API}/custom-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...sourcingForm, country: sourcingForm.deliveryCountry, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
      alert(t.success);
      const userEmail = (() => { try { return JSON.parse(localStorage.getItem("trustbridge_user") || "")?.email ?? ""; } catch { return ""; } })();
      setSourcingForm({ company: "", product: "", quantity: "", deliveryCountry: "", email: userEmail, message: "" });
    } catch (e) { console.error(e); alert(t.error); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-12">

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white border-b-4 border-slate-900 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">{dict.marketplace?.badge || "TrustBridge B2B"}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl italic uppercase">{dict.marketplace?.hero_title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85 font-medium">{dict.marketplace?.hero_subtitle}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={`/${lang}/offer-create`} className="rounded-xl bg-white px-8 py-4 text-center font-black uppercase text-[#0b5f5d] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all active:shadow-none">{dict.marketplace?.button_guided}</Link>
            <Link href={`/${lang}/request-basket`} className="rounded-xl border-2 border-white px-8 py-4 text-center font-black uppercase text-white hover:bg-white/10 transition-all">{dict.marketplace?.button_basket}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Search bar */}
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase italic">{dict.marketplace?.search_title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_auto]">

            {/* Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={dict.marketplace?.search_placeholder}
                className="w-full rounded-xl border-2 border-slate-900 p-4 font-bold outline-none focus:ring-4 ring-[#108280]/10"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="border-b px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.search_hint}</p>
                  {suggestions.map((s) => (
                    <button key={s.id} type="button"
                      onMouseDown={() => { setQuery(s.title); setShowSuggestions(false); }}
                      className="flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-cyan-50 transition-colors last:border-b-0">
                      <span className="font-bold text-sm text-slate-800">{s.title}</span>
                      {s.category && <span className="ml-2 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-500">{s.category}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border-2 border-slate-900 p-4 font-bold outline-none bg-white cursor-pointer">
              <option value="">{dict.marketplace?.all_countries}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {(query || category || subcategory || country) && (
              <button onClick={resetFilters}
                className="rounded-xl border-2 border-slate-900 bg-white px-5 py-4 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 whitespace-nowrap">
                ✕ {t.reset}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* ── Sidebar ── */}
          <aside className="h-fit space-y-5">

            {/* ── Categories accordion ── */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t.cat_label}</span>
              </div>

              {categories.map((cat) => {
                const isOpen      = openCatKey === cat.key;
                const isCatActive = category === cat.key;
                const cfg         = CAT_CONFIG[cat.key] || CAT_CONFIG["non-food"];

                return (
                  <div key={cat.key} className="border-b border-slate-100 last:border-b-0">

                    {/* ── Main category row ── */}
                    <button
                      type="button"
                      onClick={() => selectCategory(cat.key)}
                      className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 ${
                        isCatActive ? cfg.activeBg : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Icon pill */}
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-transform duration-150 group-hover:scale-105 ${cfg.iconBg} ${cfg.iconColor}`}>
                        {cfg.icon}
                      </span>

                      {/* Label */}
                      <span className={`flex-1 text-[13px] font-semibold leading-tight ${isCatActive ? cfg.activeText : "text-slate-700"}`}>
                        {cat.label}
                      </span>

                      {/* Count badge */}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                        isCatActive ? `${cfg.iconBg} ${cfg.iconColor}` : "bg-slate-100 text-slate-400"
                      }`}>
                        {cat.subcategories.length}
                      </span>

                      {/* Chevron */}
                      <svg
                        className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* ── Subcategories panel ── */}
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-white">
                        {/* Thin left accent bar */}
                        <div className={`ml-4 border-l-2 ${
                          cfg.dotActive === "bg-emerald-500" ? "border-emerald-200" :
                          cfg.dotActive === "bg-blue-500"    ? "border-blue-200"    : "border-slate-200"
                        }`}>
                          {/* "All" row */}
                          <button
                            type="button"
                            onClick={() => { setCategory(cat.key); setSubcategory(""); }}
                            className={`flex w-full items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs transition-colors hover:bg-slate-50 ${
                              isCatActive && !subcategory ? `font-semibold ${cfg.activeText}` : "text-slate-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${
                              isCatActive && !subcategory ? cfg.dotActive : "bg-slate-300"
                            }`} />
                            {t.all_label}
                          </button>

                          {/* Subcategory rows */}
                          {cat.subcategories.map((sub) => {
                            const isSubActive = subcategory === sub.key && category === cat.key;
                            return (
                              <button
                                key={sub.key}
                                type="button"
                                onClick={() => selectSubcategory(cat.key, sub.key)}
                                className={`flex w-full items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs transition-colors hover:bg-slate-50 ${
                                  isSubActive ? `font-semibold ${cfg.activeText}` : "text-slate-600"
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${
                                  isSubActive ? cfg.dotActive : "bg-slate-200"
                                }`} />
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Country filter ── */}
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase italic">{dict.marketplace?.filter_title}</h3>
              <div className="mt-6">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">{dict.marketplace?.filter_where}</p>
                <div className="space-y-2 text-sm">
                  {countries.map((c) => {
                    const active = country.toLowerCase() === c.toLowerCase();
                    return (
                      <button key={c} type="button" onClick={() => setCountry(active ? "" : c)}
                        className={`block w-full rounded-xl border-2 px-4 py-3 text-left font-bold transition-all ${
                          active ? "border-[#108280] bg-[#108280]/10 text-[#108280]" : "border-slate-100 hover:border-slate-300"
                        }`}>
                        {active ? "●" : "○"} {c}
                      </button>
                    );
                  })}
                  <button onClick={() => setCountry("")} className="block w-full rounded-xl border-2 border-slate-100 px-4 py-3 text-left font-bold hover:border-slate-300">
                    {!country ? "●" : "○"} {dict.marketplace?.all_countries}
                  </button>
                </div>
              </div>
              <div className="mt-8 rounded-2xl bg-[#108280]/10 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-[#108280]">TrustBridge Vorteil</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Wir unterstützen Sie bei Lieferantensuche, Angebotsvergleich und sicherer B2B-Abwicklung.</p>
              </div>
            </div>

            {/* ── Guided request ── */}
            <div className="rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase text-white/50 tracking-widest">Hilfe benötigt?</p>
              <h4 className="mt-2 font-black italic uppercase leading-tight">Nicht sicher, was Sie brauchen?</h4>
              <Link href={`/${lang}/marketplace/?smart=1`} className="mt-4 block rounded-lg bg-[#108280] p-3 text-center text-xs font-black uppercase hover:bg-[#0d6b69] transition-colors">
                Guided Request →
              </Link>
            </div>
          </aside>

          {/* ── Results ── */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#108280]">{dict.marketplace?.results_label}</p>
                <h2 className="text-3xl font-black uppercase italic">
                  {loading ? "..." : `${filteredItems.length} ${dict.marketplace?.results_found || "gefunden"}`}
                </h2>
                {(category || subcategory) && (
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {categories.find((c) => c.key === category)?.label}
                    {subcategory && ` › ${categories.find((c) => c.key === category)?.subcategories.find((s) => s.key === subcategory)?.label}`}
                  </p>
                )}
              </div>
              {(query || category || subcategory || country) && (
                <button onClick={resetFilters} className="hidden md:inline-flex rounded-xl border-2 border-slate-900 bg-white px-5 py-3 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50">
                  Filter zurücksetzen
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-96 rounded-3xl border-2 border-slate-200 bg-white animate-pulse" />)}
              </div>
            ) : filteredItems.length === 0 || searchParams.get("smart") === "1" ? (
              <div ref={formRef} className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
                <div className="mx-auto max-w-3xl text-center">
                  <span className="inline-flex rounded-full bg-[#108280]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#108280]">{t.badge}</span>
                  <h3 className="mt-5 text-3xl font-black uppercase italic text-slate-950">{t.title}</h3>
                  <p className="mt-4 text-base font-medium leading-7 text-slate-500">{t.text}</p>
                </div>

                {isAuthenticated === false && (
                  <div className="mx-auto mt-8 max-w-3xl rounded-2xl border-2 border-amber-300 bg-amber-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-bold text-amber-800">{t.loginRequired}</p>
                    <Link href={`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/marketplace?smart=1`)}`}
                      className="shrink-0 rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase text-white hover:bg-amber-600 transition-colors">{t.loginBtn}</Link>
                  </div>
                )}

                <form className="mx-auto mt-10 max-w-3xl space-y-5" onSubmit={handleSourcingSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <input type="text" required value={sourcingForm.company} onChange={(e) => setSourcingForm({ ...sourcingForm, company: e.target.value })} placeholder={t.company} className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                    <input type="text" required value={sourcingForm.product} onChange={(e) => setSourcingForm({ ...sourcingForm, product: e.target.value })} placeholder={t.product} className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                    <input type="text" value={sourcingForm.quantity} onChange={(e) => setSourcingForm({ ...sourcingForm, quantity: e.target.value })} placeholder={t.quantity} className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <input type="text" value={sourcingForm.deliveryCountry} onChange={(e) => setSourcingForm({ ...sourcingForm, deliveryCountry: e.target.value })} placeholder={t.country} className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                    <input type="email" required value={sourcingForm.email} onChange={(e) => setSourcingForm({ ...sourcingForm, email: e.target.value })} placeholder={t.email} className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                  </div>
                  <textarea required rows={5} value={sourcingForm.message} onChange={(e) => setSourcingForm({ ...sourcingForm, message: e.target.value })} placeholder={t.message} className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 text-sm font-bold outline-none transition focus:border-[#108280] focus:bg-white focus:ring-4 focus:ring-[#108280]/10" />
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <button type="submit" disabled={isAuthenticated === null} className="rounded-2xl bg-[#108280] px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#0d6b69] disabled:opacity-50 disabled:cursor-not-allowed">
                      {isAuthenticated === null ? "..." : t.submit}
                    </button>
                    <button type="button" onClick={resetFilters} className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50">
                      {t.reset}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {filteredItems.map((item) => (
                  <article key={item.id} className="group flex flex-col rounded-2xl border-2 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none overflow-hidden">
                    <div className="relative h-40 w-full border-b-2 border-slate-900 bg-slate-50">
                      {item.image
                        ? <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        : <div className="flex h-full items-center justify-center italic text-slate-300 font-bold uppercase tracking-widest">{dict.common?.no_image || "Kein Bild"}</div>
                      }
                      <div className="absolute top-4 left-4">
                        <span className="rounded-lg bg-white border-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{item.country || "-"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#108280]">
                            {item.category || item.type || "Allgemein"}
                            {item.subcategory && <span className="ml-1 text-slate-400">/ {item.subcategory}</span>}
                          </p>
                          <h3 className="mt-1 text-lg font-black leading-tight text-slate-900 group-hover:text-[#108280] transition-colors line-clamp-2 uppercase italic">{item.title}</h3>
                        </div>
                        <div className="text-right">{renderItemPrice(item)}</div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">{item.description || dict.marketplace?.no_description}</p>

                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <InfoCard label={dict.marketplace?.info_supplier || "Anbieter"} value={item.supplier_name || "TrustBridge"} />
                        <InfoCard label={dict.marketplace?.info_min_qty || "MOQ"} value={`${item.min_qty || "1"} ${item.unit || "Unit"}`} />
                      </div>

                      <div className="mt-5 grid gap-3">
                        <div className="w-full"><AddToRequestButton item={item} dict={dict} lang={lang} /></div>
                        <Link href={`/${lang}/details?id=${item.id}`}
                          className="flex h-[52px] items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-3 text-center text-xs font-black uppercase transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-slate-50">
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
          <h2 className="text-4xl font-black uppercase italic leading-none">{dict.marketplace?.footer_title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 font-medium">{dict.marketplace?.footer_text}</p>
          <Link href={`/${lang}/offer-create`} className="mt-10 inline-block rounded-2xl bg-white px-10 py-5 font-black uppercase text-slate-950 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:translate-y-1 transition-all">
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
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">{label}</p>
      <p className="mt-1 font-bold text-slate-800 truncate leading-tight">{value}</p>
    </div>
  );
}
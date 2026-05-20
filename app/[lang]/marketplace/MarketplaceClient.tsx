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
const CAT_CONFIG: Record<string, {
  icon: string;
  accent: string;
  accentLight: string;
  accentText: string;
  dotColor: string;
}> = {
  food: {
    icon: "🥗",
    accent: "border-emerald-600",
    accentLight: "bg-emerald-50 text-emerald-700",
    accentText: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  "non-food": {
    icon: "📦",
    accent: "border-slate-400",
    accentLight: "bg-slate-100 text-slate-600",
    accentText: "text-slate-600",
    dotColor: "bg-slate-400",
  },
  dienstleistungen: {
    icon: "💼",
    accent: "border-teal-600",
    accentLight: "bg-teal-50 text-teal-700",
    accentText: "text-teal-700",
    dotColor: "bg-teal-500",
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
    stat_offers: "Oferte active", stat_suppliers: "Furnizori verificați", stat_countries: "Țări", stat_categories: "Categorii",
    advantage_title: "Avantajul TrustBridge", advantage_text: "Vă sprijinim în căutarea furnizorilor, compararea ofertelor și procesarea sigură B2B.",
    guided_help: "Aveți nevoie de ajutor?", guided_question: "Nu știți exact ce căutați?",
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
    stat_offers: "Aktív ajánlatok", stat_suppliers: "Hitelesített szállítók", stat_countries: "Országok", stat_categories: "Kategóriák",
    advantage_title: "TrustBridge előnye", advantage_text: "Segítünk a szállítókeresésben, az ajánlatok összehasonlításában és a biztonságos B2B lebonyolításban.",
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
    stat_offers: "Aktive Angebote", stat_suppliers: "Verifizierte Anbieter", stat_countries: "Länder", stat_categories: "Kategorien",
    advantage_label: "TrustBridge Vorteil",
    advantage_text: "Wir unterstützen Sie bei Lieferantensuche, Angebotsvergleich und sicherer B2B-Abwicklung.",
    guided_request: "Guided Request →",
    filter_country: "Lieferland",
    all_countries: "Alle Länder",
    no_image: "Kein Bild",
    price_label: "Preis",
    price_on_request: "Auf Anfrage",
    supplier_label: "Anbieter",
    results_label: "Ergebnisse",
    results_found: "Angebote",
    reset_filters: "Filter zurücksetzen",
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
    if (convertedPrice) {
      return (
        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-400 block leading-none mb-0.5">{t.price_label}</span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">{convertedPrice}</span>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
        {t.price_on_request}
      </span>
    );
  };

  const handleSourcingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/marketplace?smart=1`)}`);
      return;
    }
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
    <main className="min-h-screen bg-[#F7F8FA] text-slate-900">

      {/* ── Hero ── */}
      <section className="bg-[#0B3D3C] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                {dict.marketplace?.badge || "TrustBridge B2B"}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-[56px]">
                {dict.marketplace?.hero_title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
                {dict.marketplace?.hero_subtitle}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href={`/${lang}/offer-create`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-7 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
              >
                {dict.marketplace?.button_guided}
              </Link>
              <Link
                href={`/${lang}/request-basket`}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                {dict.marketplace?.button_basket}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* ── Search bar ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">

            {/* Autocomplete */}
            <div className="relative flex-1" ref={autocompleteRef}>
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={dict.marketplace?.search_placeholder || "Produkt, Kategorie oder Stichwort ..."}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <p className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {t.search_hint}
                  </p>
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={() => { setQuery(s.title); setShowSuggestions(false); }}
                      className="flex w-full items-center justify-between border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-slate-800">{s.title}</span>
                      {s.category && (
                        <span className="ml-3 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {s.category}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country select */}
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50 py-0 pl-4 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10 md:w-48"
              >
                <option value="">{t.all_countries}</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {(query || category || subcategory || country) && (
              <button
                onClick={resetFilters}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t.reset}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* ── Sidebar ── */}
          <aside className="h-fit space-y-4">

            {/* Categories */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{t.cat_label}</h3>
              </div>

              {categories.map((cat) => {
                const isOpen      = openCatKey === cat.key;
                const isCatActive = category === cat.key;
                const cfg         = CAT_CONFIG[cat.key] || CAT_CONFIG["non-food"];

                return (
                  <div key={cat.key} className="border-b border-slate-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => selectCategory(cat.key)}
                      className={`group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                        isCatActive ? "bg-slate-50" : "hover:bg-slate-50/60"
                      }`}
                    >
                      <span className="text-lg leading-none">{cfg.icon}</span>
                      <span className={`flex-1 text-[13px] font-semibold leading-tight ${isCatActive ? "text-slate-900" : "text-slate-600"}`}>
                        {cat.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isCatActive ? cfg.accentLight : "bg-slate-100 text-slate-400"}`}>
                        {cat.subcategories.length}
                      </span>
                      <svg
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="bg-slate-50/50 pb-1">
                        <button
                          type="button"
                          onClick={() => { setCategory(cat.key); setSubcategory(""); }}
                          className={`flex w-full items-center gap-2.5 px-5 py-2.5 text-[12px] transition-colors hover:text-slate-900 ${
                            isCatActive && !subcategory ? `font-semibold ${cfg.accentText}` : "text-slate-400"
                          }`}
                        >
                          <span className={`h-1 w-1 rounded-full flex-shrink-0 ${isCatActive && !subcategory ? cfg.dotColor : "bg-slate-300"}`} />
                          {t.all_label}
                        </button>
                        {cat.subcategories.map((sub) => {
                          const isSubActive = subcategory === sub.key && category === cat.key;
                          return (
                            <button
                              key={sub.key}
                              type="button"
                              onClick={() => selectSubcategory(cat.key, sub.key)}
                              className={`flex w-full items-center gap-2.5 px-5 py-2.5 text-[12px] transition-colors hover:text-slate-900 ${
                                isSubActive ? `font-semibold ${cfg.accentText}` : "text-slate-500"
                              }`}
                            >
                              <span className={`h-1 w-1 rounded-full flex-shrink-0 ${isSubActive ? cfg.dotColor : "bg-slate-200"}`} />
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Country filter */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {t.filter_country}
                </h3>
              </div>
              <div className="p-3">
                {[...countries, ""].map((c) => {
                  const label = c || t.all_countries;
                  const active = country === c;
                  return (
                    <button
                      key={c || "__all"}
                      type="button"
                      onClick={() => setCountry(active ? "" : c)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "bg-teal-50 font-semibold text-teal-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${active ? "bg-teal-500" : "bg-slate-200"}`} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advantage card */}
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">{t.advantage_label}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.advantage_text}</p>
              <Link
                href={`/${lang}/marketplace/?smart=1`}
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-teal-700 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-teal-600"
              >
                {t.guided_request}
              </Link>
            </div>
          </aside>

          {/* ── Results ── */}
          <section>

            {/* Results header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-teal-600">
                  {t.results_label}
                </p>
                <h2 className="mt-0.5 text-2xl font-bold text-slate-900">
                  {loading ? "—" : `${filteredItems.length} ${t.results_found}`}
                </h2>
                {(category || subcategory) && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {categories.find((c) => c.key === category)?.label}
                    {subcategory && ` › ${categories.find((c) => c.key === category)?.subcategories.find((s) => s.key === subcategory)?.label}`}
                  </p>
                )}
              </div>
              {(query || category || subcategory || country) && (
                <button
                  onClick={resetFilters}
                  className="hidden md:inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl border border-slate-100 bg-white" />
                ))}
              </div>
            ) : filteredItems.length === 0 || searchParams.get("smart") === "1" ? (

              /* ── Smart Sourcing Form ── */
              <div ref={formRef} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                <div className="mx-auto max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-teal-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    {t.badge}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{t.text}</p>
                </div>

                {isAuthenticated === false && (
                  <div className="mx-auto mt-7 max-w-2xl flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-amber-800">{t.loginRequired}</p>
                    <Link
                      href={`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/marketplace?smart=1`)}`}
                      className="shrink-0 rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                      {t.loginBtn}
                    </Link>
                  </div>
                )}

                <form className="mx-auto mt-8 max-w-2xl space-y-4" onSubmit={handleSourcingSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      type="text" required
                      value={sourcingForm.company}
                      placeholder={t.company}
                      onChange={(v) => setSourcingForm({ ...sourcingForm, company: v })}
                    />
                    <FormInput
                      type="text" required
                      value={sourcingForm.product}
                      placeholder={t.product}
                      onChange={(v) => setSourcingForm({ ...sourcingForm, product: v })}
                    />
                    <FormInput
                      type="text"
                      value={sourcingForm.quantity}
                      placeholder={t.quantity}
                      onChange={(v) => setSourcingForm({ ...sourcingForm, quantity: v })}
                    />
                    <FormInput
                      type="text"
                      value={sourcingForm.deliveryCountry}
                      placeholder={t.country}
                      onChange={(v) => setSourcingForm({ ...sourcingForm, deliveryCountry: v })}
                    />
                    <FormInput
                      type="email" required
                      value={sourcingForm.email}
                      placeholder={t.email}
                      onChange={(v) => setSourcingForm({ ...sourcingForm, email: v })}
                      className="sm:col-span-2"
                    />
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={sourcingForm.message}
                    onChange={(e) => setSourcingForm({ ...sourcingForm, message: e.target.value })}
                    placeholder={t.message}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10"
                  />
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isAuthenticated === null}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-7 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticated === null ? "..." : t.submit}
                    </button>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      {t.reset}
                    </button>
                  </div>
                </form>
              </div>

            ) : (

              /* ── Product grid ── */
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {item.country && (
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur-sm">
                            {item.country}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">
                              {item.category || item.type || "Allgemein"}
                            </span>
                            {item.subcategory && (
                              <>
                                <span className="text-slate-300 text-[10px]">/</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                                  {item.subcategory}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900 line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                        <div className="shrink-0">{renderItemPrice(item)}</div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
                        {item.description || dict.marketplace?.no_description}
                      </p>

                      {/* Meta row */}
                      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-slate-700">{item.supplier_name || "TrustBridge"}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>MOQ: <span className="font-medium text-slate-700">{item.min_qty || "1"} {item.unit || "Unit"}</span></span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <AddToRequestButton item={item} dict={dict} lang={lang} />
                        <Link
                          href={`/${lang}/details?id=${item.id}`}
                          className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
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

        {/* ── Footer CTA ── */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-[#0B3D3C]">
          <div className="px-10 py-14 md:px-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
              TrustBridge
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
              {dict.marketplace?.footer_title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
              {dict.marketplace?.footer_text}
            </p>
            <Link
              href={`/${lang}/offer-create`}
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              {dict.marketplace?.button_guided}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormInput({
  type = "text",
  value,
  placeholder,
  onChange,
  required,
  className = "",
}: {
  type?: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10 ${className}`}
    />
  );
}
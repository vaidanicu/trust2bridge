"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CategorySidebar from "./CategorySidebar";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

const normalizeText = (v: any) =>
  String(v || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const synonymMap: Record<string, string[]> = {
  feuerschlauch:     ["feuerwehrschlauch", "schlauch", "hose", "c52"],
  feuerwehrschlauch: ["feuerschlauch", "schlauch", "hose", "c52"],
  fleisch:           ["meat", "rindfleisch", "schweinefleisch", "geflugel"],
  reinigung:         ["cleaning", "reinigungsmittel", "putzmittel"],
  verpackung:        ["packaging", "karton", "folie"],
  logistik:          ["transport", "logistics", "spedition"],
  getraenke:         ["drink", "drinks", "ital", "bauturi"],
  snacks:            ["sussigkeiten", "snack", "dulciuri", "gustari"],
};

const expandQuery = (q: string) => {
  const base = normalizeText(q);
  if (!base) return [];
  return [base, ...(synonymMap[base] || []).map(normalizeText)];
};

interface Props {
  lang: string;
  searchPlaceholder: string;
  searchButton: string;
  categoriesLabel: string;
  suggestionsLabel: string;
}

export default function HomeSidebar({
  lang,
  searchPlaceholder,
  searchButton,
  categoriesLabel,
  suggestionsLabel,
}: Props) {
  const router          = useRouter();
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const [query,   setQuery]   = useState("");
  const [showSug, setShowSug] = useState(false);
  const [items,   setItems]   = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/items?lang=${lang}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node))
        setShowSug(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const suggestions = (() => {
    if (normalizeText(query).length < 2) return [];
    const seen = new Set<string>();
    const out: { id: string; title: string; category: string }[] = [];
    for (const item of items) {
      const txt = normalizeText(`${item.title || ""} ${item.description || ""} ${item.category || ""}`);
      if (expandQuery(query).some((t) => txt.includes(t)) && item.title && !seen.has(item.title)) {
        seen.add(item.title);
        out.push({ id: item.id, title: item.title, category: item.category || item.type || "" });
      }
      if (out.length >= 6) break;
    }
    return out;
  })();

  const goSearch = (q: string) => {
    router.push(
      q.trim()
        ? `/${lang}/marketplace?q=${encodeURIComponent(q.trim())}`
        : `/${lang}/marketplace`
    );
  };

  return (
    <div className="space-y-4">
      {/* Search cu autocomplete */}
      <div ref={autocompleteRef} className="relative flex overflow-hidden rounded-2xl border bg-white shadow-sm">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSug(true); }}
          onFocus={() => setShowSug(true)}
          onKeyDown={(e) => { if (e.key === "Enter") { setShowSug(false); goSearch(query); } }}
          placeholder={searchPlaceholder}
          className="w-full px-5 py-4 text-sm outline-none"
          autoComplete="off"
        />
        <button
          onClick={() => { setShowSug(false); goSearch(query); }}
          className="flex items-center bg-orange-400 px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-orange-500"
        >
          {searchButton}
        </button>

        {showSug && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="border-b px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {suggestionsLabel}
            </p>
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => { setQuery(s.title); setShowSug(false); goSearch(s.title); }}
                className="flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-cyan-50 transition-colors last:border-b-0"
              >
                <span className="font-bold text-sm text-slate-800">{s.title}</span>
                {s.category && (
                  <span className="ml-2 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-500">
                    {s.category}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exact aceleași categorii ca pe marketplace */}
      <CategorySidebar
        lang={lang}
        categoriesLabel={categoriesLabel}
      />
    </div>
  );
}
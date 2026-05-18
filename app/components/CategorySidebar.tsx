"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, CAT_CONFIG, MainCategory } from "@/lib/categories";

interface Props {
  lang: string;
  categoriesLabel: string;
  // Marketplace: controlled mode
  activeCategory?: string;
  activeSubcategory?: string;
  onSelectCategory?: (key: string) => void;
  onSelectSubcategory?: (catKey: string, subKey: string) => void;
}

export default function CategorySidebar({
  lang,
  categoriesLabel,
  activeCategory,
  activeSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: Props) {
  const [openCatKey, setOpenCatKey] = useState<string | null>(activeCategory ?? null);
  const categories: MainCategory[] = CATEGORIES[lang] || CATEGORIES.de;
  const allLabel = lang === "ro" ? "Toate" : lang === "hu" ? "Összes" : "Alle";

  const handleCatClick = (key: string) => {
    const willOpen = openCatKey !== key;
    setOpenCatKey(willOpen ? key : null);
    if (onSelectCategory) onSelectCategory(key);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          {categoriesLabel}
        </span>
      </div>

      {categories.map((cat) => {
        const isOpen      = openCatKey === cat.key;
        const isCatActive = activeCategory === cat.key;
        const cfg         = CAT_CONFIG[cat.key] || CAT_CONFIG["non-food"];

        return (
          <div key={cat.key} className="border-b border-slate-100 last:border-b-0">

            {/* Main category row */}
            <button
              type="button"
              onClick={() => handleCatClick(cat.key)}
              className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 hover:bg-slate-50 ${
                isCatActive ? cfg.activeBg : ""
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-transform duration-150 group-hover:scale-105 ${cfg.iconBg} ${cfg.iconColor}`}>
                {cfg.icon}
              </span>
              <span className={`flex-1 text-[13px] font-semibold leading-tight ${isCatActive ? cfg.activeText : "text-slate-700"}`}>
                {cat.label}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                isCatActive ? `${cfg.iconBg} ${cfg.iconColor}` : "bg-slate-100 text-slate-400"
              }`}>
                {cat.subcategories.length}
              </span>
              <svg
                className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Subcategories */}
            {isOpen && (
              <div className="border-t border-slate-100 bg-white">
                <div className={`ml-4 border-l-2 ${cfg.borderAccent}`}>

                  {/* "All" row */}
                  {onSelectCategory ? (
                    <button
                      type="button"
                      onClick={() => { onSelectCategory(cat.key); onSelectSubcategory?.(cat.key, ""); }}
                      className={`flex w-full items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs transition-colors hover:bg-slate-50 ${
                        isCatActive && !activeSubcategory ? `font-semibold ${cfg.activeText}` : "text-slate-400"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        isCatActive && !activeSubcategory ? cfg.dotActive : "bg-slate-300"
                      }`} />
                      {allLabel}
                    </button>
                  ) : (
                    <Link
                      href={`/${lang}/marketplace?category=${encodeURIComponent(cat.key)}`}
                      className={`flex items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs font-semibold transition-colors hover:bg-slate-50 ${cfg.activeText}`}
                    >
                      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${cfg.dotActive}`} />
                      {allLabel}
                    </Link>
                  )}

                  {/* Subcategory rows */}
                  {cat.subcategories.map((sub) => {
                    const isSubActive = activeSubcategory === sub.key && activeCategory === cat.key;

                    return onSelectSubcategory ? (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => onSelectSubcategory(cat.key, sub.key)}
                        className={`flex w-full items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs transition-colors hover:bg-slate-50 ${
                          isSubActive ? `font-semibold ${cfg.activeText}` : "text-slate-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
                          isSubActive ? cfg.dotActive : "bg-slate-200"
                        }`} />
                        {sub.label}
                      </button>
                    ) : (
                      <Link
                        key={sub.key}
                        href={`/${lang}/marketplace?category=${encodeURIComponent(cat.key)}&sub=${encodeURIComponent(sub.key)}`}
                        className="flex items-center gap-2.5 py-2.5 pl-4 pr-4 text-xs text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-200" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
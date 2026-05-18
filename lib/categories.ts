export interface Subcategory { key: string; label: string; }
export interface MainCategory { key: string; label: string; subcategories: Subcategory[]; }

export const CATEGORIES: Record<string, MainCategory[]> = {
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

export const CAT_CONFIG: Record<string, {
  icon: string; iconBg: string; iconColor: string;
  activeBg: string; activeText: string; dotActive: string; borderAccent: string;
}> = {
  food: {
    icon: "🥗", iconBg: "bg-emerald-100", iconColor: "text-emerald-700",
    activeBg: "bg-emerald-50", activeText: "text-emerald-700",
    dotActive: "bg-emerald-500", borderAccent: "border-emerald-200",
  },
  "non-food": {
    icon: "📦", iconBg: "bg-slate-100", iconColor: "text-slate-600",
    activeBg: "bg-slate-50", activeText: "text-slate-700",
    dotActive: "bg-slate-500", borderAccent: "border-slate-200",
  },
  dienstleistungen: {
    icon: "💼", iconBg: "bg-blue-100", iconColor: "text-blue-700",
    activeBg: "bg-blue-50", activeText: "text-blue-700",
    dotActive: "bg-blue-500", borderAccent: "border-blue-200",
  },
};
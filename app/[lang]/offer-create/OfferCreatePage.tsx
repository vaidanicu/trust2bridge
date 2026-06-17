"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";
const BLOCKED_ROLES = ["tb_buyer"];

type OfferType = "ware" | "service" | "restposten" | "auction";

export default function OfferCreatePage({ dict, lang }: { dict: any; lang: string }) {
  const router = useRouter();
  const [loading, setLoading]             = useState(false);
  const [offerType, setOfferType]         = useState<OfferType>("ware");
  const [mainCat, setMainCat]             = useState("Food");
  const [subCat, setSubCat] = useState("")
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [photos, setPhotos]               = useState<File[]>([]);
  const [documents, setDocuments]         = useState<File[]>([]);

  useEffect(() => {
    const token   = localStorage.getItem("trustbridge_token");
    const userRaw = localStorage.getItem("trustbridge_user");
    if (!token) { router.replace(`/${lang}/login`); return; }

    const checkAccess = (user: any): boolean => {
      const roles: string[] = Array.isArray(user?.roles)
        ? user.roles.map((r: string) => r.toLowerCase())
        : [String(user?.role ?? "").toLowerCase()];
      return !roles.some((r) => BLOCKED_ROLES.includes(r));
    };

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (!checkAccess(user)) router.replace(`/${lang}/dashboard`);
        else setAccessGranted(true);
      } catch { router.replace(`/${lang}/login`); }
    } else {
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
        .then((user) => {
          localStorage.setItem("trustbridge_user", JSON.stringify(user));
          if (!checkAccess(user)) router.replace(`/${lang}/dashboard`);
          else setAccessGranted(true);
        })
        .catch(() => { localStorage.removeItem("trustbridge_token"); router.replace(`/${lang}/login`); });
    }
  }, [lang, router]);

  const isWare    = offerType === "ware" || offerType === "restposten";
  const isService = offerType === "service";

  // ─── Fallback translations for strings not yet in dict ───────────────────
  const T: Record<string, string> = {
    de: {
      checking_access:      "Zugriff wird geprüft…",
      new_offer:            "Neues Angebot",
      location_city:        "Lagerort / Stadt",
      moq_unit:             "MOQ-Einheit",
      vat_note:             "MwSt.-Hinweis",
      transport_option:     "Transportmöglichkeit",
      document_types_title: "Verfügbare Dokumenttypen",
      visibility_title:     "Veröffentlichung & Kontakt",
      pub_status:           "Veröffentlichungsstatus",
      contact_perm:         "Direktkontakt",
      incoterm_label:       "Incoterm (Incoterms 2020)",
      ph_short:             "Kurze Zusammenfassung (max. 300 Zeichen)…",
      ph_desc:              "Detaillierte Beschreibung des Angebots…",
      ph_packaging:         "L × B × H, Gewicht, Verpackungsart…",
      ph_availability:      "z.B. ab sofort",
      ph_delivery_time:     "3–5 Werktage…",
      ph_select:            "– bitte wählen –",
      opt_vor_ort:          "Vor Ort",
      opt_remote:           "Remote",
      opt_beides:           "Beides",
      opt_incl_vat:         "inkl. MwSt.",
      opt_excl_vat:         "zzgl. MwSt.",
      opt_vat_free:         "MwSt.-frei",
      opt_abholung:         "Selbstabholung",
      opt_lieferung:        "Lieferung durch Anbieter",
      opt_spediteur:        "Spediteur / Logistikpartner",
      opt_keine:            "Keine Angabe",
      opt_public:           "Öffentlich (Marketplace)",
      opt_private:          "Nur TrustBridge-Netzwerk",
      opt_on_request:       "Nur auf Anfrage",
      opt_tb_only:          "Nur über TrustBridge",
      opt_direct:           "Direktkontakt erlaubt",
      file_select:          "Datei auswählen",
      file_multi:           "(mehrere möglich)",
    },
    ro: {
      checking_access:      "Se verifică accesul…",
      new_offer:            "Ofertă nouă",
      location_city:        "Depozit / Oraș",
      moq_unit:             "Unitate MOQ",
      vat_note:             "Notă TVA",
      transport_option:     "Opțiune transport",
      document_types_title: "Tipuri de documente disponibile",
      visibility_title:     "Publicare & Contact",
      pub_status:           "Status publicare",
      contact_perm:         "Contact direct",
      incoterm_label:       "Incoterm (Incoterms 2020)",
      ph_short:             "Scurtă descriere (max. 300 caractere)…",
      ph_desc:              "Descriere detaliată a ofertei…",
      ph_packaging:         "L × l × Î, greutate, tip ambalaj…",
      ph_availability:      "ex. imediat disponibil",
      ph_delivery_time:     "3–5 zile lucrătoare…",
      ph_select:            "– selectați –",
      opt_vor_ort:          "La fața locului",
      opt_remote:           "De la distanță",
      opt_beides:           "Ambele",
      opt_incl_vat:         "incl. TVA",
      opt_excl_vat:         "excl. TVA",
      opt_vat_free:         "Scutit de TVA",
      opt_abholung:         "Ridicare personală",
      opt_lieferung:        "Livrare de către furnizor",
      opt_spediteur:        "Curier / Partener logistic",
      opt_keine:            "Fără specificație",
      opt_public:           "Public (Marketplace)",
      opt_private:          "Doar rețeaua TrustBridge",
      opt_on_request:       "Doar la cerere",
      opt_tb_only:          "Doar prin TrustBridge",
      opt_direct:           "Contact direct permis",
      file_select:          "Selectați fișier",
      file_multi:           "(mai multe posibile)",
    },
    hu: {
      checking_access:      "Hozzáférés ellenőrzése…",
      new_offer:            "Új ajánlat",
      location_city:        "Raktár / Város",
      moq_unit:             "MOQ egység",
      vat_note:             "ÁFA megjegyzés",
      transport_option:     "Szállítási lehetőség",
      document_types_title: "Elérhető dokumentumtípusok",
      visibility_title:     "Közzététel & Kapcsolat",
      pub_status:           "Közzétételi állapot",
      contact_perm:         "Közvetlen kapcsolat",
      incoterm_label:       "Incoterm (Incoterms 2020)",
      ph_short:             "Rövid összefoglaló (max. 300 karakter)…",
      ph_desc:              "Az ajánlat részletes leírása…",
      ph_packaging:         "H × Sz × M, súly, csomagolás típusa…",
      ph_availability:      "pl. azonnal elérhető",
      ph_delivery_time:     "3–5 munkanap…",
      ph_select:            "– kérjük válasszon –",
      opt_vor_ort:          "Helyszínen",
      opt_remote:           "Távolról",
      opt_beides:           "Mindkettő",
      opt_incl_vat:         "ÁFÁ-val",
      opt_excl_vat:         "ÁFA nélkül",
      opt_vat_free:         "ÁFA-mentes",
      opt_abholung:         "Személyes átvétel",
      opt_lieferung:        "Szállítás a szállítótól",
      opt_spediteur:        "Fuvarozó / Logisztikai partner",
      opt_keine:            "Nincs megadva",
      opt_public:           "Nyilvános (Marketplace)",
      opt_private:          "Csak TrustBridge-hálózat",
      opt_on_request:       "Csak igény szerint",
      opt_tb_only:          "Csak TrustBridge-en keresztül",
      opt_direct:           "Közvetlen kapcsolat engedélyezett",
      file_select:          "Fájl kiválasztása",
      file_multi:           "(több is lehetséges)",
    },
  }[lang] ?? ({
      checking_access:      "Zugriff wird geprüft…",
      new_offer:            "Neues Angebot",
      location_city:        "Lagerort / Stadt",
      moq_unit:             "MOQ-Einheit",
      vat_note:             "MwSt.-Hinweis",
      transport_option:     "Transportmöglichkeit",
      document_types_title: "Verfügbare Dokumenttypen",
      visibility_title:     "Veröffentlichung & Kontakt",
      pub_status:           "Veröffentlichungsstatus",
      contact_perm:         "Direktkontakt",
      incoterm_label:       "Incoterm (Incoterms 2020)",
      ph_short:             "Kurze Zusammenfassung (max. 300 Zeichen)…",
      ph_desc:              "Detaillierte Beschreibung des Angebots…",
      ph_packaging:         "L × B × H, Gewicht, Verpackungsart…",
      ph_availability:      "z.B. ab sofort",
      ph_delivery_time:     "3–5 Werktage…",
      ph_select:            "– bitte wählen –",
      opt_vor_ort:          "Vor Ort",
      opt_remote:           "Remote",
      opt_beides:           "Beides",
      opt_incl_vat:         "inkl. MwSt.",
      opt_excl_vat:         "zzgl. MwSt.",
      opt_vat_free:         "MwSt.-frei",
      opt_abholung:         "Selbstabholung",
      opt_lieferung:        "Lieferung durch Anbieter",
      opt_spediteur:        "Spediteur / Logistikpartner",
      opt_keine:            "Keine Angabe",
      opt_public:           "Öffentlich (Marketplace)",
      opt_private:          "Nur TrustBridge-Netzwerk",
      opt_on_request:       "Nur auf Anfrage",
      opt_tb_only:          "Nur über TrustBridge",
      opt_direct:           "Direktkontakt erlaubt",
      file_select:          "Datei auswählen",
      file_multi:           "(mehrere möglich)",
  } as Record<string, string>);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("offer_type", offerType);

    const form = e.currentTarget;
    const qsa = (name: string) =>
      Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)).map((el) => el.value);

    qsa("delivery_countries").forEach((c) => formData.append("delivery_countries[]", c));
    qsa("service_area").forEach((a)        => formData.append("service_area[]", a));
    qsa("document_types").forEach((d)      => formData.append("document_types[]", d));

    photos.forEach((f)    => formData.append("photos[]", f, f.name));
    documents.forEach((f) => formData.append("documents[]", f, f.name));

    try {
      const res = await fetch(`${API}/item-create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("trustbridge_token")}` },
        body: formData,
      });
      if (res.ok) {
        alert(dict.offer.alert_success);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.message ?? "Fehler beim Speichern.");
      }
    } catch {
      alert("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (accessGranted === null) {
    return (
      <>
        <style>{css}</style>
        <div className="tb-loading-screen">
          <div className="tb-spinner" />
          <p className="tb-loading-label">{T.checking_access}</p>
        </div>
      </>
    );
  }
  if (accessGranted === false) return null;

  return (
    <>
      <style>{css}</style>
      <main className="tb-page">

        {/* HERO */}
        <div className="tb-hero">
          <div className="tb-hero-grid" />
          <div className="tb-hero-glow" />
          <div className="tb-hero-inner">
            <span className="tb-hero-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
              </svg>
              {dict.offer.subtitle ?? T.new_offer}
            </span>
            <h1 className="tb-hero-title">{dict.offer.title}</h1>
          </div>
        </div>

        <div className="tb-form-wrap">
          <form onSubmit={handleSubmit} className="tb-form">

            {/* 01 Angebotsart */}
            <Section step="01" title={dict.offer.step1}>
              <div className="tb-type-grid">
                {([
                  { id: "ware",       label: dict.offer.type_ware,    icon: "📦" },
                  { id: "service",    label: dict.offer.type_service,  icon: "🛠️" },
                  { id: "restposten", label: dict.offer.type_stock,    icon: "🏷️" },
                  { id: "auction",    label: dict.offer.type_auction,  icon: "🔨" },
                ] as const).map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOfferType(id)}
                    className={`tb-type-btn${offerType === id ? " tb-type-btn--on" : ""}`}
                  >
                    <span className="tb-type-icon">{icon}</span>
                    <span className="tb-type-label">{label}</span>
                    {offerType === id && (
                      <span className="tb-type-check" aria-hidden="true">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Section>

            {/* 02 Basisdaten */}
            <Section step="02" title={dict.offer.step2}>
              <div className="tb-col">
                <TbInput name="title" required label={dict.offer.label_title} placeholder={dict.offer.ph_title} />
                <TbTextarea name="short_description" label={dict.offer.label_short_desc} maxLength={300} rows={2} placeholder={T.ph_short} />
                <TbTextarea name="description" required label={`${dict.offer.label_desc} *`} rows={6} placeholder={T.ph_desc} />
              </div>
            </Section>

            {/* 03 Kategorie */}
            <Section step="03" title={dict.offer.step3}>
              <div className="tb-grid2">
                <TbSelect
  label={dict.offer.label_main_cat}
  name="main_category"
  value={mainCat}
  onChange={(e: any) => {
    setMainCat(e.target.value);
    setSubCat("");
  }}
>
  {Object.keys(dict.offer.categories).map((cat) => (
    <option key={cat}>{cat}</option>
  ))}
</TbSelect>

<TbSelect
  label={dict.offer.label_sub_cat}
  name="subcategory"
  value={subCat}
  onChange={(e: any) => setSubCat(e.target.value)}
>
  <option value="">– selectați –</option>
  {(dict.offer.categories[mainCat] || []).map((sub: string) => (
    <option key={sub} value={sub}>{sub}</option>
  ))}
</TbSelect>
              </div>
            </Section>

            {/* 04 Produktdaten */}
            {isWare && (
              <Section step="04" title={dict.offer.step4_ware}>
                <div className="tb-grid2">
                  <TbInput name="article_number" label={dict.offer.label_art_no} />
                  <TbInput name="brand"          label={dict.offer.label_brand} />
                  <TbInput name="origin"         label={dict.offer.label_origin} />
                  <TbInput name="location_city"  label={dict.offer.label_location_city ?? T.location_city} />
                  <TbSelect label={dict.offer.label_condition} name="condition">
                    {dict.offer.conditions.map((c: string) => <option key={c}>{c}</option>)}
                  </TbSelect>
                  <div className="tb-grid2-inner">
                    <TbInput name="quantity" type="number" label={dict.offer.label_qty} />
                    <TbSelect label={dict.offer.label_unit} name="unit">
                      {dict.offer.units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                    </TbSelect>
                  </div>
                  <div className="tb-grid2-inner">
                    <TbInput name="moq" type="number" label={dict.offer.label_moq} />
                    <TbSelect label={dict.offer.label_moq_unit ?? T.moq_unit} name="moq_unit">
                      {dict.offer.units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                    </TbSelect>
                  </div>
                </div>
                <div className="tb-col mt6">
                  <TbTextarea name="technical_specs" label={dict.offer.label_specs}     rows={4} />
                  <TbTextarea name="packaging"       label={dict.offer.label_packaging} rows={3} placeholder={T.ph_packaging} />
                </div>
              </Section>
            )}

            {/* 04s Dienstleistung */}
            {isService && (
              <Section step="04" title={dict.offer.step4_service}>
                <div className="tb-grid2">
                  <TbSelect label={dict.offer.label_service_type} name="service_type">
                    {dict.offer.service_types.map((s: string) => <option key={s}>{s}</option>)}
                  </TbSelect>
                  <TbSelect label={dict.offer.label_mode} name="service_mode">
                    <option value="vor_ort">{T.opt_vor_ort}</option>
                    <option value="remote">{T.opt_remote}</option>
                    <option value="beides">{T.opt_beides}</option>
                  </TbSelect>
                  <TbInput name="availability" label={dict.offer.label_availability} placeholder={T.ph_availability} />
                  <TbSelect label={dict.offer.label_billing} name="billing_model">
                    {dict.offer.billing_models.map((m: string) => <option key={m}>{m}</option>)}
                  </TbSelect>
                </div>
                <div className="mt6">
                  <TbCheckboxGroup title={dict.offer.label_area} name="service_area" items={["AT", "HU", "CH", "DE", "RO"]} />
                </div>
              </Section>
            )}

            {/* 05 Preis */}
            <Section step="05" title={dict.offer.step6_price_title}>
              <div className="tb-grid2">
                <TbSelect label={dict.offer.label_price_status} name="price_status">
                  {dict.offer.price_options.map((o: any) => <option key={o.val} value={o.val}>{o.label}</option>)}
                </TbSelect>
                <div className="tb-grid2-inner">
                  <TbInput name="price" label={dict.offer.label_price} placeholder="0.00" />
                  <TbSelect label={dict.offer.label_currency} name="currency">
                    <option>EUR</option><option>HUF</option><option>RON</option>
                  </TbSelect>
                </div>
                <TbSelect label={dict.offer.label_price_per} name="price_unit">
                  {dict.offer.price_units.map((u: string) => <option key={u}>{u}</option>)}
                </TbSelect>
                <TbSelect label={dict.offer.label_vat_note ?? T.vat_note} name="vat_note">
                  <option value="incl_vat">{T.opt_incl_vat}</option>
                  <option value="excl_vat">{T.opt_excl_vat}</option>
                  <option value="vat_free">{T.opt_vat_free}</option>
                </TbSelect>
              </div>
            </Section>

            {/* 06 Lieferbedingungen */}
            <Section step="06" title={dict.offer.step7_title}>
              <div className="tb-grid2">
                <TbSelect label={T.incoterm_label} name="incoterm">
                  {dict.offer.incoterms.map((i: any) => (
                    <option key={i.code} value={i.code}>{i.code} – {i.desc.substring(0, 42)}…</option>
                  ))}
                </TbSelect>
                <TbInput name="pickup_location" label={dict.offer.label_pickup} />
                <TbInput name="delivery_time"   label={dict.offer.label_delivery_time} placeholder={T.ph_delivery_time} />
                <TbSelect label={dict.offer.label_transport_option ?? T.transport_option} name="transport_option">
                  <option value="">{T.ph_select}</option>
                  <option value="selbstabholung">{T.opt_abholung}</option>
                  <option value="lieferung_anbieter">{T.opt_lieferung}</option>
                  <option value="spediteur">{T.opt_spediteur}</option>
                  <option value="keine_angabe">{T.opt_keine}</option>
                </TbSelect>
              </div>
              <div className="mt6">
                <TbCheckboxGroup title={dict.offer.label_delivery_countries} name="delivery_countries" items={["AT", "HU", "CH", "DE", "RO"]} />
              </div>
            </Section>

            {/* 07 Medien & Dokumente */}
            <Section step="07" title={dict.offer.step8_title}>
              <div className="tb-grid2">
                <TbImageUpload label={dict.offer.label_photos} files={photos} onChange={setPhotos} />
                <TbDocUpload   label={dict.offer.label_docs}   files={documents} onChange={setDocuments} />
              </div>
              <div className="mt6">
                <TbCheckboxGroup
                  title={dict.offer.label_document_types ?? T.document_types_title}
                  name="document_types"
                  items={dict.offer.document_types ?? ["Datenblatt", "Zertifikat", "CE-Zeichen", "ISO-Zertifikat", "Rechnung", "Lieferschein"]}
                />
              </div>
            </Section>

            {/* 08 Sichtbarkeit */}
            <Section step="08" title={dict.offer.step_visibility_title ?? T.visibility_title}>
              <div className="tb-grid2">
                <TbSelect label={dict.offer.label_publication_status ?? T.pub_status} name="publication_status">
                  <option value="public">{T.opt_public}</option>
                  <option value="private">{T.opt_private}</option>
                  <option value="on_request">{T.opt_on_request}</option>
                </TbSelect>
                <TbSelect label={dict.offer.label_contact_permission ?? T.contact_perm} name="contact_permission">
                  <option value="trustbridge_only">{T.opt_tb_only}</option>
                  <option value="direct_allowed">{T.opt_direct}</option>
                </TbSelect>
              </div>
            </Section>

            {/* 09 Bestätigung */}
            <Section step="09" title={dict.offer.step6_confirm_title}>
              <div className="tb-confirms">
                {dict.offer.confirms.map((text: string, i: number) => (
                  <label key={i} className="tb-confirm-row">
                    <input type="checkbox" required className="tb-confirm-check" />
                    <span className="tb-confirm-text">{text}</span>
                  </label>
                ))}
              </div>
              <div className="tb-submit-row">
                <button type="button" className="tb-btn-draft">{dict.offer.btn_draft}</button>
                <button type="submit" disabled={loading} className="tb-btn-submit">
                  {loading ? (
                    <span className="tb-btn-loading">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      {dict.offer.btn_sending}
                    </span>
                  ) : (
                    <>{dict.offer.btn_submit} <span className="tb-btn-arrow">→</span></>
                  )}
                </button>
              </div>
            </Section>

          </form>
        </div>
      </main>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="tb-section">
      <div className="tb-section-hdr">
        <span className="tb-step-num">{step}</span>
        <h2 className="tb-section-ttl">{title}</h2>
      </div>
      <div className="tb-section-body">{children}</div>
    </div>
  );
}

function TbInput({ label, ...rest }: { label: string; [k: string]: any }) {
  return (
    <label className="tb-field">
      <span className="tb-lbl">{label}</span>
      <input {...rest} className="tb-input" />
    </label>
  );
}

function TbTextarea({ label, ...rest }: { label: string; [k: string]: any }) {
  return (
    <label className="tb-field">
      <span className="tb-lbl">{label}</span>
      <textarea {...rest} className="tb-input tb-ta" />
    </label>
  );
}

function TbSelect({ label, name, children, value, onChange }: {
  label: string; name: string; children: React.ReactNode; value?: any; onChange?: any;
}) {
  return (
    <label className="tb-field">
      <span className="tb-lbl">{label}</span>
      <div className="tb-sel-wrap">
        <select name={name} className="tb-input tb-sel" value={value} onChange={onChange}>{children}</select>
        <svg className="tb-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </label>
  );
}

function TbImageUpload({ label, files, onChange }: {
  label: string; files: File[]; onChange: (f: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    onChange([...files, ...valid].slice(0, 5));
  };

  const remove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="tb-field">
      <span className="tb-lbl">{label}</span>
      <div
        className="tb-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span className="tb-dropzone-main">Click sau trage imagini</span>
        <span className="tb-dropzone-hint">PNG · JPG · WEBP · max 5 imagini</span>
      </div>
      <input
        ref={inputRef} type="file" accept="image/*" multiple
        style={{ display: "none" }}
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
      />
      {files.length > 0 && (
        <div className="tb-img-grid">
          {files.map((file, i) => (
            <div key={i} className="tb-img-thumb">
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button type="button" className="tb-img-remove" onClick={() => remove(i)} aria-label="Remove">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
          {files.length < 5 && (
            <button type="button" className="tb-img-add" onClick={() => inputRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TbDocUpload({ label, files, onChange }: {
  label: string; files: File[]; onChange: (f: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    onChange([...files, ...Array.from(incoming)]);
  };

  const remove = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  const fmtSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  const extIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "#e74c3c";
    if (ext === "doc" || ext === "docx") return "#2980b9";
    if (ext === "xls" || ext === "xlsx") return "#27ae60";
    return "#64748b";
  };

  return (
    <div className="tb-field">
      <span className="tb-lbl">{label}</span>
      <div
        className="tb-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span className="tb-dropzone-main">Click sau trage documente</span>
        <span className="tb-dropzone-hint">PDF · DOC · DOCX · XLS · XLSX</span>
      </div>
      <input
        ref={inputRef} type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        multiple style={{ display: "none" }}
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
      />
      {files.length > 0 && (
        <ul className="tb-doc-list">
          {files.map((file, i) => (
            <li key={i} className="tb-doc-item">
              <span className="tb-doc-ext" style={{ background: extIcon(file.name) }}>
                {file.name.split(".").pop()?.toUpperCase().slice(0, 4)}
              </span>
              <span className="tb-doc-name">{file.name}</span>
              <span className="tb-doc-size">{fmtSize(file.size)}</span>
              <button type="button" className="tb-doc-remove" onClick={() => remove(i)} aria-label="Remove">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TbCheckboxGroup({ title, name, items }: { title: string; name: string; items: string[] }) {
  return (
    <div className="tb-cbg">
      <span className="tb-lbl">{title}</span>
      <div className="tb-cbg-grid">
        {items.map((item) => (
          <label key={item} className="tb-cb-item">
            <input type="checkbox" name={name} value={item} className="tb-cb" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .tb-page {
    font-family: 'DM Sans', sans-serif;
    background: #0e1420;
    min-height: 100vh;
    color: #cbd5e1;
    padding-bottom: 80px;
  }

  /* Loading */
  .tb-loading-screen {
    font-family: 'DM Sans', sans-serif;
    background: #0e1420;
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
  }
  .tb-spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(13,148,136,.15);
    border-top-color: #0d9488;
    border-radius: 50%;
    animation: tb-spin .7s linear infinite;
  }
  .tb-loading-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: #475569;
  }
  @keyframes tb-spin { to { transform: rotate(360deg); } }

  /* Hero */
  .tb-hero {
    position: relative; overflow: hidden;
    padding: 60px 24px 48px; text-align: center;
    border-bottom: 1px solid #1e2d47;
  }
  .tb-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,179,237,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,179,237,.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
  }
  .tb-hero-glow {
    position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 380px;
    background: radial-gradient(ellipse, rgba(13,148,136,.12) 0%, rgba(59,130,246,.04) 40%, transparent 70%);
    pointer-events: none;
  }
  .tb-hero-inner { position: relative; max-width: 640px; margin: 0 auto; }
  .tb-hero-chip {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: #2dd4bf;
    background: rgba(13,148,136,.08);
    border: 1px solid rgba(13,148,136,.22);
    border-radius: 100px; padding: 5px 14px; margin-bottom: 16px;
  }
  .tb-hero-title {
    font-size: clamp(22px, 4vw, 36px); font-weight: 800;
    letter-spacing: -.025em; line-height: 1.1;
    color: #f1f5f9; margin: 0;
  }

  /* Form wrap */
  .tb-form-wrap { max-width: 960px; margin: 0 auto; padding: 36px 20px 0; }
  .tb-form { display: flex; flex-direction: column; gap: 16px; }

  /* Section */
  .tb-section {
    background: #141c2e;
    border: 1px solid #1e2d47;
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,.22);
  }
  .tb-section-hdr {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 26px;
    border-bottom: 1px solid #1e2d47;
    background: rgba(255,255,255,.015);
  }
  .tb-step-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: .06em;
    color: #0d9488;
    background: rgba(13,148,136,.1);
    border: 1px solid rgba(13,148,136,.2);
    border-radius: 6px; padding: 3px 9px; flex-shrink: 0;
  }
  .tb-section-ttl {
    font-size: 13px; font-weight: 700;
    color: #94a3b8; letter-spacing: .01em; margin: 0;
  }
  .tb-section-body { padding: 26px; }
  @media (max-width: 640px) {
    .tb-section-hdr { padding: 14px 16px; }
    .tb-section-body { padding: 16px; }
  }

  /* Offer type */
  .tb-type-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 11px;
  }
  @media (max-width: 620px) { .tb-type-grid { grid-template-columns: repeat(2,1fr); } }

  .tb-type-btn {
    position: relative;
    background: #111827;
    border: 1px solid #1e2d47;
    border-radius: 14px; padding: 18px 10px 14px;
    text-align: center; cursor: pointer;
    transition: border-color .17s, transform .13s, box-shadow .17s;
  }
  .tb-type-btn:hover {
    border-color: #2a3f60; transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,.22);
  }
  .tb-type-btn--on {
    border-color: #0d9488 !important;
    background: rgba(13,148,136,.06);
    box-shadow: 0 0 0 1px #0d9488, 0 8px 26px rgba(13,148,136,.14);
    transform: translateY(-2px);
  }
  .tb-type-icon { font-size: 24px; display: block; margin-bottom: 7px; }
  .tb-type-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: #64748b;
  }
  .tb-type-btn--on .tb-type-label { color: #2dd4bf; }
  .tb-type-check {
    position: absolute; top: 9px; right: 9px;
    width: 18px; height: 18px;
    background: #0d9488; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }

  /* Field layouts */
  .tb-col   { display: flex; flex-direction: column; gap: 14px; }
  .tb-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .tb-grid2-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .mt6 { margin-top: 22px; }
  @media (max-width: 620px) {
    .tb-grid2 { grid-template-columns: 1fr; }
  }

  /* Form elements */
  .tb-field { display: flex; flex-direction: column; gap: 6px; }
  .tb-lbl {
    font-size: 11px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: #64748b;
  }
  .tb-input {
    width: 100%;
    background: #0e1420;
    border: 1px solid #1e2d47;
    border-radius: 10px; padding: 10px 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; color: #e2e8f0;
    outline: none;
    transition: border-color .17s, box-shadow .17s;
    box-sizing: border-box;
  }
  .tb-input::placeholder { color: #293d57; }
  .tb-input:focus {
    border-color: rgba(13,148,136,.55);
    box-shadow: 0 0 0 3px rgba(13,148,136,.09);
  }
  .tb-ta { resize: vertical; min-height: 76px; }
  .tb-sel-wrap { position: relative; }
  .tb-sel { appearance: none; padding-right: 34px; cursor: pointer; }
  .tb-sel option { background: #141c2e; }
  .tb-chevron {
    position: absolute; right: 11px; top: 50%;
    transform: translateY(-50%); color: #293d57; pointer-events: none;
  }

  /* Dropzone */
  .tb-dropzone {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    background: #0e1420;
    border: 1.5px dashed #1e2d47;
    border-radius: 12px; padding: 22px 16px;
    cursor: pointer; color: #475569;
    transition: border-color .17s, background .17s;
    text-align: center;
  }
  .tb-dropzone:hover {
    border-color: rgba(13,148,136,.5);
    background: rgba(13,148,136,.03);
    color: #64748b;
  }
  .tb-dropzone-main { font-size: 13px; font-weight: 600; color: #64748b; }
  .tb-dropzone-hint { font-size: 10px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: #293d57; }

  /* Image thumbnails */
  .tb-img-grid {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
  }
  .tb-img-thumb {
    position: relative; width: 72px; height: 72px;
    border-radius: 8px; overflow: hidden;
    border: 1px solid #1e2d47;
  }
  .tb-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .tb-img-remove {
    position: absolute; top: 3px; right: 3px;
    width: 18px; height: 18px;
    background: rgba(0,0,0,.7); border: none; border-radius: 50%;
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    padding: 0;
  }
  .tb-img-remove:hover { background: #e74c3c; }
  .tb-img-add {
    width: 72px; height: 72px;
    border-radius: 8px;
    border: 1.5px dashed #1e2d47; background: #0e1420;
    color: #293d57; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color .15s, color .15s;
  }
  .tb-img-add:hover { border-color: rgba(13,148,136,.5); color: #0d9488; }

  /* Document list */
  .tb-doc-list {
    list-style: none; margin: 10px 0 0; padding: 0;
    display: flex; flex-direction: column; gap: 6px;
  }
  .tb-doc-item {
    display: flex; align-items: center; gap: 9px;
    background: #0e1420;
    border: 1px solid #1e2d47; border-radius: 8px;
    padding: 8px 10px;
  }
  .tb-doc-ext {
    flex-shrink: 0;
    font-size: 9px; font-weight: 800; letter-spacing: .04em;
    color: #fff; border-radius: 5px; padding: 3px 5px;
    min-width: 34px; text-align: center;
  }
  .tb-doc-name {
    flex: 1; font-size: 12px; color: #94a3b8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 160px;
  }
  .tb-doc-size { font-size: 11px; color: #475569; flex-shrink: 0; }
  .tb-doc-remove {
    flex-shrink: 0;
    width: 20px; height: 20px;
    background: transparent; border: none; border-radius: 4px;
    color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center;
    padding: 0; transition: color .15s, background .15s;
  }
  .tb-doc-remove:hover { color: #e74c3c; background: rgba(231,76,60,.08); }

  /* Checkboxes */
  .tb-cbg { display: flex; flex-direction: column; gap: 9px; }
  .tb-cbg-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .tb-cb-item {
    display: flex; align-items: center; gap: 7px;
    background: #0e1420;
    border: 1px solid #1e2d47; border-radius: 8px;
    padding: 7px 13px; cursor: pointer;
    font-size: 12px; font-weight: 600; color: #64748b;
    letter-spacing: .03em;
    transition: border-color .14s, color .14s;
  }
  .tb-cb-item:hover { border-color: #2a3f60; color: #94a3b8; }
  .tb-cb { accent-color: #0d9488; width: 13px; height: 13px; flex-shrink: 0; }

  /* Confirmations */
  .tb-confirms { display: flex; flex-direction: column; gap: 9px; margin-bottom: 24px; }
  .tb-confirm-row {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(255,255,255,.02);
    border: 1px solid #1e2d47; border-radius: 11px;
    padding: 13px 15px; cursor: pointer;
    transition: border-color .14s;
  }
  .tb-confirm-row:hover { border-color: #2a3f60; }
  .tb-confirm-check {
    accent-color: #0d9488; width: 15px; height: 15px;
    margin-top: 2px; flex-shrink: 0; cursor: pointer;
  }
  .tb-confirm-text { font-size: 13px; color: #94a3b8; line-height: 1.6; }

  /* Submit */
  .tb-submit-row { display: flex; gap: 11px; }
  @media (max-width: 560px) { .tb-submit-row { flex-direction: column; } }

  .tb-btn-draft {
    flex: 1; background: transparent;
    border: 1px solid #1e2d47; border-radius: 11px;
    padding: 13px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    color: #475569; cursor: pointer;
    transition: border-color .17s, color .17s;
  }
  .tb-btn-draft:hover { border-color: #2a3f60; color: #64748b; }

  .tb-btn-submit {
    flex: 2; background: #0d9488; border: none;
    border-radius: 11px; padding: 13px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: .04em; color: #fff; cursor: pointer;
    position: relative; overflow: hidden;
    transition: background .17s, transform .13s, box-shadow .17s;
  }
  .tb-btn-submit::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 55%);
    pointer-events: none;
  }
  .tb-btn-submit:hover:not(:disabled) {
    background: #0b7c72; transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(13,148,136,.26);
  }
  .tb-btn-submit:disabled { opacity: .45; cursor: not-allowed; }
  .tb-btn-loading { display: flex; align-items: center; justify-content: center; gap: 9px; }
  .tb-btn-arrow { display: inline-block; margin-left: 5px; transition: transform .17s; }
  .tb-btn-submit:hover .tb-btn-arrow { transform: translateX(3px); }
  .tb-spin { animation: tb-spin .75s linear infinite; }
`;
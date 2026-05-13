"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

const PACKAGES: Record<string, { badge: string; cards: { val: string; title: string; price: string; highlight: string; items: string[]; accent: string }[] }> = {
  ro: {
    badge: "Alegeți pachetul",
    cards: [
      {
        val: "basic",
        title: "Prezență de bază",
        price: "70 EUR",
        highlight: "+ 5% comision",
        accent: "#10b981",
        items: ["Publicare produse / servicii", "Prezentare multilingvă", "Cereri structurate", "Proces protejat prin NDA"],
      },
      {
        val: "verified",
        title: "Furnizor verificat",
        price: "600 EUR / an",
        highlight: "+ 5% comision",
        accent: "#f59e0b",
        items: ["Statut de furnizor verificat", "Checklist proces ISO 9001", "Poziționare mai bună", "Certificat de calificare"],
      },
      {
        val: "active",
        title: "Vânzare activă",
        price: "600 EUR / an",
        highlight: "+ 7% comision",
        accent: "#3b82f6",
        items: ["Căutare activă de clienți", "Integrare în proiecte", "Sprijin la negocieri", "Proiecte internaționale"],
      },
    ],
  },
  hu: {
    badge: "Válasszon csomagot",
    cards: [
      {
        val: "basic",
        title: "Alap megjelenés",
        price: "70 EUR",
        highlight: "+ 5% jutalék",
        accent: "#10b981",
        items: ["Termékek / szolgáltatások közzététele", "Többnyelvű megjelenítés", "Strukturált ajánlatkérések", "NDA-védett folyamat"],
      },
      {
        val: "verified",
        title: "Ellenőrzött beszállító",
        price: "600 EUR / év",
        highlight: "+ 5% jutalék",
        accent: "#f59e0b",
        items: ["Ellenőrzött beszállítói státusz", "ISO 9001 folyamat-ellenőrzőlista", "Jobb pozicionálás", "Minősítési tanúsítvány"],
      },
      {
        val: "active",
        title: "Aktív értékesítés",
        price: "600 EUR / év",
        highlight: "+ 7% jutalék",
        accent: "#3b82f6",
        items: ["Aktív ügyfélkeresés", "Projektintegráció", "Tárgyalási támogatás", "Nemzetközi projektek"],
      },
    ],
  },
  de: {
    badge: "Paket wählen",
    cards: [
      {
        val: "basic",
        title: "Basis-Präsenz",
        price: "70 EUR",
        highlight: "+ 5% Provision",
        accent: "#10b981",
        items: ["Produkte / Dienstleistungen veröffentlichen", "Mehrsprachige Darstellung", "Strukturierte Anfragen", "NDA-geschützter Prozess"],
      },
      {
        val: "verified",
        title: "Verified Supplier",
        price: "600 EUR / Jahr",
        highlight: "+ 5% Provision",
        accent: "#f59e0b",
        items: ["Geprüfter Anbieterstatus", "ISO 9001 Prozesscheckliste", "Bessere Positionierung", "Qualifizierungszertifikat"],
      },
      {
        val: "active",
        title: "Aktiver Vertrieb",
        price: "600 EUR / Jahr",
        highlight: "+ 7% Provision",
        accent: "#3b82f6",
        items: ["Aktive Kundensuche", "Projektintegration", "Verhandlungsbegleitung", "Internationale Projekte"],
      },
    ],
  },
};

export default function RegisterPage({ dict, lang }: { dict: any; lang: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  if (!dict || !dict.register) return null;

  const pkgLang = PACKAGES[lang] ?? PACKAGES["de"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedPackage) {
      alert(lang === "ro" ? "Vă rugăm să selectați un pachet." : lang === "hu" ? "Kérjük, válasszon csomagot." : "Bitte wählen Sie ein Paket aus.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      company: formData.get("company"),
      contact_name: formData.get("contact_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      vat: formData.get("vat"),
      business_type: formData.get("business_type"),
      message: formData.get("message"),
      package: selectedPackage,
      lang,
    };

    try {
      const res = await fetch(`${API_URL}/register-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        alert(data.message || dict.register.alert_error);
      }
    } catch {
      alert(dict.register.alert_conn_error);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <style>{successStyles}</style>
        <main className="success-page">
          <div className="success-card">
            <div className="success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="success-badge">{dict.register.success_badge}</p>
            <h1 className="success-title">{dict.register.success_title}</h1>
            <p className="success-desc">{dict.register.success_desc}</p>
            <Link href={`/${lang}/login`} className="success-btn">{dict.register.btn_to_login}</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{pageStyles}</style>
      <main className="reg-page">

        {/* ── HERO ── */}
        <section className="reg-hero">
          <div className="reg-hero-grid" />
          <div className="reg-hero-glow" />
          <div className="reg-hero-inner">
            <span className="reg-hero-chip">{dict.register.badge}</span>
            <h1 className="reg-hero-title">{dict.register.title}</h1>
            <p className="reg-hero-sub">{dict.register.subtitle}</p>
          </div>
        </section>

        {/* ── FORM CARD ── */}
        <section className="reg-body">
          <div className="reg-card">
            <form onSubmit={handleSubmit}>

              {/* STEP 1 — PACKAGE */}
              <div className="pkg-section">
                <div className="step-header">
                  <span className="step-num">01</span>
                  <span className="step-label">{pkgLang.badge}</span>
                </div>
                <div className="pkg-grid">
                  {pkgLang.cards.map((card) => {
                    const isSelected = selectedPackage === card.val;
                    return (
                      <button
                        key={card.val}
                        type="button"
                        onClick={() => setSelectedPackage(card.val)}
                        className={`pkg-card${isSelected ? " pkg-card--on" : ""}`}
                        style={{ "--acc": card.accent } as React.CSSProperties}
                      >
                        <div className="pkg-glow" />
                        {isSelected && (
                          <span className="pkg-badge">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            {lang === "ro" ? "Selectat" : lang === "hu" ? "Kiválasztva" : "Ausgewählt"}
                          </span>
                        )}
                        <h3 className="pkg-title">{card.title}</h3>
                        <div className="pkg-price-wrap">
                          <span className="pkg-price">{card.price}</span>
                          <span className="pkg-sub">{card.highlight}</span>
                        </div>
                        <ul className="pkg-list">
                          {card.items.map((item) => (
                            <li key={item}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2 — FIELDS */}
              <div className="fields-section">
                <div className="step-header">
                  <span className="step-num">02</span>
                  <span className="step-label">
                    {lang === "ro" ? "Date companie" : lang === "hu" ? "Céges adatok" : "Firmendaten"}
                  </span>
                </div>

                <div className="fields-grid">
                  <Field name="company" required placeholder={dict.register.ph_company} />
                  <Field name="contact_name" required placeholder={dict.register.ph_contact} />
                  <Field name="email" required type="email" placeholder={dict.register.ph_email} />
                  <Field name="phone" placeholder={dict.register.ph_phone} />
                  <Field name="country" required placeholder={dict.register.ph_country} />
                  <Field name="vat" placeholder={dict.register.ph_vat} />
                </div>

                <div className="select-wrap">
                  <select name="business_type" required className="reg-select">
                    <option value="">{dict.register.ph_business_type} *</option>
                    {dict.register.business_options.map((opt: any) => (
                      <option key={opt.val} value={opt.val}>{opt.label}</option>
                    ))}
                  </select>
                  <svg className="select-chevron" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                <textarea
                  name="message"
                  rows={4}
                  placeholder={dict.register.ph_message}
                  className="reg-textarea"
                />

                <label className="privacy-row">
                  <input type="checkbox" required className="privacy-check" />
                  <span>{dict.register.privacy_agreement}</span>
                </label>

                <button disabled={loading} className="submit-btn">
                  {loading ? (
                    <span className="submit-loading">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      {dict.register.btn_sending}
                    </span>
                  ) : (
                    <>{dict.register.btn_submit} <span className="submit-arrow">→</span></>
                  )}
                </button>
              </div>

            </form>
          </div>
        </section>

      </main>
    </>
  );
}

function Field({ name, placeholder, required, type = "text" }: any) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="reg-input"
    />
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .reg-page {
    font-family: 'DM Sans', sans-serif;
    background: #080d0d;
    min-height: 100vh;
    color: #e2e8f0;
    padding-bottom: 80px;
  }

  /* ── HERO ── */
  .reg-hero {
    position: relative;
    overflow: hidden;
    padding: 88px 24px 76px;
    text-align: center;
  }

  .reg-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(16,130,128,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,130,128,.06) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 100%);
  }

  .reg-hero-glow {
    position: absolute;
    top: -160px;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(16,130,128,.18) 0%, transparent 68%);
    pointer-events: none;
  }

  .reg-hero-inner {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .reg-hero-chip {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #2dd4bf;
    background: rgba(16,130,128,.1);
    border: 1px solid rgba(16,130,128,.22);
    border-radius: 100px;
    padding: 5px 16px;
    margin-bottom: 22px;
  }

  .reg-hero-title {
    font-size: clamp(26px, 5vw, 46px);
    font-weight: 800;
    letter-spacing: -.025em;
    line-height: 1.08;
    color: #f8fafc;
    margin: 0 0 16px;
  }

  .reg-hero-sub {
    font-size: 16px;
    color: #475569;
    line-height: 1.65;
    margin: 0;
  }

  /* ── BODY ── */
  .reg-body {
    max-width: 880px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .reg-card {
    background: #0f1717;
    border: 1px solid #1a2828;
    border-radius: 20px;
    overflow: hidden;
  }

  /* ── STEP HEADER ── */
  .step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
  }

  .step-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .06em;
    color: #108280;
    background: rgba(16,130,128,.1);
    border: 1px solid rgba(16,130,128,.18);
    border-radius: 6px;
    padding: 3px 9px;
  }

  .step-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: .01em;
  }

  /* ── PACKAGES ── */
  .pkg-section {
    padding: 32px 32px 30px;
    border-bottom: 1px solid #1a2828;
  }

  @media (max-width: 640px) { .pkg-section { padding: 24px 18px; } }

  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 660px) { .pkg-grid { grid-template-columns: 1fr; } }

  .pkg-card {
    position: relative;
    background: #0b1313;
    border: 1px solid #1a2828;
    border-radius: 14px;
    padding: 18px;
    text-align: left;
    cursor: pointer;
    transition: border-color .18s, transform .15s, box-shadow .18s;
    overflow: hidden;
  }

  .pkg-card:hover {
    border-color: rgba(255,255,255,.1);
    transform: translateY(-2px);
  }

  .pkg-card--on {
    border-color: var(--acc) !important;
    background: color-mix(in srgb, var(--acc) 5%, #0b1313);
    box-shadow: 0 0 0 1px var(--acc), 0 10px 36px color-mix(in srgb, var(--acc) 14%, transparent);
    transform: translateY(-3px);
  }

  .pkg-glow {
    position: absolute;
    top: -50px; right: -50px;
    width: 130px; height: 130px;
    background: radial-gradient(circle, color-mix(in srgb, var(--acc) 22%, transparent), transparent 70%);
    opacity: 0;
    transition: opacity .25s;
    pointer-events: none;
  }

  .pkg-card--on .pkg-glow { opacity: 1; }

  .pkg-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--acc);
    background: color-mix(in srgb, var(--acc) 12%, transparent);
    border-radius: 100px;
    padding: 3px 10px 3px 8px;
    margin-bottom: 10px;
  }

  .pkg-title {
    font-size: 14px;
    font-weight: 700;
    color: #cbd5e1;
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .pkg-card--on .pkg-title { color: var(--acc); }

  .pkg-price-wrap {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.05);
    border-radius: 9px;
    padding: 9px 11px;
    margin-bottom: 14px;
  }

  .pkg-price {
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    font-weight: 500;
    color: #f1f5f9;
    display: block;
    line-height: 1.2;
  }

  .pkg-sub {
    font-size: 11px;
    color: #475569;
    display: block;
    margin-top: 2px;
  }

  .pkg-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .pkg-list li {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 11.5px;
    color: #475569;
    line-height: 1.4;
  }

  .pkg-list li svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--acc);
    opacity: .75;
  }

  /* ── FIELDS ── */
  .fields-section {
    padding: 28px 32px 34px;
  }

  @media (max-width: 640px) { .fields-section { padding: 22px 18px 28px; } }

  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  @media (max-width: 580px) { .fields-grid { grid-template-columns: 1fr; } }

  .reg-input {
    width: 100%;
    background: #0b1313;
    border: 1px solid #1a2828;
    border-radius: 11px;
    padding: 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e2e8f0;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
    box-sizing: border-box;
  }

  .reg-input::placeholder { color: #2d3f3f; }

  .reg-input:focus {
    border-color: rgba(16,130,128,.6);
    box-shadow: 0 0 0 3px rgba(16,130,128,.1);
  }

  .select-wrap {
    position: relative;
    margin-bottom: 12px;
  }

  .reg-select {
    width: 100%;
    appearance: none;
    background: #0b1313;
    border: 1px solid #1a2828;
    border-radius: 11px;
    padding: 12px 40px 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e2e8f0;
    outline: none;
    cursor: pointer;
    transition: border-color .18s, box-shadow .18s;
  }

  .reg-select option { background: #0f1717; }

  .reg-select:focus {
    border-color: rgba(16,130,128,.6);
    box-shadow: 0 0 0 3px rgba(16,130,128,.1);
  }

  .select-chevron {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #2d3f3f;
    pointer-events: none;
  }

  .reg-textarea {
    width: 100%;
    background: #0b1313;
    border: 1px solid #1a2828;
    border-radius: 11px;
    padding: 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e2e8f0;
    outline: none;
    resize: vertical;
    transition: border-color .18s, box-shadow .18s;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  .reg-textarea::placeholder { color: #2d3f3f; }

  .reg-textarea:focus {
    border-color: rgba(16,130,128,.6);
    box-shadow: 0 0 0 3px rgba(16,130,128,.1);
  }

  .privacy-row {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    background: rgba(255,255,255,.02);
    border: 1px solid #1a2828;
    border-radius: 11px;
    padding: 13px 15px;
    cursor: pointer;
    font-size: 12.5px;
    color: #475569;
    line-height: 1.55;
    margin-bottom: 14px;
  }

  .privacy-check {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: #108280;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .submit-btn {
    width: 100%;
    background: #108280;
    border: none;
    border-radius: 11px;
    padding: 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .04em;
    color: #fff;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background .18s, transform .14s, box-shadow .18s;
  }

  .submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.07) 0%, transparent 55%);
    pointer-events: none;
  }

  .submit-btn:hover:not(:disabled) {
    background: #0c6e6c;
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(16,130,128,.28);
  }

  .submit-btn:active:not(:disabled) { transform: none; }
  .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

  .submit-arrow {
    display: inline-block;
    margin-left: 6px;
    transition: transform .18s;
  }

  .submit-btn:hover .submit-arrow { transform: translateX(3px); }

  .submit-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin .75s linear infinite; }
`;

const successStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');

  .success-page {
    font-family: 'DM Sans', sans-serif;
    background: #080d0d;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .success-card {
    background: #0f1717;
    border: 1px solid #1a2828;
    border-radius: 22px;
    padding: 56px 40px;
    max-width: 460px;
    width: 100%;
    text-align: center;
  }

  .success-icon {
    width: 64px; height: 64px;
    background: rgba(16,130,128,.1);
    border: 1px solid rgba(16,130,128,.22);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2dd4bf;
    margin: 0 auto 26px;
  }

  .success-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #108280;
    margin: 0 0 10px;
  }

  .success-title {
    font-size: 26px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -.02em;
    margin: 0 0 12px;
  }

  .success-desc {
    font-size: 15px;
    color: #475569;
    line-height: 1.65;
    margin: 0 0 30px;
  }

  .success-btn {
    display: inline-block;
    background: #108280;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 13px 30px;
    border-radius: 10px;
    text-decoration: none;
    transition: background .18s;
  }

  .success-btn:hover { background: #0c6e6c; }
`;
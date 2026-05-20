"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

// ─── Package definitions (Beta) ────────────────────────────────────────────

type PackageVal = "buyer" | "search" | "seller";

interface PkgCard {
  val: PackageVal;
  title: string;
  price: string;
  highlight: string;
  items: string[];
  accent: string;
  badge?: string;
  locked?: boolean;
  lockedNote?: string;
}

interface PkgLang {
  sectionLabel: string;
  cards: PkgCard[];
}

const PACKAGES: Record<string, PkgLang> = {
  de: {
    sectionLabel: "Paket wählen",
    cards: [
      {
        val: "buyer",
        title: "Käufer-Paket",
        price: "10 EUR",
        highlight: "Einmalige Zahlung · 3 Monate",
        accent: "#10b981",
        items: [
          "Zugang zum TrustBridge-Portal",
          "Einsicht in geprüfte Anbieter und Angebote",
          "Kommunikations- und Anfragefunktionen",
          "Internationale Kaufmöglichkeiten",
          "Mitwirkung an der Beta-Weiterentwicklung",
        ],
      },
      {
        val: "search",
        title: "Produkt-/Dienstleistungssuche",
        price: "Auf Anfrage",
        highlight: "Proforma-Rechnung vor Aktivierung",
        accent: "#f59e0b",
        badge: "Erfordert Käufer-Paket",
        locked: true,
        lockedNote: "Dieses Paket setzt das Käufer-Paket voraus. Nach Weiterleitung Ihrer Suchanfrage erhalten Sie ein Angebot mit Proforma-Rechnung. Die Suche wird im gewünschten Land nach Zahlungseingang aktiviert.",
        items: [
          "Gezielte Suche nach Produkten oder Dienstleistungen",
          "Weiterleitung Ihrer Anfrage durch TrustBridge",
          "Angebot mit Proforma-Rechnung",
          "Aktivierung der Suche im gewünschten Land",
        ],
      },
      {
        val: "seller",
        title: "Verkäufer-Paket",
        price: "0 EUR",
        highlight: "+ 5 % Provision auf Umsätze",
        accent: "#3b82f6",
        badge: "Beta – keine Grundgebühr",
        items: [
          "Unternehmens- und Produktpräsentation",
          "Bonitäts- und Unternehmensbewertung",
          "Qualitäts-Checkliste (ISO 9001)",
          "Prüf- und Qualitätszertifikat möglich",
          "Mitwirkung an der Beta-Weiterentwicklung",
        ],
      },
    ],
  },
  ro: {
    sectionLabel: "Alegeți pachetul",
    cards: [
      {
        val: "buyer",
        title: "Pachet Cumpărător",
        price: "10 EUR",
        highlight: "Plată unică · 3 luni",
        accent: "#10b981",
        items: [
          "Acces la portalul TrustBridge",
          "Vizualizare furnizori și oferte verificate",
          "Funcții de comunicare și solicitare",
          "Oportunități internaționale de achiziție",
          "Participare la dezvoltarea Beta",
        ],
      },
      {
        val: "search",
        title: "Căutare Produse/Servicii",
        price: "La cerere",
        highlight: "Factură pro-formă înainte de activare",
        accent: "#f59e0b",
        badge: "Necesită Pachet Cumpărător",
        locked: true,
        lockedNote: "Acest pachet necesită Pachetul Cumpărător. După transmiterea cererii, veți primi o ofertă cu factură pro-formă. Căutarea se activează în țara dorită după primirea plății.",
        items: [
          "Căutare țintită de produse sau servicii",
          "Redirecționarea cererii prin TrustBridge",
          "Ofertă cu factură pro-formă",
          "Activarea căutării în țara dorită",
        ],
      },
      {
        val: "seller",
        title: "Pachet Vânzător",
        price: "0 EUR",
        highlight: "+ 5 % comision pe vânzări",
        accent: "#3b82f6",
        badge: "Beta – fără taxă lunară",
        items: [
          "Prezentare companie și produse/servicii",
          "Evaluare bonitate și companie",
          "Listă de verificare calitate (ISO 9001)",
          "Certificat de calificare posibil",
          "Participare la dezvoltarea Beta",
        ],
      },
    ],
  },
  hu: {
    sectionLabel: "Válasszon csomagot",
    cards: [
      {
        val: "buyer",
        title: "Vevői csomag",
        price: "10 EUR",
        highlight: "Egyszeri díj · 3 hónap",
        accent: "#10b981",
        items: [
          "Hozzáférés a TrustBridge portálhoz",
          "Ellenőrzött szállítók és ajánlatok megtekintése",
          "Kommunikációs és lekérdező funkciók",
          "Nemzetközi vásárlási lehetőségek",
          "Részvétel a Beta fejlesztésében",
        ],
      },
      {
        val: "search",
        title: "Termék-/Szolgáltatáskeresés",
        price: "Igény szerint",
        highlight: "Díjbekérő az aktiválás előtt",
        accent: "#f59e0b",
        badge: "Vevői csomag szükséges",
        locked: true,
        lockedNote: "Ez a csomag a Vevői csomagot igényli. A keresési kérelem továbbítása után ajánlatot kap díjbekérővel. A keresést a kívánt országban a befizetés beérkezése után aktiváljuk.",
        items: [
          "Célzott termék- vagy szolgáltatáskeresés",
          "Kérelem továbbítása a TrustBridge-en keresztül",
          "Ajánlat díjbekérővel",
          "Keresés aktiválása a kívánt országban",
        ],
      },
      {
        val: "seller",
        title: "Eladói csomag",
        price: "0 EUR",
        highlight: "+ 5 % jutalék az árbevételre",
        accent: "#3b82f6",
        badge: "Beta – nincs alapdíj",
        items: [
          "Vállalat és termékek/szolgáltatások bemutatása",
          "Hitelességi és vállalati értékelés",
          "Minőségi ellenőrzőlista (ISO 9001)",
          "Minősítési tanúsítvány lehetséges",
          "Részvétel a Beta fejlesztésében",
        ],
      },
    ],
  },
};

// ─── Labels ─────────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  de: {
    selected: "Ausgewählt",
    companyData: "Firmendaten",
    selectRequired: "Bitte wählen Sie ein Paket aus.",
    betaBanner:
      "Das gewählte Paket ist ab Freigabe für 3 Monate gültig. Login-Daten erhalten Sie nach Zahlungseingang (Käufer) bzw. nach Abschluss der Firmenprüfung (Verkäufer) per E-Mail.",
  },
  ro: {
    selected: "Selectat",
    companyData: "Date companie",
    selectRequired: "Vă rugăm să selectați un pachet.",
    betaBanner:
      "Pachetul ales este valabil 3 luni de la aprobare. Datele de autentificare vor fi trimise pe e-mail după primirea plății (cumpărător) sau după finalizarea verificării companiei (vânzător).",
  },
  hu: {
    selected: "Kiválasztva",
    companyData: "Céges adatok",
    selectRequired: "Kérjük, válasszon csomagot.",
    betaBanner:
      "A kiválasztott csomag a jóváhagyástól számított 3 hónapig érvényes. A bejelentkezési adatokat e-mailben küldjük a befizetés (vevő) illetve a cégellenőrzés lezárása (eladó) után.",
  },
};

// ─── Success content per language ────────────────────────────────────────────

const SUCCESS_CONTENT: Record<string, {
  badge: string;
  title: string;
  intro: string;
  buyerTitle: string;
  buyerSteps: string[];
  sellerTitle: string;
  sellerSteps: string[];
  closing: string;
  wish: string;
  btnLogin: string;
}> = {
  de: {
    badge: "Registrierungsanfrage erhalten",
    title: "Vielen Dank!",
    intro: "Das TrustBridge-Team prüft Ihre Daten. Es werden jetzt folgende Schritte folgen:",
    buyerTitle: "Wenn Sie Käufer / Interessent sind:",
    buyerSteps: [
      "Wir prüfen Ihre Angaben zur Gewährleistung eines sicheren und transparenten Portals.",
      "Falls zusätzliche Informationen erforderlich sind, kontaktieren wir Sie direkt.",
      "Nach erfolgreicher Freigabe erhalten Sie Ihre Zugangsdaten per E-Mail.",
    ],
    sellerTitle: "Wenn Sie Anbieter / Verkäufer sind:",
    sellerSteps: [
      "Wir freuen uns, Sie als interessierten Anbieter begrüßen zu dürfen.",
      "Wir prüfen Ihre Unternehmensdaten sowie Ihr Produkt- und Leistungsportfolio sorgfältig.",
      "Zur Sicherstellung von Qualität, Zuverlässigkeit und Transparenz erfolgt eine Unternehmensbewertung sowie eine Bonitätsprüfung.",
      "Sie erhalten eine Qualitäts-Checkliste auf Basis internationaler Standards (z. B. ISO 9001).",
      "Ein Auditorenteam stellt Ihnen ein Zertifikat aus, das Sie auch im täglichen Wirtschaftsleben nutzen können.",
      "Abhängig von Branche und Leistungsumfang können ergänzende Informationen oder Nachweise erforderlich sein.",
      "Nach erfolgreicher Prüfung und Freigabe erhalten Sie Ihre Zugangsdaten per E-Mail.",
    ],
    closing: "Unser Ziel ist ein vertrauenswürdiges, professionelles und nachhaltiges Netzwerk für Käufer und Anbieter.",
    wish: "Wir wünschen Ihnen bereits jetzt ein erfolgreiches internationales Kauf- und Verkaufserlebnis mit TrustBridge.",
    btnLogin: "Zur Anmeldung",
  },
  hu: {
    badge: "Regisztrációs kérelem megérkezett",
    title: "Köszönjük!",
    intro: "A TrustBridge csapata ellenőrzi adatait. A következő lépések várhatók:",
    buyerTitle: "Ha Ön vásárló / érdeklődő:",
    buyerSteps: [
      "Adatait egy biztonságos és átlátható portál biztosítása érdekében ellenőrizzük.",
      "Amennyiben további információkra van szükség, közvetlenül felvesszük Önnel a kapcsolatot.",
      "Sikeres jóváhagyás után e-mailben megkapja a hozzáférési adatait.",
    ],
    sellerTitle: "Ha Ön szolgáltató / eladó:",
    sellerSteps: [
      "Örömmel üdvözöljük érdeklődő szolgáltatóink között.",
      "Gondosan ellenőrizzük vállalati adatait, valamint termék- és szolgáltatási portfólióját.",
      "A minőség, megbízhatóság és átláthatóság biztosítása érdekében vállalatértékelést és hitelképességi vizsgálatot végzünk.",
      "Ezen felül egy ISO 9001 alapú minőségügyi ellenőrzőlistát is biztosítunk.",
      "Auditorcsapatunk tanúsítványt állít ki, amelyet a mindennapi üzleti életben is használhat.",
      "Az ágazattól függően további dokumentumok benyújtása válhat szükségessé.",
      "Sikeres ellenőrzés és jóváhagyás után e-mailben megkapja hozzáférési adatait.",
    ],
    closing: "Célunk egy megbízható, professzionális és fenntartható hálózat kialakítása vásárlók és szolgáltatók számára.",
    wish: "Már most sikeres nemzetközi vásárlási és értékesítési élményt kívánunk Önnek a TrustBridge portálon.",
    btnLogin: "Bejelentkezéshez",
  },
  ro: {
    badge: "Cerere de înregistrare primită",
    title: "Vă mulțumim!",
    intro: "Echipa TrustBridge verifică datele dumneavoastră. Urmează pașii de mai jos:",
    buyerTitle: "Dacă sunteți cumpărător / persoană interesată:",
    buyerSteps: [
      "Verificăm datele dumneavoastră pentru a garanta un portal sigur și transparent.",
      "Dacă sunt necesare informații suplimentare, vă vom contacta direct.",
      "După aprobarea cu succes, veți primi datele de acces prin e-mail.",
    ],
    sellerTitle: "Dacă sunteți furnizor / vânzător:",
    sellerSteps: [
      "Ne bucurăm să vă salutăm ca furnizor interesat.",
      "Verificăm cu atenție datele companiei și portofoliul de produse și servicii.",
      "Pentru a asigura calitatea și transparența, realizăm o evaluare a companiei și o verificare a bonității.",
      "Veți primi o listă de verificare a calității bazată pe standarde ISO 9001.",
      "Echipa noastră de auditori vă va emite un certificat utilizabil în activitatea economică.",
      "În funcție de domeniu, pot fi necesare documente suplimentare.",
      "După verificarea și aprobarea cu succes, veți primi datele de acces prin e-mail.",
    ],
    closing: "Scopul nostru este construirea unei rețele de încredere, profesioniste și sustenabile pentru cumpărători și furnizori.",
    wish: "Vă dorim o experiență internațională de succes cu TrustBridge.",
    btnLogin: "Spre autentificare",
  },
};

export default function RegisterPage({ dict, lang }: { dict: any; lang: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageVal | "">("");

  if (!dict || !dict.register) return null;

  const pkgLang = PACKAGES[lang] ?? PACKAGES["de"];
  const labels = LABELS[lang] ?? LABELS["de"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedPackage) {
      alert(labels.selectRequired);
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
    const sc = SUCCESS_CONTENT[lang] ?? SUCCESS_CONTENT["de"];
    const isSeller = selectedPackage === "seller";
    return (
      <>
        <style>{successStyles}</style>
        <main className="success-page">
          <div className="success-card">

            {/* Header */}
            <div className="sc-header">
              <div className="sc-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="sc-badge">{sc.badge}</p>
              <h1 className="sc-title">{sc.title}</h1>
              <p className="sc-intro">{sc.intro}</p>
            </div>

            {/* Steps — buyer */}
            <div className="sc-block sc-block--buyer">
              <div className="sc-block-header">
                <span className="sc-block-dot sc-block-dot--green" />
                <span className="sc-block-label">{sc.buyerTitle}</span>
              </div>
              <ul className="sc-steps">
                {sc.buyerSteps.map((s, i) => (
                  <li key={i} className="sc-step">
                    <span className="sc-step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps — seller */}
            <div className="sc-block sc-block--seller">
              <div className="sc-block-header">
                <span className="sc-block-dot sc-block-dot--blue" />
                <span className="sc-block-label">{sc.sellerTitle}</span>
              </div>
              <ul className="sc-steps">
                {sc.sellerSteps.map((s, i) => (
                  <li key={i} className="sc-step">
                    <span className="sc-step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="sc-footer">
              <p className="sc-closing">{sc.closing}</p>
              <p className="sc-wish">{sc.wish}</p>
              <Link href={`/${lang}/login`} className="sc-btn">{sc.btnLogin} →</Link>
            </div>

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
                  <span className="step-label">{pkgLang.sectionLabel}</span>
                </div>

                {/* Beta info banner */}
                <div className="beta-banner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{labels.betaBanner}</span>
                </div>

                {/* Three-column package grid */}
                <div className="pkg-grid">
                  {pkgLang.cards.map((card) => {
                    const isSelected = selectedPackage === card.val;
                    const isLocked = !!card.locked;
                    return (
                      <button
                        key={card.val}
                        type="button"
                        onClick={() => !isLocked && setSelectedPackage(card.val)}
                        disabled={isLocked}
                        className={`pkg-card${isSelected ? " pkg-card--on" : ""}${isLocked ? " pkg-card--locked" : ""}`}
                        style={{ "--acc": card.accent } as React.CSSProperties}
                      >
                        <div className="pkg-glow" />
                        <div className="pkg-top-row">
                          {card.badge && (
                            <span className={`pkg-featured-badge${isLocked ? " pkg-featured-badge--locked" : ""}`}>{card.badge}</span>
                          )}
                          {isSelected && !isLocked && (
                            <span className="pkg-selected-badge">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              {labels.selected}
                            </span>
                          )}
                          {isLocked && (
                            <span className="pkg-lock-icon" aria-label="locked">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            </span>
                          )}
                        </div>
                        <h3 className="pkg-title">{card.title}</h3>
                        <div className="pkg-price-wrap">
                          <span className="pkg-price">{card.price}</span>
                          <span className="pkg-sub">{card.highlight}</span>
                        </div>
                        {isLocked && card.lockedNote && (
                          <p className="pkg-locked-note">{card.lockedNote}</p>
                        )}
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
                  <span className="step-label">{labels.companyData}</span>
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

function Field({ name, placeholder, required, type = "text" }: {
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
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

  /*
   * Palette:
   *  page bg      : #0e1420  (deep navy)
   *  card bg      : #141c2e  (rich dark blue)
   *  input bg     : #111827  (slightly lighter navy)
   *  border       : #1e2d47  (muted steel-blue border)
   *  border-hover : #2a3f60
   *  accent       : #0d9488  (teal — unchanged)
   */

  .reg-page {
    font-family: 'DM Sans', sans-serif;
    background: #0e1420;
    min-height: 100vh;
    color: #cbd5e1;
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
      linear-gradient(rgba(99,179,237,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,179,237,.045) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 100%);
  }

  .reg-hero-glow {
    position: absolute;
    top: -160px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 520px;
    background: radial-gradient(ellipse, rgba(13,148,136,.14) 0%, rgba(59,130,246,.06) 40%, transparent 70%);
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
    background: rgba(13,148,136,.1);
    border: 1px solid rgba(13,148,136,.25);
    border-radius: 100px;
    padding: 5px 16px;
    margin-bottom: 22px;
  }

  .reg-hero-title {
    font-size: clamp(26px, 5vw, 46px);
    font-weight: 800;
    letter-spacing: -.025em;
    line-height: 1.08;
    color: #f1f5f9;
    margin: 0 0 16px;
  }

  .reg-hero-sub {
    font-size: 16px;
    color: #94a3b8;
    line-height: 1.65;
    margin: 0;
  }

  /* ── BODY ── */
  .reg-body {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .reg-card {
    background: #141c2e;
    border: 1px solid #1e2d47;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 32px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.03) inset;
  }

  /* ── STEP HEADER ── */
  .step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .step-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .06em;
    color: #0d9488;
    background: rgba(13,148,136,.1);
    border: 1px solid rgba(13,148,136,.2);
    border-radius: 6px;
    padding: 3px 9px;
  }

  .step-label {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: .01em;
  }

  /* ── BETA BANNER ── */
  .beta-banner {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    background: rgba(13,148,136,.07);
    border: 1px solid rgba(13,148,136,.18);
    border-radius: 10px;
    padding: 11px 14px;
    margin-bottom: 18px;
    font-size: 12px;
    color: #7dd3cc;
    line-height: 1.55;
  }

  .beta-banner svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #0d9488;
  }

  /* ── PACKAGES ── */
  .pkg-section {
    padding: 32px 32px 30px;
    border-bottom: 1px solid #1e2d47;
  }

  @media (max-width: 640px) { .pkg-section { padding: 24px 18px; } }

  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    align-items: stretch;
  }

  @media (max-width: 860px) { .pkg-grid { grid-template-columns: 1fr; } }

  .pkg-card {
    position: relative;
    background: #111827;
    border: 1px solid #1e2d47;
    border-radius: 16px;
    padding: 22px 20px 20px;
    text-align: left;
    cursor: pointer;
    transition: border-color .18s, transform .15s, box-shadow .18s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .pkg-card:hover:not(:disabled) {
    border-color: #2a3f60;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,.3);
  }

  /* Locked / disabled card */
  .pkg-card--locked {
    cursor: default;
    opacity: .7;
    background: #0e1520;
    border-style: dashed;
    border-color: #1e2d47;
  }

  .pkg-card--locked .pkg-price {
    color: #64748b;
    font-size: 16px;
  }

  .pkg-card--locked .pkg-list li {
    opacity: .6;
  }

  .pkg-card--on {
    border-color: var(--acc) !important;
    border-style: solid;
    background: color-mix(in srgb, var(--acc) 6%, #111827);
    box-shadow: 0 0 0 1px var(--acc), 0 12px 40px color-mix(in srgb, var(--acc) 16%, transparent);
    transform: translateY(-3px);
  }

  .pkg-glow {
    position: absolute;
    top: -50px; right: -50px;
    width: 140px; height: 140px;
    background: radial-gradient(circle, color-mix(in srgb, var(--acc) 22%, transparent), transparent 70%);
    opacity: 0;
    transition: opacity .25s;
    pointer-events: none;
  }

  .pkg-card--on .pkg-glow { opacity: 1; }

  .pkg-top-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 22px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .pkg-featured-badge {
    display: inline-flex;
    align-items: center;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #93c5fd;
    background: rgba(59,130,246,.1);
    border: 1px solid rgba(59,130,246,.22);
    border-radius: 100px;
    padding: 3px 9px;
  }

  .pkg-featured-badge--locked {
    color: #fcd34d;
    background: rgba(245,158,11,.1);
    border-color: rgba(245,158,11,.25);
  }

  .pkg-lock-icon {
    display: inline-flex;
    align-items: center;
    color: #475569;
    margin-left: auto;
  }

  .pkg-locked-note {
    font-size: 11.5px;
    color: #94a3b8;
    line-height: 1.6;
    background: rgba(245,158,11,.04);
    border: 1px solid rgba(245,158,11,.1);
    border-radius: 9px;
    padding: 10px 12px;
    margin: 0 0 16px;
    flex-shrink: 0;
  }

  .pkg-selected-badge {
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
  }

  .pkg-title {
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 12px;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .pkg-card--on .pkg-title { color: var(--acc); }

  .pkg-price-wrap {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 9px;
    padding: 10px 13px;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .pkg-price {
    font-family: 'DM Mono', monospace;
    font-size: 20px;
    font-weight: 500;
    color: #f1f5f9;
    display: block;
    line-height: 1.2;
  }

  .pkg-sub {
    font-size: 11px;
    color: #94a3b8;
    display: block;
    margin-top: 3px;
  }

  .pkg-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .pkg-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12.5px;
    color: #cbd5e1;
    line-height: 1.45;
  }

  .pkg-list li svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--acc);
    opacity: 1;
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
    background: #111827;
    border: 1px solid #1e2d47;
    border-radius: 11px;
    padding: 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #cbd5e1;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
    box-sizing: border-box;
  }

  .reg-input::placeholder { color: #2a3f60; }

  .reg-input:focus {
    border-color: rgba(13,148,136,.6);
    box-shadow: 0 0 0 3px rgba(13,148,136,.1);
  }

  .select-wrap {
    position: relative;
    margin-bottom: 12px;
  }

  .reg-select {
    width: 100%;
    appearance: none;
    background: #111827;
    border: 1px solid #1e2d47;
    border-radius: 11px;
    padding: 12px 40px 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #cbd5e1;
    outline: none;
    cursor: pointer;
    transition: border-color .18s, box-shadow .18s;
  }

  .reg-select option { background: #141c2e; }

  .reg-select:focus {
    border-color: rgba(13,148,136,.6);
    box-shadow: 0 0 0 3px rgba(13,148,136,.1);
  }

  .select-chevron {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #2a3f60;
    pointer-events: none;
  }

  .reg-textarea {
    width: 100%;
    background: #111827;
    border: 1px solid #1e2d47;
    border-radius: 11px;
    padding: 12px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #cbd5e1;
    outline: none;
    resize: vertical;
    transition: border-color .18s, box-shadow .18s;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  .reg-textarea::placeholder { color: #2a3f60; }

  .reg-textarea:focus {
    border-color: rgba(13,148,136,.6);
    box-shadow: 0 0 0 3px rgba(13,148,136,.1);
  }

  .privacy-row {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    background: rgba(255,255,255,.02);
    border: 1px solid #1e2d47;
    border-radius: 11px;
    padding: 13px 15px;
    cursor: pointer;
    font-size: 12.5px;
    color: #94a3b8;
    line-height: 1.55;
    margin-bottom: 14px;
  }

  .privacy-check {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: #0d9488;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .reg-input::placeholder { color: #3d5578; }
  .reg-textarea::placeholder { color: #3d5578; }
  .reg-select { color: #cbd5e1; }

  .submit-btn {
    width: 100%;
    background: #0d9488;
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
    background: linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 55%);
    pointer-events: none;
  }

  .submit-btn:hover:not(:disabled) {
    background: #0b7c72;
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(13,148,136,.3);
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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

  .success-page {
    font-family: 'DM Sans', sans-serif;
    background: #0e1420;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 20px 80px;
  }

  .success-card {
    background: #141c2e;
    border: 1px solid #1e2d47;
    border-radius: 22px;
    max-width: 680px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 8px 48px rgba(0,0,0,.45);
  }

  /* ── HEADER ── */
  .sc-header {
    padding: 48px 40px 32px;
    text-align: center;
    border-bottom: 1px solid #1e2d47;
  }

  .sc-icon {
    width: 60px; height: 60px;
    background: rgba(13,148,136,.12);
    border: 1px solid rgba(13,148,136,.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2dd4bf;
    margin: 0 auto 20px;
  }

  .sc-badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin: 0 0 10px;
  }

  .sc-title {
    font-size: 30px;
    font-weight: 800;
    color: #f8fafc;
    letter-spacing: -.025em;
    margin: 0 0 14px;
    line-height: 1.1;
  }

  .sc-intro {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.65;
    margin: 0;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── BLOCKS ── */
  .sc-block {
    padding: 28px 40px;
    border-bottom: 1px solid #1e2d47;
  }

  .sc-block--buyer {
    background: rgba(16,185,129,.03);
  }

  .sc-block--seller {
    background: rgba(59,130,246,.03);
  }

  .sc-block-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .sc-block-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sc-block-dot--green { background: #10b981; }
  .sc-block-dot--blue  { background: #3b82f6; }

  .sc-block-label {
    font-size: 13px;
    font-weight: 700;
    color: #e2e8f0;
    line-height: 1.3;
  }

  /* ── STEPS ── */
  .sc-steps {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sc-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    font-size: 13.5px;
    color: #cbd5e1;
    line-height: 1.6;
  }

  .sc-step-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: #475569;
    background: rgba(255,255,255,.04);
    border: 1px solid #1e2d47;
    border-radius: 5px;
    padding: 2px 7px;
    flex-shrink: 0;
    margin-top: 2px;
    letter-spacing: .04em;
  }

  /* ── FOOTER ── */
  .sc-footer {
    padding: 28px 40px 40px;
    text-align: center;
  }

  .sc-closing {
    font-size: 13.5px;
    font-weight: 600;
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0 0 8px;
  }

  .sc-wish {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 28px;
  }

  .sc-btn {
    display: inline-block;
    background: #0d9488;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 13px 32px;
    border-radius: 10px;
    text-decoration: none;
    letter-spacing: .02em;
    transition: background .18s, transform .14s;
  }

  .sc-btn:hover {
    background: #0b7c72;
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .sc-header, .sc-block, .sc-footer { padding-left: 22px; padding-right: 22px; }
    .sc-title { font-size: 24px; }
  }
`;
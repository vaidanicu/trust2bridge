"use client";

import { useState } from "react";
import {
  Mail,
  Building2,
  Send,
  User,
  MessageSquare,
  Phone,
  ShieldCheck,
  Globe2,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Lang = "de" | "ro" | "hu";

export default function ContactForm({ lang }: { lang: Lang }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    privacy: false,
  });

  const translations = {
    de: {
      badge: "Kontaktformular",
      title: "Senden Sie uns eine Nachricht",
      subtitle:
        "Kontaktieren Sie unser TrustBridge B2B Team bezüglich Anbieter-Paketen, Beschaffungsanfragen oder strategischen B2B-Partnerschaften.",
      name: "Vollständiger Name",
      email: "Geschäftliche E-Mail",
      phone: "Telefonnummer",
      phonePlaceholder: "+49 123 456 789",
      company: "Firma",
      message: "Nachricht",
      namePlaceholder: "Max Mustermann",
      emailPlaceholder: "office@firma.de",
      companyPlaceholder: "Ihre Firma",
      messagePlaceholder: "Beschreiben Sie Ihre Anfrage...",
      button: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Ihre Nachricht wurde erfolgreich gesendet.",
      error:
        "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      privacyRequired:
        "Bitte akzeptieren Sie die Datenschutzerklärung, bevor Sie die Nachricht senden.",
      privacyAgreement:
        "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.",
      infoBadge: "TrustBridge B2B",
      infoTitle: "Strategisches B2B Beschaffungsnetzwerk",
      infoText:
        "Wir verbinden Anbieter, Käufer und Beschaffungspartner in Deutschland, Ungarn und Rumänien über eine sichere RFQ- und Sourcing-Plattform.",
      businessEmail: "Geschäfts E-Mail",
      regions: "Regionen",
      services: "Dienstleistungen",
      privacy: "Datenschutz & GDPR",
      privacyText: "Ihre Daten werden vertraulich verarbeitet.",
      servicesText: "RFQ • Sourcing • Beschaffung • B2B Matching",
    },

    ro: {
      badge: "Formular de contact",
      title: "Trimite-ne un mesaj",
      subtitle:
        "Contactează echipa TrustBridge B2B pentru pachete furnizori, cereri de achiziție sau parteneriate strategice B2B.",
      name: "Nume complet",
      email: "Email business",
      phone: "Număr de telefon",
      phonePlaceholder: "+40 700 000 000",
      company: "Companie",
      message: "Mesaj",
      namePlaceholder: "Ion Popescu",
      emailPlaceholder: "office@firma.ro",
      companyPlaceholder: "Compania dvs.",
      messagePlaceholder: "Descrieți cererea dvs...",
      button: "Trimite mesajul",
      sending: "Se trimite...",
      success: "Mesajul dvs. a fost trimis cu succes.",
      error:
        "Mesajul nu a putut fi trimis. Vă rugăm să încercați din nou.",
      privacyRequired:
        "Vă rugăm să acceptați politica de confidențialitate înainte de trimitere.",
      privacyAgreement:
        "Am citit politica de confidențialitate și sunt de acord cu procesarea datelor mele.",
      infoBadge: "TrustBridge B2B",
      infoTitle: "Rețea Strategică B2B de Achiziții",
      infoText:
        "Conectăm furnizori, cumpărători și parteneri de achiziții din Germania, Ungaria și România printr-o platformă securizată RFQ și sourcing.",
      businessEmail: "Email Business",
      regions: "Regiuni",
      services: "Servicii",
      privacy: "Confidențialitate & GDPR",
      privacyText: "Datele dvs. sunt procesate confidențial.",
      servicesText: "RFQ • Sourcing • Achiziții • B2B Matching",
    },

    hu: {
      badge: "Kapcsolati űrlap",
      title: "Küldjön nekünk üzenetet",
      subtitle:
        "Vegye fel a kapcsolatot a TrustBridge B2B csapatával beszállítói csomagokkal, beszerzési ajánlatkérésekkel vagy stratégiai B2B partnerségekkel kapcsolatban.",
      name: "Teljes név",
      email: "Üzleti email",
      phone: "Telefonszám",
      phonePlaceholder: "+36 70 000 0000",
      company: "Cég",
      message: "Üzenet",
      namePlaceholder: "Kiss János",
      emailPlaceholder: "office@ceg.hu",
      companyPlaceholder: "Az Ön cége",
      messagePlaceholder: "Írja le kérését...",
      button: "Üzenet küldése",
      sending: "Küldés folyamatban...",
      success: "Üzenetét sikeresen elküldtük.",
      error:
        "Az üzenetet nem sikerült elküldeni. Kérjük, próbálja újra.",
      privacyRequired:
        "Kérjük, fogadja el az adatvédelmi tájékoztatót az üzenet elküldése előtt.",
      privacyAgreement:
        "Elolvastam az adatvédelmi tájékoztatót, és hozzájárulok adataim kezeléséhez.",
      infoBadge: "TrustBridge B2B",
      infoTitle: "Stratégiai B2B Beszerzési Hálózat",
      infoText:
        "Beszállítókat, vásárlókat és beszerzési partnereket kötünk össze Németországban, Magyarországon és Romániában egy biztonságos RFQ és sourcing platformon keresztül.",
      businessEmail: "Üzleti Email",
      regions: "Régiók",
      services: "Szolgáltatások",
      privacy: "Adatvédelem & GDPR",
      privacyText: "Adatait bizalmasan kezeljük.",
      servicesText: "RFQ • Sourcing • Beszerzés • B2B Matching",
    },
  };

  const t = translations[lang] || translations.de;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, privacy: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.privacy) {
      setError(t.privacyRequired);
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();

      // Câmpuri obligatorii CF7
      body.append("_wpcf7", "187");
      body.append("_wpcf7_version", "5.9");
      body.append("_wpcf7_locale", "en_US");
      body.append("_wpcf7_unit_tag", "wpcf7-f187-p1-o1");
      body.append("_wpcf7_container_post", "0");

      // Câmpurile formularului
      body.append("your-name", form.name);
      body.append("your-email", form.email);
      body.append("your-phone", form.phone);
      body.append("your-company", form.company);
      body.append("your-message", form.message);
      body.append("privacy", form.privacy ? "1" : "");
      body.append("lang", lang);

      const response = await fetch(
        "https://trustbridgeb2b.com/backend/wp-json/contact-form-7/v1/contact-forms/187/feedback",
        { method: "POST", body }
      );

      const data = await response.json();

      if (data.status === "mail_sent") {
        setSuccess(t.success);
        setForm({ name: "", email: "", phone: "", company: "", message: "", privacy: false });
      } else {
        setError(data.message || t.error);
      }
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="relative overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="h-2 w-full bg-gradient-to-r from-[#108280] via-[#16a29f] to-[#0d5c5a]" />

        <div className="p-8 md:p-10">
          <div className="mb-10">
            <span className="inline-flex items-center rounded-full bg-[#108280]/10 text-[#108280] px-4 py-1.5 text-sm font-semibold mb-5">
              {t.badge}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nume */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.name}</label>
              <div className="relative">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t.namePlaceholder}
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/50 pl-14 pr-5 text-gray-900 outline-none transition-all focus:border-[#108280] focus:ring-4 focus:ring-[#108280]/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.email}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={t.emailPlaceholder}
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/50 pl-14 pr-5 text-gray-900 outline-none transition-all focus:border-[#108280] focus:ring-4 focus:ring-[#108280]/10"
                />
              </div>
            </div>

            {/* Telefon - OBLIGATORIU */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.phone}</label>
              <div className="relative">
                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder={t.phonePlaceholder}
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/50 pl-14 pr-5 text-gray-900 outline-none transition-all focus:border-[#108280] focus:ring-4 focus:ring-[#108280]/10"
                />
              </div>
            </div>

            {/* Companie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.company}</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder={t.companyPlaceholder}
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/50 pl-14 pr-5 text-gray-900 outline-none transition-all focus:border-[#108280] focus:ring-4 focus:ring-[#108280]/10"
                />
              </div>
            </div>

            {/* Mesaj */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.message}</label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-5 top-6 text-gray-400" />
                <textarea
                  rows={6}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder={t.messagePlaceholder}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-14 pr-5 py-5 text-gray-900 outline-none transition-all resize-none focus:border-[#108280] focus:ring-4 focus:ring-[#108280]/10"
                />
              </div>
            </div>

            {/* Privacy */}
            <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 cursor-pointer hover:border-[#108280]/40 transition-all">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={handlePrivacyChange}
                required
                className="mt-1 h-5 w-5 rounded border-gray-300 accent-[#108280]"
              />
              <span className="text-sm text-gray-600 leading-relaxed">{t.privacyAgreement}</span>
            </label>

            {success && (
              <div className="flex items-center gap-3 rounded-2xl bg-green-50 text-green-700 border border-green-100 px-5 py-4 text-sm font-medium">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-50 text-red-700 border border-red-100 px-5 py-4 text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden w-full h-14 rounded-2xl bg-[#108280] hover:bg-[#0c6665] transition-all duration-300 text-white font-semibold shadow-[0_15px_40px_rgba(16,130,128,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  t.sending
                ) : (
                  <>
                    {t.button}
                    <Send size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Panoul informativ */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#108280] text-white shadow-[0_20px_60px_rgba(16,130,128,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />

        <div className="relative p-10 h-full flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-6">
              {t.infoBadge}
            </span>
            <h3 className="text-4xl font-bold leading-tight mb-6">{t.infoTitle}</h3>
            <p className="text-white/85 text-lg leading-relaxed">{t.infoText}</p>
          </div>

          <div className="mt-14 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5">
              <div className="flex items-start gap-4">
                <Mail size={22} className="text-white/80 mt-1" />
                <div>
                  <p className="text-sm text-white/70 mb-1">{t.businessEmail}</p>
                  <a href="mailto:info@trustbridgeb2b.com" className="font-semibold text-lg hover:underline">
                    info@trustbridgeb2b.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5">
              <div className="flex items-start gap-4">
                <Globe2 size={22} className="text-white/80 mt-1" />
                <div>
                  <p className="text-sm text-white/70 mb-1">{t.regions}</p>
                  <p className="font-semibold text-lg">Deutschland • Magyarország • România</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5">
              <div className="flex items-start gap-4">
                <BriefcaseBusiness size={22} className="text-white/80 mt-1" />
                <div>
                  <p className="text-sm text-white/70 mb-1">{t.services}</p>
                  <p className="font-semibold text-lg">{t.servicesText}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5">
              <div className="flex items-start gap-4">
                <ShieldCheck size={22} className="text-white/80 mt-1" />
                <div>
                  <p className="text-sm text-white/70 mb-1">{t.privacy}</p>
                  <p className="font-semibold text-lg">{t.privacyText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
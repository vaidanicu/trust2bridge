"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lang = "de" | "ro" | "hu";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const rawLang = pathname.split("/")[1] || "de";
  const lang: Lang = (["ro", "hu", "de"].includes(rawLang) ? rawLang : "de") as Lang;

  const translations = {
    de: {
      title: "Datenschutz & Cookies",
      text: "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu optimieren și Inhalte zu personalisieren.",
      accept: "Alle akzeptieren",
      reject: "Nur essenzielle",
      policy: "Cookie-Richtlinie",
    },
    ro: {
      title: "Confidențialitate și Cookie-uri",
      text: "Utilizăm cookie-uri pentru a optimiza experiența pe site-ul nostru și pentru a personaliza conținutul publicat.",
      accept: "Acceptă tot",
      reject: "Doar esențiale",
      policy: "Politica de Confidențialitate",
    },
    hu: {
      title: "Adatvédelem és Cookie-k",
      text: "Sütiket használunk a weboldalunk élményének optimalizálása és a tartalom személyre szabása érdekében.",
      accept: "Mindent elfogadok",
      reject: "Csak a szükségeseket",
      policy: "Süti szabályzat",
    },
  };

  const t = translations[lang];

  useEffect(() => {
    const consent = localStorage.getItem("tb_cookie_consent");
    if (!consent) {
      // Un mic delay pentru o experiență mai puțin intruzivă
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (status: "accepted" | "rejected") => {
    localStorage.setItem("tb_cookie_consent", status);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] w-[92%] max-w-4xl -translate-x-1/2 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1f1f]/90 p-6 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        
        {/* Element decorativ subtil în fundal */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#4fd1cf]/10 blur-3xl" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {t.title}
            </h3>
            <p className="max-w-2xl text-[14px] leading-relaxed text-white/70">
              {t.text}{" "}
              <Link
                href={`/${lang}/privacy`}
                className="inline-block font-medium text-[#4fd1cf] underline-offset-4 hover:underline"
              >
                {t.policy}
              </Link>
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row lg:flex-nowrap">
            <button
              onClick={() => handleConsent("rejected")}
              className="group relative flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-[13px] font-bold text-white/80 transition-all hover:bg-white/10 active:scale-95"
            >
              {t.reject}
            </button>

            <button
              onClick={() => handleConsent("accepted")}
              className="flex h-12 items-center justify-center rounded-xl bg-[#108280] px-8 text-[13px] font-bold text-white shadow-lg shadow-[#108280]/20 transition-all hover:bg-[#14a3a1] hover:shadow-[#14a3a1]/30 active:scale-95"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
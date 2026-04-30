"use client";

import Link from "next/link";
import Image from "next/image";
import BasketCounter from "./BasketLink";
import { ChevronDown, MessageCircle, Globe, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ dict, lang }: { dict: any, lang: string }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificăm dacă utilizatorul este logat
  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    setIsLoggedIn(!!token);
  }, [pathname]); // Re-verificăm la fiecare schimbare de pagină

  const getLanguagePath = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
        
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <Link href={`/${lang}`} className="group relative block overflow-hidden rounded-md">
            <Image
              src="/poze/logo.jpeg"
              alt="TrustBridge Logo"
              width={180}
              height={50}
              className="h-12 w-32 object-cover object-center scale-150 md:h-14 md:w-40"
              priority
            />
          </Link>
        </div>

        {/* NAVIGATION CENTRALĂ */}
        <nav className="hidden items-center gap-7 text-[14px] font-semibold text-slate-600 lg:flex">
          <Link href={`/${lang}/marketplace`} className="transition-colors hover:text-[#108280]">
            {dict.nav.marketplace}
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 py-3 transition-colors hover:text-[#108280]">
              {dict.nav.what_to_do}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-0 top-[95%] z-50 w-72 translate-y-2 rounded-xl border border-slate-100 bg-white p-1.5 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link href={`/${lang}/marketplace`} className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50">
                <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">{dict.nav.buy}</span>
                <span className="text-[11px] text-slate-500">{dict.nav.buy_desc}</span>
              </Link>

              <Link href={`/${lang}/offer-create`} className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50">
                <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">{dict.nav.search}</span>
                <span className="text-[11px] text-slate-500">{dict.nav.search_desc}</span>
              </Link>
            </div>
          </div>

          <Link href={`/${lang}/about`} className="transition-colors hover:text-[#108280]">
            {dict.nav.about}
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="group relative mr-2 flex items-center gap-1 cursor-pointer rounded-md px-2 py-1 hover:bg-slate-100">
            <Globe className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold uppercase">{lang}</span>
            <div className="invisible absolute right-0 top-full mt-1 w-20 rounded-lg border border-slate-100 bg-white p-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
              {['de', 'ro', 'hu'].map((l) => (
                <Link key={l} href={getLanguagePath(l)} className={`block px-3 py-1.5 text-xs font-bold uppercase hover:text-[#108280] ${lang === l ? 'text-[#108280]' : 'text-slate-600'}`}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <Link href={`/${lang}/contact`} className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-[#108280] hover:text-[#108280] md:flex">
            <MessageCircle className="h-3.5 w-3.5" />
            {dict.nav.contact}
          </Link>

          {/* LOGICĂ CONDIȚIONALĂ: DASHBOARD vs LOGIN/REGISTER */}
          {isLoggedIn ? (
            <Link 
              href={`/${lang}/dashboard`} 
              className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
            >
              <User className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={`/${lang}/login`} className="hidden px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#108280] md:block">
                {dict.nav.login}
              </Link>

              <Link href={`/${lang}/register`} className="hidden rounded-full bg-[#108280] px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0d6b69] hover:shadow-lg active:scale-95 md:block">
                {dict.nav.register}
              </Link>
            </>
          )}

          <div className="ml-1 shrink-0">
            <BasketCounter dict={dict} lang={lang} />
          </div>
        </div>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import BasketCounter from "./BasketLink";
import { ChevronDown, MessageCircle, Globe, User, Menu, X, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ dict, lang }: { dict: any; lang: string }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [whatToDoOpen, setWhatToDoOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setWhatToDoOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const getLanguagePath = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-[#f7f7f7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">

          {/* LOGO */}
          <div className="flex shrink-0 items-center">
            <Link href={`/${lang}`} className="relative block overflow-hidden rounded-md">
              <Image
                src="/poze/logo.png"
                alt="TrustBridge Logo"
                width={180}
                height={50}
                className="h-10 w-28 object-cover object-center scale-150 md:h-14 md:w-40"
                priority
              />
            </Link>
          </div>

          {/* NAVIGATION CENTRALĂ — desktop only */}
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
                <Link href={`/${lang}/marketplace?smart=1`} className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50">
                  <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">{dict.nav.Anbiten}</span>
                  <span className="text-[11px] text-slate-500">{dict.nav.Anbiten}</span>
                </Link>
                <Link href={`/${lang}/offer-create`} className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50">
                  <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">{dict.nav.search}</span>
                  <span className="text-[11px] text-slate-500">{dict.nav.search_desc}</span>
                </Link>
              </div>
            </div>

            <Link href={`/${lang}/Uberuns`} className="transition-colors hover:text-[#108280]">
              {dict.nav.about}
            </Link>
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Language Switcher — desktop only */}
            <div className="group relative mr-1 hidden cursor-pointer items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-100 lg:flex">
              <Globe className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold uppercase">{lang}</span>
              <div className="invisible absolute right-0 top-full mt-1 w-20 rounded-lg border border-slate-100 bg-white p-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                {["de", "ro", "hu"].map((l) => (
                  <Link key={l} href={getLanguagePath(l)}
                    className={`block px-3 py-1.5 text-xs font-bold uppercase hover:text-[#108280] ${lang === l ? "text-[#108280]" : "text-slate-600"}`}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact — desktop only */}
            <Link href={`/${lang}/contact`}
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-[#108280] hover:text-[#108280] lg:flex">
              <MessageCircle className="h-3.5 w-3.5" />
              {dict.nav.contact}
            </Link>

            {/* Login / Register / Dashboard — desktop only */}
            {isLoggedIn ? (
              <Link href={`/${lang}/dashboard`}
                className="hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 lg:flex">
                <User className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={`/${lang}/login`}
                  className="hidden px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#108280] lg:block">
                  {dict.nav.login}
                </Link>
                <Link href={`/${lang}/register`}
                  className="hidden rounded-full bg-[#108280] px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0d6b69] hover:shadow-lg active:scale-95 lg:block">
                  {dict.nav.register}
                </Link>
              </>
            )}

            {/* Basket — desktop: text+count, mobile: icon+badge */}
            <div className="hidden lg:block ml-1 shrink-0">
              <BasketCounter dict={dict} lang={lang} />
            </div>
            <div className="lg:hidden shrink-0">
              <BasketCounter dict={dict} lang={lang} iconOnly />
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:border-[#108280] hover:text-[#108280] lg:hidden"
              aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
            >
              {mobileOpen
                ? <X className="h-6 w-6 text-slate-700" />
                : <Menu className="h-6 w-6 text-slate-700" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE DRAWER ===== */}
      {/* Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[82vw] max-w-[320px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link href={`/${lang}`} onClick={() => setMobileOpen(false)}>
            <Image
              src="/poze/logo.png"
              alt="TrustBridge Logo"
              width={140}
              height={40}
              className="h-9 w-24 object-cover object-center scale-150"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Închide"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col py-2">

          <Link href={`/${lang}/marketplace`} onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:text-[#108280]">
            {dict.nav.marketplace}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          {/* What to do — accordion */}
          <div className="border-b border-slate-100">
            <button
              onClick={() => setWhatToDoOpen(!whatToDoOpen)}
              className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:text-[#108280]"
            >
              {dict.nav.what_to_do}
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${whatToDoOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${whatToDoOpen ? "max-h-64" : "max-h-0"}`}>
              <div className="bg-slate-50 pb-2">
                <Link href={`/${lang}/marketplace`} onClick={() => setMobileOpen(false)}
                  className="block px-8 py-3 hover:text-[#108280]">
                  <span className="block text-sm font-bold text-slate-900">{dict.nav.buy}</span>
                  <span className="text-[11px] text-slate-500">{dict.nav.buy_desc}</span>
                </Link>
                <Link href={`/${lang}/marketplace?smart=1`} onClick={() => setMobileOpen(false)}
                  className="block border-t border-slate-100 px-8 py-3 hover:text-[#108280]">
                  <span className="block text-sm font-bold text-slate-900">{dict.nav.Anbiten}</span>
                  <span className="text-[11px] text-slate-500">{dict.nav.Anbiten}</span>
                </Link>
                <Link href={`/${lang}/offer-create`} onClick={() => setMobileOpen(false)}
                  className="block border-t border-slate-100 px-8 py-3 hover:text-[#108280]">
                  <span className="block text-sm font-bold text-slate-900">{dict.nav.search}</span>
                  <span className="text-[11px] text-slate-500">{dict.nav.search_desc}</span>
                </Link>
              </div>
            </div>
          </div>

          <Link href={`/${lang}/Uberuns`} onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:text-[#108280]">
            {dict.nav.about}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link href={`/${lang}/contact`} onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:text-[#108280]">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              {dict.nav.contact}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="border-t border-slate-100 px-5 py-5">
          {isLoggedIn ? (
            <Link href={`/${lang}/dashboard`} onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-bold text-white shadow-md active:scale-95">
              <User className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href={`/${lang}/register`} onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-[#108280] py-3 text-sm font-bold text-white shadow-md active:scale-95">
                {dict.nav.register}
              </Link>
              <Link href={`/${lang}/login`} onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-slate-200 py-3 text-sm font-bold text-slate-700 active:scale-95">
                {dict.nav.login}
              </Link>
            </div>
          )}
        </div>

        {/* Language switcher */}
        <div className="border-t border-slate-100 px-5 pb-8 pt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Sprache / Limbă / Nyelv
          </p>
          <div className="flex gap-2">
            {["de", "ro", "hu"].map((l) => (
              <Link key={l} href={getLanguagePath(l)} onClick={() => setMobileOpen(false)}
                className={`flex-1 rounded-lg border py-2 text-center text-xs font-bold uppercase transition-all ${
                  lang === l
                    ? "border-[#108280] bg-[#108280] text-white"
                    : "border-slate-200 text-slate-600 hover:border-[#108280] hover:text-[#108280]"
                }`}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
import Link from "next/link";
import Image from "next/image";
import BasketCounter from "./BasketLink";
import { ChevronDown, MessageCircle } from "lucide-react"; // Am adăugat un icon discret pentru contact

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5"> {/* Padding redus de la py-4 la py-2.5 */}
        
        {/* LOGO */}
      <div className="flex shrink-0 items-center">
  <Link href="/" className="group relative block overflow-hidden rounded-md">
    <Image
      src="/poze/logo.jpeg"
      alt="TrustBridge Logo"
      width={180} // Creștem lățimea totală
      height={50} 
      className="h-12 w-32 object-cover object-center scale-150 md:h-14 md:w-40" 
      // scale-150 mărește conținutul imaginii pentru a elimina marginile albe ale fișierului .jpeg
      priority
    />
  </Link>
</div>

        {/* NAVIGATION CENTRALĂ */}
        <nav className="hidden items-center gap-7 text-[14px] font-semibold text-slate-600 lg:flex">
          <Link href="/marketplace" className="transition-colors hover:text-[#108280]">
            Marketplace
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 py-3 transition-colors hover:text-[#108280]">
              Was möchten Sie tun?
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>

            {/* DROPDOWN */}
            <div className="invisible absolute left-0 top-[95%] z-50 w-72 translate-y-2 rounded-xl border border-slate-100 bg-white p-1.5 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                href="/marketplace"
                className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50"
              >
                <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">Kaufen</span>
                <span className="text-[11px] text-slate-500">Produkte direkt ansehen</span>
              </Link>

              <Link
                href="/guided-request"
                className="group/item block rounded-lg px-4 py-2.5 transition-colors hover:bg-slate-50"
              >
                <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#108280]">Suche</span>
                <span className="text-[11px] text-slate-500">Anfrage an TrustBridge senden</span>
              </Link>
            </div>
          </div>

          <Link href="/about" className="transition-colors hover:text-[#108280]">
            Über Uns
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Buton Contact - Outline subtil */}
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-[#108280] hover:text-[#108280] md:flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Jetzt kontaktieren
          </Link>

          <div className="hidden h-4 w-[1px] bg-slate-200 md:block mx-1"></div>

          <Link
            href="/login"
            className="hidden px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#108280] md:block"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="hidden rounded-full bg-[#108280] px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0d6b69] hover:shadow-lg active:scale-95 md:block"
          >
            Registrierung
          </Link>

          <div className="ml-1 shrink-0">
            <BasketCounter />
          </div>
        </div>
      </div>
    </header>
  );
}
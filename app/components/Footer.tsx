"use client";

import Link from "next/link";

export default function Footer({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const f = dict.footer;

  const footerText =
    lang === "ro"
      ? {
          network: "REȚEA B2B",
          hours: "Luni - Vineri",
          privacy: "Confidențialitate",
          imprint: "Date companie",
        }
      : lang === "hu"
      ? {
          network: "B2B HÁLÓZAT",
          hours: "Hétfő - Péntek",
          privacy: "Adatvédelem",
          imprint: "Impresszum",
        }
      : {
          network: "B2B NETZWERK",
          hours: "Montag - Freitag",
          privacy: "Datenschutz",
          imprint: "Impressum",
        };

  return (
    <footer className="border-t-4 border-slate-900 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/poze/logo.jpeg"
                alt="TrustBridge Logo"
                className="h-16 w-auto object-contain"
              />

              <div>
                <p className="text-2xl font-black uppercase italic leading-none">
                  TrustBridge
                </p>

                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  {footerText.network}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/70">
              {f.brand_text}
            </p>

            <div className="mt-6 flex gap-3">
              {["DE", "HU", "RO"].map((country) => (
                <span
                  key={country}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs font-black uppercase"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">
              {f.quick_links}
            </h3>

            <div className="mt-5 space-y-4 text-sm font-bold">
              <Link href={`/${lang}/marketplace`} className="block hover:text-[#22c55e]">
                {f.marketplace}
              </Link>

              <Link href={`/${lang}/request-basket`} className="block hover:text-[#22c55e]">
                {f.request_basket}
              </Link>

              <Link href={`/${lang}/about`} className="block hover:text-[#22c55e]">
                {f.about}
              </Link>

              <Link href={`/${lang}/contact`} className="block hover:text-[#22c55e]">
                {f.contact}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">
              {f.services}
            </h3>

            <div className="mt-5 space-y-4 text-sm font-bold">
              <Link href={`/${lang}/marketplace`} className="block hover:text-[#22c55e]">
                {f.buy}
              </Link>

              <Link href={`/${lang}/marketplace?smart=1`} className="block hover:text-[#22c55e]">
                {f.search}
              </Link>

              <Link href={`/${lang}/register`} className="block hover:text-[#22c55e]">
                {f.supplier}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">
              {f.support}
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              <p className="font-bold">
                {f.email}: office@trustbridgeb2b.com
              </p>

              <p className="text-white/60">
                {footerText.hours}
                <br />
                08:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} TrustBridge B2B. {f.rights}
          </p>

          <div className="flex gap-6">
            <Link href={`/${lang}/privacy`} className="hover:text-white">
              {footerText.privacy}
            </Link>

            

            <Link href={`/${lang}/imprint`} className="hover:text-white">
              {footerText.imprint}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
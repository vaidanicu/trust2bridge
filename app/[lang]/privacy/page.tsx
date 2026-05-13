import type { Metadata } from "next";

import privacyDe from "@/lib/privacy/de";
import privacyHu from "@/lib/privacy/hu";
import privacyRo from "@/lib/privacy/ro";

export const metadata: Metadata = {
  title: "Privacy Policy | TrustBridge B2B",
  description: "Privacy Policy for TrustBridge Portal.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const translations = {
    de: privacyDe,
    hu: privacyHu,
    ro: privacyRo,
  };

  const t = translations[lang as keyof typeof translations] || translations.ro;

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans pb-20">
      <section className="border-b-4 border-slate-900 bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center md:text-left">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            {t.portalName}
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black uppercase italic leading-tight">
            {t.title}
          </h1>

          <p className="mt-4 text-white/60 font-bold">{t.lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 -mt-8">
        <div className="mb-12 rounded-3xl border-4 border-slate-900 bg-[#FFD54F] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-2xl font-black uppercase flex items-center">
            <span className="mr-3 text-3xl">💡</span> {t.summaryHeader}
          </h2>

          <p className="mb-6 font-bold text-slate-900 text-lg">
            {t.summaryIntro}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {t.summaryPoints.map((point: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start bg-white/50 p-4 rounded-xl border-2 border-slate-900/10"
              >
                <span className="mr-3 mt-1 text-[#0b5f5d] font-black">✓</span>
                <p className="font-bold text-slate-800 leading-snug">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-4 border-slate-900 bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-12">
          <h3 className="mb-8 text-xl font-black uppercase text-slate-400 border-b-2 border-slate-100 pb-4">
            {t.fullPolicyLabel}
          </h3>

          <div className="whitespace-pre-line text-base md:text-lg leading-relaxed text-slate-700 font-medium">
            {t.content}
          </div>
        </div>
      </section>
    </main>
  );
}
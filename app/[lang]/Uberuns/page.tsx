import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Über uns | TrustBridge B2B",
  description:
    "Erfahren Sie mehr über TrustBridge und unser Modell für vertrauensbasierte B2B-Beschaffung.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const translations = {
    ro: {
      title: "Despre Noi",
      subtitle:
        "Conectăm piețele din Europa Centrală și de Est cu restul lumii.",
      missionTitle: "Misiunea Noastră",
      missionText:
        "TrustBridge Portal este conceput pentru un model de afaceri în care nu doar facem vizibili furnizorii și clienții, ci și structurăm cererile, pre-calificăm partenerii și oferim suport în soluționarea conflictelor.",
      valuesTitle: "Valorile TrustBridge",
      founderTeaserTitle:
        "De ce a fost creat acest portal și de ce ar trebui să lucreze în avantajul dumneavoastră",
      founderTeaserText:
        "Un cuvânt din partea fondatorului despre încredere, achiziții, responsabilitate și de ce TrustBridge începe acolo unde majoritatea platformelor se opresc.",
      founderButton: "Citiți prezentarea fondatorului",
      values: [
        {
          title: "Transparență",
          desc: "Procesele de calificare a furnizorilor și partenerii regionali sunt integrați într-un mod clar și trasabil.",
        },
        {
          title: "Securitate",
          desc: "Luăm măsuri tehnice și organizatorice riguroase pentru a proteja integritatea și confidențialitatea datelor dumneavoastră.",
        },
        {
          title: "Eficiență",
          desc: "Utilizăm traduceri automate și structurarea datelor pentru a optimiza procesele de achiziție și matching.",
        },
      ],
      contactTitle: "Contact",
    },

    hu: {
      title: "Rólunk",
      subtitle:
        "Összekötjük Közép- és Kelet-Európa piacait a világ többi részével.",
      missionTitle: "Küldetésünk",
      missionText:
        "A TrustBridge Portált egy olyan üzleti modellre szabtuk, ahol nemcsak láthatóvá tesszük a beszállítókat és ügyfeleket, hanem strukturáljuk az ajánlatkéréseket, előminősítjük a partnereket és támogatást nyújtunk konfliktushelyzetekben is.",
      valuesTitle: "TrustBridge Értékek",
      founderTeaserTitle:
        "Miért jött létre ez a portál, és miért érdemes Önnek is használnia",
      founderTeaserText:
        "Egy szó az alapítótól a bizalomról, beszerzésről, felelősségről és arról, miért ott kezdjük, ahol a legtöbb platform megáll.",
      founderButton: "Az alapítói bemutatkozás elolvasása",
      values: [
        {
          title: "Átláthatóság",
          desc: "A beszállítói minősítési folyamatok és a regionális partnerek bevonása nyomon követhető módon történik.",
        },
        {
          title: "Biztonság",
          desc: "Szigorú technikai intézkedéseket teszünk az adatok integritásának és bizalmasságának védelme érdekében.",
        },
        {
          title: "Hatékonyság",
          desc: "Automatizált fordításokat és adatstrukturálást használunk a beszerzési és párosítási folyamatok optimalizálására.",
        },
      ],
      contactTitle: "Kapcsolat",
    },

    de: {
      title: "Über uns",
      subtitle:
        "Wir verbinden die Märkte Mittel- und Osteuropas mit der Welt.",
      missionTitle: "Unsere Mission",
      missionText:
        "TrustBridge ist auf ein Geschäftsmodell zugeschnitten, bei dem wir Anbieter und Kunden sichtbar machen, Anfragen strukturieren, Anbieter vorqualifizieren und auch bei Konfliktlösung und Mediation unterstützen.",
      valuesTitle: "TrustBridge Werte",
      founderTeaserTitle:
        "Warum das Portal entstanden ist und warum es für Sie arbeiten sollte",
      founderTeaserText:
        "Ein Wort des Gründers über Vertrauen, Beschaffung, Verantwortung und warum TrustBridge dort beginnt, wo die meisten Plattformen aufhören.",
      founderButton: "Beitrag des Gründers lesen",
      values: [
        {
          title: "Transparenz",
          desc: "Anbieterqualifizierung und die Einbindung regionaler Partner erfolgen transparent und nachvollziehbar.",
        },
        {
          title: "Sicherheit",
          desc: "Wir treffen angemessene technische Maßnahmen, um die Vertraulichkeit und Integrität Ihrer Daten zu schützen.",
        },
        {
          title: "Effizienz",
          desc: "Wir nutzen automatische Übersetzungen und Datenstrukturierung, um Beschaffungsprozesse effizient zu organisieren.",
        },
      ],
      contactTitle: "Kontakt",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.de;

  return (
    <main className="min-h-screen bg-[#f4f6f8] pb-20 font-sans text-slate-900">
      <section className="border-b-4 border-slate-900 bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-black uppercase italic leading-tight md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium text-white/80 md:text-2xl">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-5xl px-6">
        <div className="mb-12 rounded-3xl border-4 border-slate-900 bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-12">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight text-[#0b5f5d]">
            {t.missionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
            {t.missionText}
          </p>
        </div>

        <Link
          href={`/${lang}/Uberuns/founder`}
          className="mb-14 block rounded-3xl border-4 border-slate-900 bg-cyan-300 p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] md:p-10"
        >
          <p className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900">
            Founder Story
          </p>
          <h2 className="text-3xl font-black uppercase italic text-slate-950 md:text-4xl">
            {t.founderTeaserTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-lg font-bold leading-relaxed text-slate-800">
            {t.founderTeaserText}
          </p>
          <span className="mt-7 inline-block rounded-xl bg-slate-950 px-6 py-4 text-sm font-black uppercase tracking-wider text-white">
            {t.founderButton}
          </span>
        </Link>

        <h2 className="mb-8 text-center text-3xl font-black uppercase md:text-left">
          {t.valuesTitle}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {t.values.map((val, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-4 border-slate-900 bg-[#FFD54F] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="mb-3 text-xl font-black uppercase italic">
                {val.title}
              </h3>
              <p className="font-bold text-slate-800">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border-4 border-slate-900 bg-slate-900 p-8 text-white">
          <h2 className="mb-4 text-2xl font-black uppercase italic">
            {t.contactTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <p className="font-medium text-white/80">
              M&M Kft.
              <br />
              Oroszlán u. 36.
              <br />
              1152 Budapest, Ungaria
            </p>
            <p className="font-medium text-white/80">
              CEO: Alf Martienssen
              <br />
              E-mail: datasec@ttc-group.hu
              <br />
              Web: trustbridgeb2b.com
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
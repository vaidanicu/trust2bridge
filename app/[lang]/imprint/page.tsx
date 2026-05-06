import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | TrustBridge B2B",
  description: "Legal information and company details of TrustBridge B2B.",
};

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const content =
    lang === "ro"
      ? {
          title: "Informații legale (Impressum)",
          operator:
            "Operatorul și responsabilul pentru conținutul site-ului:",
          structure: "Structura platformei",
          contentTitle: "Răspunderea pentru conținut",
          linksTitle: "Răspunderea pentru linkuri",
          copyright: "Drepturi de autor",
          disputes: "Soluționarea litigiilor",
          structureText:
            "Acest portal B2B are scopul de a prezenta și conecta parteneri de afaceri din Germania, Ungaria și România. Companiile partenere prezentate pe platformă sunt entități juridice independente și își desfășoară activitatea pe propria răspundere. Operatorul platformei nu își asumă răspunderea juridică pentru activitatea acestora, cu excepția cazurilor în care se prevede în mod expres altfel.",
          contentText:
            "Conținutul site-ului a fost creat cu cea mai mare atenție. Cu toate acestea, nu putem garanta exactitatea, completitudinea și actualitatea informațiilor.",
          linksText:
            "Site-ul conține linkuri către site-uri externe ale unor terți, asupra cărora nu avem control. Prin urmare, nu ne asumăm responsabilitatea pentru conținutul acestora.",
          copyrightText:
            "Conținutul și lucrările create de operatorul site-ului sunt protejate conform legislației aplicabile privind drepturile de autor.",
          disputesText:
            "Comisia Europeană oferă o platformă pentru soluționarea online a litigiilor:",
          disputesEnd:
            "Nu suntem obligați și nu participăm la proceduri de soluționare a litigiilor în fața unei autorități de mediere a consumatorilor.",
        }
      : lang === "hu"
      ? {
          title: "Jogi nyilatkozat / Impresszum",
          operator:
            "A weboldal üzemeltetője és a tartalomért felelős személy:",
          structure: "A platform működése",
          contentTitle: "Felelősség a tartalomért",
          linksTitle: "Felelősség a linkekért",
          copyright: "Szerzői jog",
          disputes: "Jogvita rendezése",
          structureText:
            "Ez a B2B portál német, magyar és román üzleti partnerek bemutatására és összekapcsolására szolgál. A platformon megjelenő partnercégek jogilag önálló gazdasági szereplők, és saját felelősségükre működnek. Az oldal üzemeltetője nem vállal felelősséget ezek tevékenységéért, kivéve, ha erről kifejezett megállapodás rendelkezik.",
          contentText:
            "Az oldalon található tartalmak a lehető legnagyobb gondossággal készültek. Ennek ellenére nem vállalunk garanciát azok pontosságára, teljességére és aktualitására.",
          linksText:
            "Weboldalunk külső harmadik felek weboldalaira mutató linkeket tartalmaz, amelyek tartalmára nincs befolyásunk. Ezekért nem vállalunk felelősséget.",
          copyrightText:
            "Az oldal tartalma és az üzemeltető által létrehozott anyagok szerzői jogi védelem alatt állnak.",
          disputesText:
            "Az Európai Bizottság online vitarendezési platformot biztosít:",
          disputesEnd:
            "Nem vagyunk kötelesek és nem veszünk részt fogyasztói jogviták alternatív rendezésében.",
        }
      : {
          title: "Impressum",
          operator:
            "Verantwortlich für den Inhalt und Betreiber der Website:",
          structure: "Hinweis zur Plattformstruktur",
          contentTitle: "Haftung für Inhalte",
          linksTitle: "Haftung für Links",
          copyright: "Urheberrecht",
          disputes: "Streitbeilegung",
          structureText:
            "Dieses B2B-Portal dient der Darstellung und Vernetzung von Geschäftspartnern in Deutschland, Ungarn und Rumänien. Die auf der Plattform dargestellten Partnerunternehmen sind rechtlich selbstständige Einheiten und treten eigenverantwortlich am Markt auf. Eine rechtliche Vertretung oder Haftungsübernahme durch den Betreiber dieser Website erfolgt nicht, sofern nicht ausdrücklich anders vereinbart.",
          contentText:
            "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.",
          linksText:
            "Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.",
          copyrightText:
            "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem jeweiligen nationalen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.",
          disputesText:
            "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:",
          disputesEnd:
            "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] border-b-4 border-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            TrustBridge B2B
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase italic">
            {content.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border-4 border-slate-900 bg-white p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#108280]">
                {content.operator}
              </h2>

              <div className="mt-4 space-y-1 text-lg leading-8 text-slate-700">
                <p className="font-bold">Alf Martienssen</p>
                <p>Martienssen és Minőség Kft</p>
                <p>TAX / VAT: HU10880054</p>
                <p>
                  1152 Budapest, Oroszlán u. 36
                  <br />
                  Ungarn / Magyarország
                </p>

                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:info@trustbridgeb2b.com"
                    className="font-bold text-[#108280]"
                  >
                    info@trustbridgeb2b.com
                  </a>
                </p>

                <p>Telefon: +36 20 9326536</p>
              </div>
            </div>

            <Section
              title={content.structure}
              text={content.structureText}
            />

            <Section
              title={content.contentTitle}
              text={content.contentText}
            />

            <Section
              title={content.linksTitle}
              text={content.linksText}
            />

            <Section
              title={content.copyright}
              text={content.copyrightText}
            />

            <div className="rounded-2xl bg-slate-100 p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#108280]">
                {content.disputes}
              </h2>

              <p className="mt-4 leading-8 text-slate-700">
                {content.disputesText}
              </p>

              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                className="mt-3 block font-bold text-[#108280]"
              >
                https://ec.europa.eu/consumers/odr/
              </a>

              <p className="mt-4 leading-8 text-slate-700">
                {content.disputesEnd}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-widest text-[#108280]">
        {title}
      </h2>

      <p className="mt-4 leading-8 text-slate-700">
        {text}
      </p>
    </div>
  );
}
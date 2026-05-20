import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | TrustBridge B2B",
  description:
    "Contact TrustBridge B2B for supplier packages, customer packages and procurement requests.",
};

const CONTENT: Record<string, { chip: string; title: string; desc: string }> = {
  de: {
    chip:  "TrustBridge B2B",
    title: "Kontakt",
    desc:  "Kontaktieren Sie TrustBridge für Fragen zu Anbieter-Paketen, Kunden-Paketen oder Beschaffungsanfragen.",
  },
  ro: {
    chip:  "TrustBridge B2B",
    title: "Contact",
    desc:  "Contactați TrustBridge pentru întrebări despre pachete furnizori, pachete clienți sau cereri de achiziție.",
  },
  hu: {
    chip:  "TrustBridge B2B",
    title: "Kapcsolat",
    desc:  "Lépjen kapcsolatba a TrustBridge-dzsel szállítói csomagokkal, vevői csomagokkal vagy beszerzési kérelmekkel kapcsolatos kérdéseivel.",
  },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const c = CONTENT[lang] ?? CONTENT["de"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7fdfc] to-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center rounded-full bg-[#108280]/10 text-[#108280] px-4 py-1 text-sm font-semibold mb-5">
            {c.chip}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {c.title}
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            {c.desc}
          </p>
        </div>

        <ContactForm lang={lang as "de" | "ro" | "hu"} />
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | TrustBridge B2B",
  description:
    "Contact TrustBridge B2B for supplier packages, customer packages and procurement requests.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7fdfc] to-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center rounded-full bg-[#108280]/10 text-[#108280] px-4 py-1 text-sm font-semibold mb-5">
            TrustBridge B2B
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Kontakt
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Kontaktieren Sie TrustBridge für Fragen zu Anbieter-Paketen,
            Kunden-Paketen oder Beschaffungsanfragen.
          </p>
        </div>

        <ContactForm lang={lang as "de" | "ro" | "hu"} />
      </section>
    </main>
  );
}
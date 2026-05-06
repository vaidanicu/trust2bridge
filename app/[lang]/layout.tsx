import type { Metadata } from "next";
import "../globals.css"; 
import Header from "../components/Header"; // Verifică dacă calea este corectă (de regulă e cu ../..)
import { getDictionary } from "@/lib/dictionary";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "TrustBridge B2B",
    template: "%s | TrustBridge B2B",
  },

  description:
    "B2B sourcing, supplier matching and RFQ platform for buyers and providers across Germany, Hungary and Romania.",

  applicationName: "TrustBridge B2B",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};
export const dynamicParams = false;
// Această funcție este CRUCIALĂ pentru output: export
export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'ro' }, { lang: 'hu' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // 1. Așteptăm rezolvarea params
  const { lang } = await params; 
  
  // 2. Încărcăm dicționarul pentru a-l trimite Header-ului
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');

  return (
    <html lang={lang}>
      <body className="antialiased">
        {/* 3. Trimitem dict și lang către Header */}
        <Header dict={dict} lang={lang} /> 
       
        
        {children}
        <Footer dict={dict} lang={lang} />
        <CookieBanner />
      </body>
       
    </html>
  );
}
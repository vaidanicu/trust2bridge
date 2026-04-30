import type { Metadata } from "next";
import "../globals.css"; 
import Header from "../components/Header"; // Verifică dacă calea este corectă (de regulă e cu ../..)
import { getDictionary } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "TrustBridge B2B",
  description: "B2B Request Basket Platform",
};

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
      </body>
    </html>
  );
}
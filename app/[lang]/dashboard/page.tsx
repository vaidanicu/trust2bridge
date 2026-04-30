import DashboardPage from "./DashboardPage";
import { getDictionary } from "@/lib/dictionary";

// Această funcție obligă Next.js să creeze folderul /hu/ la export
export async function generateStaticParams() {
  return [
    { lang: "de" },
    { lang: "ro" },
    { lang: "hu" }
  ];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Încărcăm dicționarul. Dacă fișierul hu.json există, va merge.
  const dict = await getDictionary(lang as "ro" | "de" | "hu");

  return <DashboardPage dict={dict} lang={lang} />;
}
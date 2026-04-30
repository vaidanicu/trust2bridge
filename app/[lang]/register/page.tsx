import RegisterPage from "./RegisterPage";
import { getDictionary } from "@/lib/dictionary";

// Generăm rutele statice pentru build
export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "de" }, { lang: "hu" }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Încărcăm dicționarul corespunzător limbii
  const dict = await getDictionary(lang as "ro" | "de" | "hu");

  // Trimitem datele către componenta de client
  return <RegisterPage dict={dict} lang={lang} />;
}
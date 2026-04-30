import LoginPage from "./LoginPage";
import { getDictionary } from "@/lib/dictionary";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "ro" | "de" | "hu");

  return <LoginPage dict={dict} lang={lang} />;
}
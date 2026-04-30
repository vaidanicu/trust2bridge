import OfferCreatePage from "./OfferCreatePage";
import { getDictionary } from "@/lib/dictionary";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "de" }, { lang: "hu" }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "ro" | "de" | "hu");

  return <OfferCreatePage dict={dict} lang={lang} />;
}
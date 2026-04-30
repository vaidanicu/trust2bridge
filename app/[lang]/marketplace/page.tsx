import MarketplaceClient from "./MarketplaceClient";
import { getDictionary } from "@/lib/dictionary";

// Obligatoriu pentru "output: export"
export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'ro' }, { lang: 'hu' }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');

  return <MarketplaceClient dict={dict} lang={lang} />;
}
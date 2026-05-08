import { Suspense } from "react"; // 1. Importă Suspense
import MarketplaceClient from "./MarketplaceClient";
import { getDictionary } from "@/lib/dictionary";

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'ro' }, { lang: 'hu' }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'de' | 'ro' | 'hu');

  return (
    // 2. Înfășoară componenta de client în Suspense
    <Suspense fallback={<div>Loading marketplace...</div>}>
      <MarketplaceClient dict={dict} lang={lang} />
    </Suspense>
  );
}
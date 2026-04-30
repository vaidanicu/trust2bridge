import { Suspense } from "react";
import MarketplaceDetailsClient from "./MarketplaceDetailsClient";
import { getDictionary } from "@/lib/dictionary";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "de" }, { lang: "hu" }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceDetailsClient dict={dict} lang={lang} />
    </Suspense>
  );
}
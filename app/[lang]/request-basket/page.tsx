// app/[lang]/request-basket/page.tsx
import RequestBasketPage from "./RequestBasketPage";
import { getDictionary } from "@/lib/dictionary";

// Aceasta asigură generarea paginilor pentru toate limbile la build
export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "de" }, { lang: "hu" }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Încărcăm traducerile pe server
  const dict = await getDictionary(lang as "ro" | "de" | "hu");

  // Trimitem dict și lang către componenta de client (cea trimisă de tine)
  return <RequestBasketPage dict={dict} lang={lang} />;
}
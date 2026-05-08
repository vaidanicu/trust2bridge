import { Suspense } from "react";
import LoginPage from "./LoginPage";
import { getDictionary } from "@/lib/dictionary";

export async function generateStaticParams() {
  return [
    { lang: "de" },
    { lang: "ro" },
    { lang: "hu" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const dict = await getDictionary(
    lang as "ro" | "de" | "hu"
  );

  return (
    <Suspense
      fallback={
        <div className="p-10 font-bold">
          Loading...
        </div>
      }
    >
      <LoginPage dict={dict} lang={lang} />
    </Suspense>
  );
}
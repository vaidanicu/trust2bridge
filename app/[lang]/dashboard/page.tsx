import DashboardPage from "./DashboardPage";

export async function generateStaticParams() {
  return [
    { lang: "de" },
    { lang: "ro" },
    { lang: "hu" }
  ];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <DashboardPage />;
}
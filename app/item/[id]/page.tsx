import Link from "next/link";
import AddToRequestButton from "../../components/AddToRequestButton";

async function getItem(id: string) {
  const res = await fetch(
    `https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items/${id}`,
    { cache: "force-cache" }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch(
    "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/items",
    { cache: "force-cache" }
  );

  const items = await res.json();

  return items.map((item: any) => ({
    id: String(item.id),
  }));
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item || item.code === "not_found") {
    return (
      <main className="min-h-screen bg-[#f4f6f8] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">Produkt existiert nicht.</h1>
          <Link
            href="/marketplace"
            className="mt-6 inline-block rounded-xl bg-[#108280] px-6 py-3 font-black text-white"
          >
            Zurück zum Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {/* TOP BAR */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link
            href="/marketplace"
            className="text-sm font-bold text-[#108280] hover:underline"
          >
            ← Zurück zum Marketplace
          </Link>
        </div>
      </section>

      {/* PRODUCT AREA */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border bg-white p-4 shadow-sm">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-[420px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                Produktbild
              </div>
            )}
          </div>

          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">Beschreibung</h2>

            <div
              className="prose prose-slate mt-4 max-w-none text-slate-600"
              dangerouslySetInnerHTML={{
                __html: item.description || "Keine Beschreibung verfügbar.",
              }}
            />
          </div>
        </div>

        {/* RIGHT */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <div className="rounded-3xl border bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#108280]">
              TrustBridge B2B Artikel
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">
              {item.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#108280]/10 px-3 py-1 text-xs font-black text-[#108280]">
                {item.category || "B2B"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {item.country || "Nicht angegeben"}
              </span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                Preis auf Anfrage
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-[#f4f6f8] p-5">
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Land</span>
                  <strong>{item.country || "-"}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Kategorie</span>
                  <strong>{item.category || "Allgemein"}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Preisstatus</span>
                  <strong>
                    {item.price_status === "request"
                      ? "Preis auf Anfrage"
                      : item.price_status || "Preis auf Anfrage"}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Mindestbestellmenge</span>
                  <strong>{item.min_qty || "-"}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <AddToRequestButton item={item} />
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Nach dem Hinzufügen können Sie Ihre Anfrage gesammelt über den
              Anfragekorb senden.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">TrustBridge Vorteile</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#108280]/10 p-4">
                <h3 className="font-black text-[#108280]">
                  Geprüfte Anbieter
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Kontakte werden vor der Weiterleitung geprüft.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <h3 className="font-black">Persönliche Koordination</h3>
                <p className="mt-1 text-sm text-slate-600">
                  TrustBridge unterstützt die Kommunikation zwischen Käufer und
                  Partner.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <h3 className="font-black">Aktive Produktsuche</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Falls ein Produkt nicht verfügbar ist, kann eine Suche im
                  Netzwerk gestartet werden.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
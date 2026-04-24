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
    return <div className="p-10">Produkt existiert nicht.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-teal-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-cyan-300 font-black uppercase">
            TrustBridge B2B Artikel
          </p>
          <h1 className="mt-2 text-4xl font-black">{item.title}</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
        <div className="rounded-xl bg-white p-10 shadow-sm">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-80 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              Produktbild
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black mb-4">Artikeldetails</h2>

            <p><strong>Land:</strong> {item.country || "-"}</p>
            <p><strong>Lieferant:</strong> {item.supplier_id || "-"}</p>
            <p><strong>Preisstatus:</strong> {item.price_status || "Preis auf Anfrage"}</p>
            <p><strong>Mindestbestellmenge:</strong> {item.min_qty || "-"}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black mb-4">Beschreibung</h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{
                __html: item.description || "Keine Beschreibung verfügbar.",
              }}
            />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            {/* Hinweis: Den Text im Button musst du wahrscheinlich in der Komponente AddToRequestButton selbst anpassen */}
            <AddToRequestButton item={item} />
          </div>
        </div>
      </section>
    </main>
  );
}
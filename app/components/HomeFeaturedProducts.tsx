"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddToRequestButton from "./AddToRequestButton";
import { formatConvertedPrice } from "@/lib/currency";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function HomeFeaturedProducts({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(`${API}/items?lang=${lang}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setItems(data.slice(0, 6));
        } else if (Array.isArray(data.items)) {
          setItems(data.items.slice(0, 6));
        } else if (Array.isArray(data.data)) {
          setItems(data.data.slice(0, 6));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Home featured items error:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [lang]);

  if (loading) {
    return (
      <div className="col-span-full py-12 text-center text-slate-400">
        Se încarcă ofertele...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-slate-400">
        Nu există oferte publicate momentan.
      </div>
    );
  }

  return (
    <>
      {items.map((item: any) => (
        <div
          key={item.id}
          className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
        >
          <Link href={`/${lang}/details?id=${item.id}`} className="block">
            <div className="relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                  {dict.common.no_image}
                </div>
              )}

              <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                {item.category || "B2B"}
              </span>
            </div>
          </Link>

          <div className="p-5">
            <Link href={`/${lang}/details?id=${item.id}`}>
              <h3 className="line-clamp-2 min-h-[48px] font-black leading-snug text-slate-950 group-hover:text-[#108280]">
                {item.title}
              </h3>
            </Link>

            <div className="mt-3 space-y-1 text-sm text-slate-500">
              <p>{dict.common.country}: {item.country || dict.common.not_specified}</p>
              <p>{dict.common.category}: {item.category || dict.common.general}</p>
            </div>

            <p className="mt-3 text-sm font-black text-orange-500">
              {formatConvertedPrice(item.price, lang)
                ? formatConvertedPrice(item.price, lang)
                : dict.common.price_on_request}
            </p>

            <div className="mt-4">
              <AddToRequestButton item={item} dict={dict} lang={lang} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
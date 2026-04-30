"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Folosim Link din Next.js pentru navigare rapidă
import { addToBasket, getBasket } from "@/lib/basket";

// Adăugăm dict și lang în props
export default function AddToRequestButton({ 
  item, 
  dict, 
  lang 
}: { 
  item: any; 
  dict: any; 
  lang: string 
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const basket = getBasket();
    const exists = basket.some((i: any) => i.id === item.id);
    setAdded(exists);
  }, [item.id]);

  const handleAdd = () => {
    if (added) return;
    addToBasket(item);
    setAdded(true);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleAdd}
        disabled={added}
        className={`w-full rounded-xl py-3 font-black uppercase tracking-wide transition
          ${
            added
              ? "bg-green-600 text-white cursor-default"
              : "bg-[#108280] text-white hover:bg-[#0d6b69]"
          }`}
      >
        {/* Traducere din secțiunea marketplace sau common */}
        {added ? `✓ ${dict.marketplace.added_to_basket}` : dict.marketplace.add_to_basket}
      </button>

      <Link
        href={`/${lang}/request-basket`}
        className="block w-full text-center text-sm font-bold text-[#108280] hover:underline"
      >
        {dict.nav.basket_btn} →
      </Link>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { addToBasket, getBasket } from "@/lib/basket";

export default function AddToRequestButton({ item }: { item: any }) {
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
        {added ? "✓ Bereits im Anfragekorb" : "In Anfragekorb"}
      </button>

      <a
        href="/request"
        className="block w-full text-center text-sm font-bold text-[#108280] hover:underline"
      >
        Anfragekorb ansehen →
      </a>
    </div>
  );
}
"use client";

import { addToBasket } from "@/lib/basket";

export default function AddToRequestButton({ item }: { item: any }) {
  const handleAdd = () => {
    addToBasket(item);
    alert("Zur Anfrageliste hinzugefügt");
  };

  return (
    <button
      onClick={handleAdd}
      className="mt-5 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
    >
      Zur Anfrage hinzufügen
    </button>
  );
}
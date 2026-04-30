"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBasket } from "@/lib/basket";

// Adăugăm dict și lang în lista de props
export default function BasketCounter({ dict, lang }: { dict: any, lang: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getBasket().length);

    const interval = setInterval(() => {
      setCount(getBasket().length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href={`/${lang}/request-basket`} // Adăugăm prefixul de limbă
      className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95"
    >
      {/* Folosim textul din dicționar */}
      {dict.nav.basket_btn || "Basket"} ({count})
    </Link>
  );
}
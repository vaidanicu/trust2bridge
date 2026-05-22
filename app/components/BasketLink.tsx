"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBasket } from "@/lib/basket";

export default function BasketCounter({
  dict,
  lang,
  iconOnly = false,
}: {
  dict: any;
  lang: string;
  iconOnly?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getBasket().length);
    const interval = setInterval(() => {
      setCount(getBasket().length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (iconOnly) {
    return (
      <Link
        href={`/${lang}/request-basket`}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#108280] hover:text-[#108280]"
        aria-label={dict.nav.basket_btn || "Basket"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13"
          />
        </svg>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#108280] text-[10px] font-black text-white">
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/request-basket`}
      className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95"
    >
      {dict.nav.basket_btn || "Basket"} ({count})
    </Link>
  );
}
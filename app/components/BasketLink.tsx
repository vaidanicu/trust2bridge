"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBasket } from "@/lib/basket";

export default function BasketCounter() {
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
      href="/request-basket"
      className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-black text-black"
    >
      Coș de cereri ({count})
    </Link>
  );
}
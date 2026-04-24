import Link from "next/link";
import Image from "next/image"; // <--- Trebuie să adaugi acest import
import BasketCounter from "./BasketLink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/poze/logo.jpeg" 
            alt="TrustBridge Logo"
            width={150} 
            height={40}
            priority // Recomandat pentru logo-uri (îl încarcă mai repede)
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-bold text-gray-700 md:flex">
          <Link href="/marketplace" className="hover:text-teal-800">Marketplace</Link>
          <Link href="/about" className="hover:text-teal-800">Über Uns</Link>
          <Link href="/contact" className="hover:text-teal-800">Kontakt</Link>
          <Link href="/request-basket" className="hover:text-teal-800">Was möchten Sie?</Link>
        </nav>

        {/* Action Section */}
        <BasketCounter />
      </div>
    </header>
  );
}
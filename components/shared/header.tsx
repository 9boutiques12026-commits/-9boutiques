"use client";

import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const cart = JSON.parse(localStorage.getItem("9boutiques-cart") || "[]") as Array<{ quantity?: number }>;
      setCartCount(cart.reduce((total, item) => total + (item.quantity || 0), 0));
    };
    refresh();
    window.addEventListener("9boutiques-cart-updated", refresh);
    return () => window.removeEventListener("9boutiques-cart-updated", refresh);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-8 px-8 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div>
            <p className="font-display text-[27px] leading-none tracking-[-0.06em] text-black">9boutiques</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-black/50">Élégance au quotidien</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] text-black/70 lg:flex">
          <Link href="/">Accueil</Link>
          <Link href="/boutiques">Hommes</Link>
          <Link href="/boutiques">Nouveautés</Link>
          <Link href="/boutiques">Promotions</Link>
          <Link href="/boutiques">Collections</Link>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <div className="hidden items-center gap-2 border-b border-black/25 pb-2 text-black/45 md:flex">
            <Search className="h-4 w-4" />
            <input aria-label="Rechercher un produit" placeholder="Rechercher un produit..." className="w-44 bg-transparent text-xs text-black outline-none placeholder:text-black/40" />
          </div>
          <Link href="/compte" aria-label="Compte" className="text-black/70 transition hover:text-[#b18a45]"><UserRound className="h-[19px] w-[19px]" /></Link>
          <Link href="/panier" aria-label="Panier" className="relative text-black/70 transition hover:text-[#b18a45]"><ShoppingBag className="h-[19px] w-[19px]" />{cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b18a45] px-1 text-[9px] font-semibold text-white">{cartCount}</span>}</Link>
        </div>
      </div>
    </header>
  );
}

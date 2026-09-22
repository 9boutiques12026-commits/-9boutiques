import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-700/10 bg-ivory-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-sm font-semibold text-ivory-50">
            9
          </div>
          <div>
            <p className="font-display text-2xl leading-none text-forest-900">9boutiques</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-forest-700/70">
              mode élégante
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-forest-800 md:flex">
          <Link href="/">Accueil</Link>
          <Link href="/boutiques">Boutiques</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/panier">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Panier
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

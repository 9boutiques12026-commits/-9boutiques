"use client";

import Link from "next/link";
import { Heart, MessageCircle, Search, ShoppingBag, UserRound } from "lucide-react";

import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { SITE, whatsappLink } from "@/lib/site";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Boutiques", href: "/boutiques" },
  { label: "Contact", href: whatsappLink("Bonjour 9boutiques, j'aimerais avoir des informations.") },
];

export function Header() {
  const { count: cartCount } = useCart();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50">
      {/* Bandeau d'annonce : infos réelles de la boutique */}
      <div className="bg-forest-900 text-ivory-50">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-2 text-[10px] font-medium uppercase tracking-[0.18em] md:px-8">
          <p className="hidden sm:block text-ivory-100/70">Livraison Abidjan &amp; toute la Côte d'Ivoire</p>
          <p className="text-ivory-100/70">Paiement Wave · Orange Money · Espèces</p>
          <a
            href={whatsappLink("Bonjour 9boutiques !")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gold-400 transition hover:text-gold-500"
          >
            <MessageCircle className="h-3 w-3" />
            {SITE.whatsappAffiche}
          </a>
        </div>
      </div>

      {/* Barre principale */}
      <div className="border-b border-forest-900/10 bg-ivory-50/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center gap-8 px-6 py-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-gold-500/60 bg-forest-900 font-display text-xl text-gold-400 transition group-hover:bg-forest-800">
              9
            </span>
            <span>
              <span className="block font-display text-[24px] leading-none tracking-[-0.05em] text-forest-900">
                {SITE.nom}
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.3em] text-gold-500">
                {SITE.slogan}
              </span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="relative text-[13px] font-medium tracking-[0.08em] text-forest-900/70 transition hover:text-forest-900 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-5">
            <div className="hidden items-center gap-2 border-b border-forest-900/20 pb-1.5 text-forest-900/40 transition focus-within:border-gold-500 md:flex">
              <Search className="h-4 w-4" />
              <input
                aria-label="Rechercher un produit"
                placeholder="Rechercher un article..."
                className="w-40 bg-transparent text-xs text-forest-900 outline-none placeholder:text-forest-900/35"
              />
            </div>

            <Link href="/compte" aria-label="Mes favoris" className="relative text-forest-900/70 transition hover:text-gold-500">
              <Heart className={`h-[19px] w-[19px] ${favorites.length ? "fill-gold-400 text-gold-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-semibold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link href="/compte" aria-label="Mon compte" className="text-forest-900/70 transition hover:text-gold-500">
              <UserRound className="h-[19px] w-[19px]" />
            </Link>

            <Link href="/panier" aria-label="Mon panier" className="relative text-forest-900/70 transition hover:text-gold-500">
              <ShoppingBag className="h-[19px] w-[19px]" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest-800 px-1 text-[9px] font-semibold text-ivory-50">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Liseré or discret sous la barre */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </div>
    </header>
  );
}

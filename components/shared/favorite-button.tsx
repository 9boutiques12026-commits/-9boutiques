"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/lib/favorites";

export function FavoriteButton({ productId, productName }: { productId: string; productName: string }) {
  const { favorites, toggle } = useFavorites();
  const active = favorites.includes(productId);

  return (
    <button
      type="button"
      aria-label={active ? `Retirer ${productName} des favoris` : `Ajouter ${productName} aux favoris`}
      onClick={() => toggle(productId)}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
        active
          ? "border-gold-500 bg-gold-500/10 text-gold-500"
          : "border-forest-900/15 bg-ivory-50 text-forest-900/60 hover:border-gold-500 hover:text-gold-500"
      }`}
    >
      <Heart className={`h-5 w-5 ${active ? "fill-gold-500" : ""}`} />
    </button>
  );
}

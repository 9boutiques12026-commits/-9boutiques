"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; price: number; image: string };

export function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const current = JSON.parse(localStorage.getItem("9boutiques-cart") || "[]") as Array<Product & { quantity: number }>;
    const existing = current.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else current.push({ ...product, quantity: 1 });
    localStorage.setItem("9boutiques-cart", JSON.stringify(current));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return <Button className="mt-8 w-full sm:w-auto" size="lg" onClick={addToCart} disabled={disabled}>{added ? <><Check className="mr-2 h-4 w-4" /> Ajouté au panier</> : <><ShoppingBag className="mr-2 h-4 w-4" /> Ajouter au panier</>}</Button>;
}

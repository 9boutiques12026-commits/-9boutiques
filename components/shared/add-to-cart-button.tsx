"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";

type Product = { id: string; name: string; price: number; image: string };

export function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button
      type="button"
      className="mt-8 w-full sm:w-auto"
      size="lg"
      onClick={handleAdd}
      disabled={disabled}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Ajouté au panier
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" /> Ajouter au panier
        </>
      )}
    </Button>
  );
}

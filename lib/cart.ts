"use client";

import { useCallback, useEffect, useState } from "react";

// Clé de stockage et événement de synchronisation du panier.
export const CART_KEY = "9boutiques-cart";
export const CART_EVENT = "9boutiques-cart-updated";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(raw) ? (raw as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(product: Omit<CartItem, "quantity">, quantity = 1) {
  const current = getCart();
  const existing = current.find((item) => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else current.push({ ...product, quantity });
  setCart(current);
}

export function cartCount(items: CartItem[] = getCart()): number {
  return items.reduce((total, item) => total + (item.quantity || 0), 0);
}

// Hook : contenu du panier + helpers. Synchronisé entre toutes les pages
// grâce à l'événement CART_EVENT (le badge du header se met à jour tout seul).
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    const next = getCart()
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      )
      .filter((item) => item.quantity > 0);
    setCart(next);
  }, []);

  const remove = useCallback((id: string) => {
    setCart(getCart().filter((item) => item.id !== id));
  }, []);

  const add = useCallback((product: Omit<CartItem, "quantity">, quantity = 1) => {
    addToCart(product, quantity);
  }, []);

  const clear = useCallback(() => setCart([]), []);

  return { items, count: cartCount(items), add, updateQuantity, remove, clear };
}

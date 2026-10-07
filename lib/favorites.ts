"use client";

import { useCallback, useEffect, useState } from "react";

// Clé de stockage et événement de synchronisation des favoris.
export const FAVORITES_KEY = "9boutiques-favorites";
export const FAVORITES_EVENT = "9boutiques-favorites-updated";

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(raw) ? (raw as string[]) : [];
  } catch {
    return [];
  }
}

export function setFavoriteIds(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

// Hook : liste des ids favoris + fonction pour (dé)cocher un produit.
// Les cœurs restent mémorisés entre les pages (localStorage).
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(getFavoriteIds());
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = getFavoriteIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setFavoriteIds(next);
  }, []);

  return { favorites, toggle };
}

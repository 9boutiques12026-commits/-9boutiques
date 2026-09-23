"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { CheckoutButton } from "@/app/panier/checkout-button";

type CartItem = { id: string; name: string; price: number; quantity: number };

export default function PanierPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(JSON.parse(localStorage.getItem("9boutiques-cart") || "[]")), []);
  useEffect(() => localStorage.setItem("9boutiques-cart", JSON.stringify(items)), [items]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function update(id: string, delta: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header />
      <main className="container-shell pb-20 pt-12">
        <p className="badge">Votre sélection</p>
        <h1 className="section-title mt-5">Le panier</h1>
        {items.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-10 text-center">
            <p className="font-display text-3xl text-forest-900">Votre panier attend une belle pièce.</p>
            <Button className="mt-6" asChild><Link href="/boutiques">Explorer les boutiques</Link></Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-forest-700/10 rounded-[2rem] border border-forest-700/10 bg-ivory-50 px-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-6">
                  <div><h2 className="font-display text-2xl text-forest-900">{item.name}</h2><p className="mt-1 text-sm text-forest-800/65">{item.price.toLocaleString("fr-FR")} FCFA</p></div>
                  <div className="flex items-center gap-3"><button aria-label="Diminuer" onClick={() => update(item.id, -1)} className="rounded-full border border-forest-700/15 p-2"><Minus className="h-4 w-4" /></button><span className="w-5 text-center">{item.quantity}</span><button aria-label="Augmenter" onClick={() => update(item.id, 1)} className="rounded-full border border-forest-700/15 p-2"><Plus className="h-4 w-4" /></button><button aria-label="Supprimer" onClick={() => remove(item.id)} className="ml-2 text-forest-800/60"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-[2rem] bg-forest-900 p-7 text-ivory-50"><p className="text-xs uppercase tracking-[0.2em] text-ivory-100/60">Total</p><p className="mt-3 font-display text-5xl">{total.toLocaleString("fr-FR")} FCFA</p><CheckoutButton items={items} total={total} /></aside>
          </div>
        )}
      </main>
    </>
  );
}

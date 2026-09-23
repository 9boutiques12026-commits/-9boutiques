"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { CheckoutForm } from "@/app/panier/checkout-form";

type CartItem = { id: string; name: string; price: number; quantity: number };

export default function PanierPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(JSON.parse(localStorage.getItem("9boutiques-cart") || "[]")), []);
  useEffect(() => localStorage.setItem("9boutiques-cart", JSON.stringify(items)), [items]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function update(id: string, delta: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <Header />
      <main className="container-shell pb-24 pt-12">
        <p className="badge">Finalisation de commande</p>
        <h1 className="section-title mt-4">Votre Panier & Livraison</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-12 text-center">
            <p className="font-display text-3xl text-forest-900">Votre panier est actuellement vide.</p>
            <p className="mt-2 text-sm text-forest-800/60">
              Découvrez les créations et articles de nos boutiques sélectionnées.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/boutiques">Explorer les boutiques</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Colonne gauche : Articles + Formulaire de livraison & Paiement */}
            <div className="space-y-8">
              {/* Liste des articles */}
              <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-forest-700/10 pb-4">
                  <h2 className="font-display text-xl text-forest-900">
                    Articles ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h2>
                  <Link href="/produits" className="text-xs text-forest-700 underline underline-offset-4">
                    Continuer vos achats
                  </Link>
                </div>

                <div className="divide-y divide-forest-700/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                      <div>
                        <h3 className="font-medium text-forest-900 sm:text-lg">{item.name}</h3>
                        <p className="mt-0.5 text-sm text-forest-800/60">
                          {item.price.toLocaleString("fr-FR")} FCFA / unité
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-forest-700/15 bg-white px-2 py-1">
                          <button
                            type="button"
                            aria-label="Diminuer"
                            onClick={() => update(item.id, -1)}
                            className="rounded-full p-1 text-forest-800/70 hover:bg-forest-50"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-forest-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Augmenter"
                            onClick={() => update(item.id, 1)}
                            className="rounded-full p-1 text-forest-800/70 hover:bg-forest-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="w-24 text-right font-semibold text-forest-900">
                          {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                        </span>

                        <button
                          type="button"
                          aria-label="Supprimer"
                          onClick={() => remove(item.id)}
                          className="rounded-full p-2 text-forest-800/50 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire complet de coordonnées & paiement */}
              <CheckoutForm items={items} total={total} />
            </div>

            {/* Colonne droite : Récapitulatif fixe */}
            <div className="space-y-6">
              <aside className="sticky top-24 rounded-[2rem] bg-forest-900 p-7 text-ivory-50 shadow-luxe">
                <p className="text-xs uppercase tracking-[0.2em] text-ivory-100/60">Récapitulatif</p>
                <div className="mt-6 space-y-3 text-sm text-ivory-100/80">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span>{total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="text-emerald-400">À définir selon zone</span>
                  </div>
                  <div className="border-t border-forest-700/50 pt-3 flex justify-between font-display text-xl text-ivory-50">
                    <span>Total à régler</span>
                    <span>{total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4 rounded-2xl bg-forest-800/60 p-4 text-xs text-ivory-100/75">
                  <div className="flex items-start gap-2.5">
                    <span className="text-gold-400">✔</span>
                    <span>Paiement 100% sécurisé (Espèces, Wave, Mobile Money)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-gold-400">✔</span>
                    <span>Service client réactif sur WhatsApp et par appel</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-gold-400">✔</span>
                    <span>Vérification des articles avant règlement</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

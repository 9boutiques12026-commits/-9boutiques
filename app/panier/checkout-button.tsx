"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type CartItem = { id: string; name: string; price: number; quantity: number };

export function CheckoutButton({ items, total }: { items: CartItem[]; total: number }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function checkout() {
    setState("loading"); setMessage("");
    const response = await fetch("/api/commandes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ utilisateurId: "session", total, lignes: items.map((item) => ({ produitId: item.id, quantite: item.quantity, prixUnitaire: item.price })) }) });
    const data = await response.json();
    if (!response.ok) { setState("error"); setMessage(data.error || "La commande n’a pas pu être créée."); return; }
    localStorage.removeItem("9boutiques-cart");
    window.dispatchEvent(new Event("9boutiques-cart-updated"));
    setState("success"); setMessage("Commande confirmée. Merci pour votre achat.");
  }

  if (state === "success") return <div role="status" className="mt-8 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-800"><Check className="mr-2 inline h-4 w-4" />{message}</div>;
  return <div className="mt-8"><Button className="w-full" variant="secondary" onClick={checkout} disabled={state === "loading"}>{state === "loading" ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Traitement...</> : "Passer commande"}</Button>{state === "error" && <p role="alert" className="mt-3 text-sm text-red-200">{message}</p>}</div>;
}

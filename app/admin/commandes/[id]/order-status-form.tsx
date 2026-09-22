"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const statuses = [{ value: "en_attente", label: "En attente" }, { value: "confirme", label: "Confirmée" }, { value: "expedie", label: "Expédiée" }, { value: "livre", label: "Livrée" }, { value: "annule", label: "Annulée" }];

export function OrderStatusForm({ id, initialStatus }: { id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true); setMessage("");
    const response = await fetch(`/api/commandes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ statut: status }) });
    const data = await response.json();
    setMessage(response.ok ? "Statut enregistré." : data.error || "Mise à jour impossible.");
    setLoading(false);
  }

  return <div className="min-w-64"><label className="text-xs uppercase tracking-[0.16em] text-forest-800/60">Statut</label><div className="mt-2 flex gap-2"><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-full border border-forest-700/15 bg-white px-4 py-2 text-sm"><option value="en_attente">En attente</option><option value="confirme">Confirmée</option><option value="expedie">Expédiée</option><option value="livre">Livrée</option><option value="annule">Annulée</option></select><Button size="sm" onClick={save} disabled={loading}>{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</Button></div>{message && <p className={`mt-2 text-xs ${message.endsWith(".") && message !== "Mise à jour impossible." ? "text-forest-700" : "text-red-700"}`}>{message}</p>}</div>;
}

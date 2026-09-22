"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Boutique = { id: string; nom: string; slug: string; description: string | null };
type Produit = { id: string; nom: string; prix: number; stock: number; boutique: { nom: string } };

export function AdminDashboard({ initialBoutiques, initialProduits }: { initialBoutiques: Boutique[]; initialProduits: Produit[] }) {
  const [boutiques, setBoutiques] = useState(initialBoutiques);
  const [produits, setProduits] = useState(initialProduits);
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");

  async function createBoutique(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/boutiques", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom, slug }) });
    if (!response.ok) return setMessage("La boutique n’a pas pu être créée.");
    const boutique = await response.json();
    setBoutiques((current) => [boutique, ...current]);
    setNom(""); setSlug(""); setMessage("Boutique créée.");
  }

  async function deleteProduit(id: string) {
    const response = await fetch(`/api/produits?id=${id}`, { method: "DELETE" });
    if (response.ok) setProduits((current) => current.filter((produit) => produit.id !== id));
  }

  return <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
    <section className="h-fit rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6"><p className="badge">Nouvelle boutique</p><form onSubmit={createBoutique} className="mt-6 space-y-4"><input required value={nom} onChange={(event) => setNom(event.target.value)} placeholder="Nom" className="w-full rounded-full border border-forest-700/10 bg-white px-4 py-3" /><input required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="slug" className="w-full rounded-full border border-forest-700/10 bg-white px-4 py-3" /><Button className="w-full"><Plus className="mr-2 h-4 w-4" /> Créer</Button></form>{message && <p className="mt-4 text-sm text-forest-700">{message}</p>}</section>
    <div className="space-y-8"><section><p className="badge">Boutiques</p><div className="mt-4 overflow-hidden rounded-[2rem] border border-forest-700/10 bg-ivory-50"><div className="divide-y divide-forest-700/10">{boutiques.map((boutique) => <div key={boutique.id} className="flex items-center justify-between px-6 py-5"><div><p className="font-display text-2xl text-forest-900">{boutique.nom}</p><p className="text-sm text-forest-800/60">/{boutique.slug}</p></div><span className="text-xs uppercase tracking-[0.16em] text-forest-700">Actif</span></div>)}</div></div></section><section><p className="badge">Produits</p><div className="mt-4 overflow-hidden rounded-[2rem] border border-forest-700/10 bg-ivory-50"><div className="divide-y divide-forest-700/10">{produits.map((produit) => <div key={produit.id} className="flex items-center justify-between gap-4 px-6 py-5"><div><p className="font-medium text-forest-900">{produit.nom}</p><p className="text-sm text-forest-800/60">{produit.boutique.nom} · {Number(produit.prix).toFixed(2)} € · stock {produit.stock}</p></div><button aria-label={`Supprimer ${produit.nom}`} onClick={() => deleteProduit(produit.id)} className="text-forest-800/60 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>)}</div></div></section></div>
  </div>;
}

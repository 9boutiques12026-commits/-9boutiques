"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Header } from "@/components/shared/header";

const products = [
  { id: "chemise-premium", name: "Chemise Premium", category: "Homme", price: 25000, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85", badge: "Nouveau", colors: ["#eee8dd", "#1a1a1a", "#af8066"] },
  { id: "derby-cuir", name: "Derby Cuir Essential", category: "Homme", price: 29500, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=85", badge: "Nouveau", colors: ["#1a1a1a", "#795b42"] },
  { id: "jean-urban", name: "Jean Urban", category: "Homme", price: 22000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85", badge: "", colors: ["#7990a8", "#202b39", "#d7d0c4"] },
  { id: "robe-studio", name: "Robe Studio", category: "Femme", price: 28000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85", badge: "Nouveau", colors: ["#151515", "#b89782", "#e3d9ca"] },
  { id: "tshirt-essential", name: "T-shirt Essential", category: "Mixte", price: 15000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", badge: "", colors: ["#f4f1ec", "#1b1b1b", "#6d7568"] },
  { id: "veste-premium", name: "Veste Premium", category: "Homme", price: 36000, oldPrice: 40000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", badge: "-10%", colors: ["#161616", "#8c7965"] },
];

export default function HomePage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [added, setAdded] = useState<string[]>([]);

  function addToCart(id: string) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const current = JSON.parse(localStorage.getItem("9boutiques-cart") || "[]") as Array<{ id: string; name: string; price: number; image: string; quantity: number }>;
    const existing = current.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else current.push({ id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    localStorage.setItem("9boutiques-cart", JSON.stringify(current));
    window.dispatchEvent(new Event("9boutiques-cart-updated"));
    setAdded((current) => current.includes(id) ? current : [...current, id]);
    window.setTimeout(() => setAdded((current) => current.filter((item) => item !== id)), 1500);
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main>
        <section className="relative mx-auto max-w-[1440px] px-8 pt-8">
          <div className="relative min-h-[540px] overflow-hidden bg-[#d4d1ca]">
            <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=90" alt="Nouvelle collection 9boutiques" fill priority className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
            <button aria-label="Collection précédente" className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white hover:text-black"><ArrowLeft className="h-4 w-4" /></button>
            <button aria-label="Collection suivante" className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white hover:text-black"><ArrowRight className="h-4 w-4" /></button>
            <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center px-12 text-white md:px-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e1bc70]">Nouvelle collection</p>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">Votre style.<br />Votre identité.</h1>
              <p className="mt-6 max-w-md text-sm leading-6 text-white/80">Découvrez notre nouvelle collection de vêtements pour hommes et femmes, alliant confort, élégance et modernité.</p>
              <Link href="/boutiques" className="mt-8 inline-flex w-fit items-center gap-3 bg-[#b18a45] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#967238]">Découvrir la collection <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"><span className="h-1 w-10 bg-white" /><span className="h-1 w-3 bg-white/45" /><span className="h-1 w-3 bg-white/45" /></div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-8 pb-20 pt-20">
          <div className="flex items-end justify-between border-b border-black/10 pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b18a45]">La sélection du moment</p><h2 className="mt-3 font-display text-4xl tracking-[-0.06em]">Nouveautés</h2></div><Link href="/boutiques" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/60 transition hover:text-[#b18a45]">Voir tout <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
            {products.map((product) => <article key={product.id} className="group min-w-0"><div className="relative aspect-[0.78] overflow-hidden bg-[#f2f1ef]"><Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3 flex gap-2">{product.badge && <span className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${product.badge.startsWith("-") ? "bg-[#b18a45] text-white" : "bg-white text-black"}`}>{product.badge}</span>}</div><button aria-label={`Ajouter ${product.name} aux favoris`} onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black transition hover:bg-white"><Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-[#b18a45] text-[#b18a45]" : ""}`} /></button></div><div className="pt-4"><div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-medium text-black">{product.name}</h3><p className="mt-1 text-[11px] text-black/50">{product.category}</p></div><div className="text-right text-xs"><p className="font-semibold">{product.price.toLocaleString("fr-FR")} FCFA</p>{product.oldPrice && <p className="mt-1 text-[10px] text-black/35 line-through">{product.oldPrice.toLocaleString("fr-FR")} FCFA</p>}</div></div><div className="mt-3 flex items-center gap-1.5">{product.colors.map((color) => <span key={color} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}</div><button onClick={() => addToCart(product.id)} className="mt-4 flex w-full items-center justify-center gap-2 bg-black px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#b18a45]"><ShoppingBag className="h-3.5 w-3.5" />{added.includes(product.id) ? "Ajouté" : "Ajouter au panier"}</button></div></article>)}
          </div>
        </section>
      </main>
    </div>
  );
}

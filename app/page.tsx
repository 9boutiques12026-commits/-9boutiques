"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { addToCart as addItemToCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { SITE, whatsappLink } from "@/lib/site";

const FALLBACK_IMAGE = "/produits/article-01.jpg";

type CatalogueItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge: string;
  colors: string[];
};

export default function HomePage() {
  const [catalogue, setCatalogue] = useState<CatalogueItem[] | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const { favorites, toggle } = useFavorites();

  useEffect(() => {
    fetch("/api/produits")
      .then((response) => response.json())
      .then((records) => {
        if (!Array.isArray(records)) return setCatalogue([]);
        setCatalogue(
          records
            .filter((product: any) => product.statut === "publie" || product.statut === "brouillon")
            .slice(0, 6)
            .map((product: any) => ({
              id: product.id,
              slug: product.slug,
              name: product.nom,
              category: product.categorie || product.boutique?.nom || "Collection",
              price: Number(product.prixPromo ?? product.prix),
              oldPrice: product.prixPromo ? Number(product.prix) : undefined,
              image: product.images?.[0]?.url || FALLBACK_IMAGE,
              badge: product.prixPromo ? "Promotion" : "Nouveau",
              colors: (product.couleurs || []).filter((c: string) => c.startsWith("#")),
            })),
        );
      })
      .catch(() => setCatalogue([]));
  }, []);

  function addToCart(id: string) {
    const product = catalogue?.find((item) => item.id === id);
    if (!product) return;
    addItemToCart({ id, name: product.name, price: product.price, image: product.image });
    setAdded((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => setAdded((prev) => prev.filter((item) => item !== id)), 1500);
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-forest-900">
      <span className="grain-overlay" aria-hidden="true" />
      <Header />
      <main>
        {/* Héro : vraie photo produit + message de la maison */}
        <section className="mx-auto grid max-w-[1440px] gap-0 px-6 pt-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center py-14 lg:py-20 lg:pr-16">
            <p className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-500">
              Maison de mode · Bouaké
            </p>
            <h1 className="animate-fade-up delay-1 mt-6 font-display text-5xl leading-[0.98] tracking-[-0.05em] text-forest-900 md:text-6xl">
              Le denim qui vous
              <br />
              <span className="relative inline-block">
                ressemble.
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-gold-500"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 C 40 3, 80 10, 120 6 S 180 3, 198 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="animate-fade-up delay-2 mt-8 max-w-md text-sm leading-7 text-forest-800/70">
              Jeans, shorts et pièces sélectionnées à la main. Commandez en quelques
              minutes, payez par Wave, Orange Money ou à la livraison, partout en
              Côte d'Ivoire.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/boutiques"
                className="group inline-flex items-center gap-3 bg-forest-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ivory-50 shadow-luxe transition hover:bg-forest-800 hover:gap-4"
              >
                Découvrir la collection <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href={whatsappLink(`Bonjour ${SITE.nom}, je souhaite commander.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-forest-900/20 bg-ivory-50/50 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-forest-900 transition hover:border-gold-500 hover:text-gold-500"
              >
                <MessageCircle className="h-4 w-4" /> Commander sur WhatsApp
              </a>
            </div>
            <div className="animate-fade-up delay-3 mt-10 flex items-center gap-6 text-[11px] uppercase tracking-[0.16em] text-forest-800/50">
              <span>Livraison rapide</span>
              <span className="h-3 w-px bg-forest-900/20" />
              <span>Paiement mobile</span>
              <span className="h-3 w-px bg-forest-900/20" />
              <span>Qualité vérifiée</span>
            </div>
          </div>

          <div className="relative my-6 min-h-[380px] overflow-hidden rounded-[2rem] bg-ivory-200 shadow-luxe lg:my-0 lg:min-h-[560px]">
            <Image
              src="/produits/article-11.jpg"
              alt="Short en denim 9boutiques"
              fill
              priority
              className="hero-photo object-cover object-center"
            />
            {/* liseré doré intérieur, façon passe-partout de galerie */}
            <span className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-gold-400/40" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-forest-900/55 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-full border border-ivory-100/30 bg-forest-900/70 px-4 py-2 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">Nouvelle collection</p>
              <p className="mt-0.5 text-xs text-ivory-50/90">Denim &amp; pièces sélectionnées</p>
            </div>
          </div>
        </section>

        {/* Sélection */}
        <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-16 md:px-8">
          <div className="flex items-end justify-between border-b border-forest-900/10 pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500">
                La sélection du moment
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.05em]">Nouveautés</h2>
            </div>
            <Link
              href="/boutiques"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-forest-900/60 transition hover:text-gold-500"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {catalogue === null ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[0.78] rounded-sm bg-ivory-200" />
                  <div className="mt-4 h-3 w-3/4 rounded bg-ivory-200" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-ivory-200" />
                </div>
              ))}
            </div>
          ) : catalogue.length === 0 ? (
            <div className="mt-12 rounded-[2rem] border border-forest-900/10 bg-ivory-100 p-12 text-center">
              <p className="font-display text-2xl text-forest-900">Le catalogue arrive très bientôt.</p>
              <p className="mt-2 text-sm text-forest-800/60">
                Nos pièces sont en cours de mise en ligne. Contactez-nous sur WhatsApp pour commander dès maintenant.
              </p>
              <a
                href={whatsappLink(`Bonjour ${SITE.nom}, quels articles avez-vous en ce moment ?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-forest-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory-50 transition hover:bg-forest-800"
              >
                <MessageCircle className="h-4 w-4" /> Nous écrire
              </a>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
              {catalogue.map((product) => (
                <article key={product.id} className="group min-w-0">
                  <Link href={`/produits/${product.slug}`} className="block">
                    <div className="relative aspect-[0.78] overflow-hidden bg-ivory-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 flex gap-2">
                        {product.badge && (
                          <span
                            className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                              product.badge === "Promotion" ? "bg-gold-500 text-white" : "bg-ivory-50 text-forest-900"
                            }`}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Ajouter ${product.name} aux favoris`}
                        onClick={(event) => {
                          event.preventDefault();
                          toggle(product.id);
                        }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory-50/90 text-forest-900 transition hover:bg-ivory-50"
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-gold-500 text-gold-500" : ""}`} />
                      </button>
                    </div>
                  </Link>
                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium text-forest-900">{product.name}</h3>
                        <p className="mt-1 text-[11px] text-forest-800/50">{product.category}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-semibold">{product.price.toLocaleString("fr-FR")} FCFA</p>
                        {product.oldPrice && (
                          <p className="mt-1 text-[10px] text-forest-800/35 line-through">
                            {product.oldPrice.toLocaleString("fr-FR")} FCFA
                          </p>
                        )}
                      </div>
                    </div>
                    {product.colors.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        {product.colors.map((color) => (
                          <span key={color} className="h-3 w-3 rounded-full border border-forest-900/10" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 bg-forest-900 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ivory-50 transition hover:bg-gold-500"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {added.includes(product.id) ? "Ajouté" : "Ajouter au panier"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

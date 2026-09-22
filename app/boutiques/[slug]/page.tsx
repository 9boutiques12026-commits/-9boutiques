import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BoutiquePage({ params }: { params: { slug: string } }) {
  const boutique = await prisma.boutique.findUnique({
    where: { slug: params.slug },
    include: { produits: { include: { images: { orderBy: { ordre: "asc" } } } } },
  });

  if (!boutique) {
    return (
      <main className="container-shell py-20">
        <p className="badge">404</p>
        <h1 className="section-title mt-5">Boutique introuvable</h1>
        <Button className="mt-8" asChild><Link href="/boutiques">Retour aux boutiques</Link></Button>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="container-shell pb-20 pt-12">
        <Link href="/boutiques" className="inline-flex items-center gap-2 text-sm text-forest-800/70"><ArrowLeft className="h-4 w-4" /> Toutes les boutiques</Link>
        <section className="mt-8 max-w-3xl">
          <p className="badge">Maison indépendante</p>
          <h1 className="section-title mt-5">{boutique.nom}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-forest-800/75">{boutique.description || "Une sélection singulière, imaginée avec patience."}</p>
        </section>
        <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {boutique.produits.map((produit) => (
            <Link key={produit.id} href={`/produits/${produit.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ivory-200">
                <Image src={produit.images[0]?.url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80"} alt={produit.nom} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div><h2 className="font-display text-2xl text-forest-900">{produit.nom}</h2><p className="mt-1 text-sm text-forest-800/65">{produit.stock > 0 ? "Disponible" : "Épuisé"}</p></div>
                <p className="text-sm font-medium text-forest-800">{Number(produit.prix).toLocaleString("fr-FR")} FCFA</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-forest-700 opacity-0 transition group-hover:opacity-100">Découvrir <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

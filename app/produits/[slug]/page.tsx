import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProduitPage({ params }: { params: { slug: string } }) {
  const produit = await prisma.produit.findUnique({
    where: { slug: params.slug },
    include: { boutique: true, images: { orderBy: { ordre: "asc" } } },
  });

  if (!produit) {
    return <main className="container-shell py-20"><h1 className="section-title">Produit introuvable</h1><Button className="mt-8" asChild><Link href="/boutiques">Explorer les boutiques</Link></Button></main>;
  }

  const images = produit.images.length ? produit.images : [{ id: "fallback", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80", ordre: 0 }];

  return (
    <>
      <Header />
      <main className="container-shell pb-20 pt-12">
        <Link href={`/boutiques/${produit.boutique.slug}`} className="text-sm text-forest-800/70">{produit.boutique.nom}</Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => <div key={image.id} className={`relative overflow-hidden rounded-[1.75rem] bg-ivory-200 ${index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}><Image src={image.url} alt={`${produit.nom} ${index + 1}`} fill className="object-cover" priority={index === 0} /></div>)}
          </div>
          <div className="flex flex-col justify-center">
            <p className="badge">{produit.boutique.nom}</p>
            <h1 className="mt-5 font-display text-5xl leading-none text-forest-900">{produit.nom}</h1>
            <p className="mt-5 text-xl text-forest-800">{Number(produit.prix).toLocaleString("fr-FR")} FCFA</p>
            <p className="mt-8 max-w-lg leading-7 text-forest-800/75">{produit.description || "Une pièce pensée pour traverser les saisons avec justesse."}</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-forest-800/70"><span className="h-2 w-2 rounded-full bg-forest-500" /> {produit.stock > 0 ? `${produit.stock} pièces disponibles` : "Rupture de stock"}</div>
            <AddToCartButton product={{ id: produit.id, name: produit.nom, price: Number(produit.prix), image: images[0].url }} disabled={produit.stock < 1} />
          </div>
        </div>
      </main>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/shared/header";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getBoutiques() {
  try {
    return await prisma.boutique.findMany({
      include: { produits: { include: { images: { orderBy: { ordre: "asc" } } } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BoutiquesPage() {
  const boutiques = await getBoutiques();

  return (
    <>
      <Header />
      <main className="container-shell pb-24 pt-14">
        {/* En-tête de section premium */}
        <div className="border-b border-forest-900/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500">
            Nos maisons
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-[-0.05em] text-forest-900 md:text-6xl">
            Les boutiques
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-forest-800/65">
            Chaque maison réunit une sélection cohérente de pièces. Choisissez celle
            qui correspond à votre style et parcourez ses articles.
          </p>
        </div>

        {boutiques.length === 0 ? (
          <div className="mt-14 rounded-[2rem] border border-forest-900/10 bg-ivory-100 p-12 text-center">
            <p className="font-display text-2xl text-forest-900">Aucune boutique pour le moment.</p>
            <p className="mt-2 text-sm text-forest-800/60">Les maisons seront publiées très prochainement.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {boutiques.map((boutique) => {
              const cover = boutique.produits.find((p) => p.images.length)?.images[0]?.url;
              return (
                <Link
                  key={boutique.id}
                  href={`/boutiques/${boutique.slug}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-forest-900/10 bg-ivory-50 shadow-luxe transition hover:-translate-y-1 hover:border-gold-500/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ivory-200">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={boutique.nom}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-5xl text-forest-900/20">
                        {boutique.nom.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-forest-900/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-2xl text-forest-900">{boutique.nom}</h2>
                    <p className="mt-2 text-sm leading-6 text-forest-800/70">{boutique.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
                        {boutique.produits.length} pièce{boutique.produits.length > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-2 text-xs font-medium text-forest-900/60 transition group-hover:text-gold-500">
                        Explorer <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

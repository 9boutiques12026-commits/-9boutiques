import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { prisma } from "@/lib/db";

async function getBoutiques() {
  return prisma.boutique.findMany({
    include: {
      produits: {
        include: {
          images: {
            orderBy: { ordre: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const boutiques = await getBoutiques();

  return (
    <>
      <Header />
      <main className="container-shell pb-20 pt-10">
        <section className="grid gap-8 rounded-[2.25rem] border border-forest-700/10 bg-forest-900 px-6 py-10 text-ivory-50 shadow-luxe md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-16">
          <div className="flex flex-col justify-center">
            <span className="badge border-ivory-100/20 bg-transparent text-ivory-100">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Mode de saison
            </span>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-none md:text-7xl">
              Ne cherchez plus. Trouvez votre signature.
            </h1>
            <p className="mt-5 max-w-lg text-base text-ivory-100/80 md:text-lg">
              Neuf boutiques indépendantes, une seule adresse pour découvrir les pièces qui
              racontent votre style.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="default" asChild>
                <Link href="#boutiques">Découvrir les boutiques</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/boutiques">Voir les collections</Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-forest-700 to-forest-900 p-4">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[1.5rem]">
              <Image
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
                alt="Mode premium"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-ivory-100/75">Edit</p>
                <p className="mt-2 font-display text-3xl text-ivory-50">Le dress code de la saison</p>
              </div>
            </div>
          </div>
        </section>

        <section id="boutiques" className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="badge">Boutiques</p>
              <h2 className="section-title mt-4">9 maisons, une curation exigeante</h2>
            </div>
            <Link href="/boutiques" className="inline-flex items-center gap-2 text-sm font-medium text-forest-800">
              Voir toutes les boutiques <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {boutiques.map((boutique) => {
              const firstImage = boutique.produits[0]?.images[0]?.url;

              return (
                <Link key={boutique.id} href={`/boutiques/${boutique.slug}`}>
                  <Card className="group h-full overflow-hidden border-forest-700/10 bg-ivory-50/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(18,39,31,0.12)]">
                    <div className="relative h-80 overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={firstImage || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"}
                        alt={boutique.nom}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-3xl text-forest-900">{boutique.nom}</h3>
                        <span className="rounded-full bg-gold-400/15 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-forest-800">
                          {boutique.produits.length} pièces
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-forest-800/75">
                        {boutique.description || "Collection premium pensée pour une garde-robe intime et singulière."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

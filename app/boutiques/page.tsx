import Link from "next/link";

import { prisma } from "@/lib/db";

async function getBoutiques() {
  try {
    return await prisma.boutique.findMany({
      include: { produits: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BoutiquesPage() {
  const boutiques = await getBoutiques();

  return (
    <main className="container-shell py-16">
      <p className="badge">Boutiques</p>
      <h1 className="section-title mt-4">Les maisons de la mode</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {boutiques.map((boutique) => (
          <Link key={boutique.id} href={`/boutiques/${boutique.slug}`} className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6 shadow-luxe">
            <h2 className="font-display text-3xl text-forest-900">{boutique.nom}</h2>
            <p className="mt-3 text-sm text-forest-800/75">{boutique.description}</p>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-forest-700">
              {boutique.produits.length} pièces
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [boutiques, produits] = await Promise.all([
    prisma.boutique.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.produit.findMany({ include: { boutique: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const serializableProduits = produits.map((produit) => ({
    ...produit,
    prix: Number(produit.prix),
  }));

  return <main className="container-shell py-16"><p className="badge">Administration</p><h1 className="section-title mt-5">Piloter 9boutiques</h1><p className="mt-4 max-w-xl text-forest-800/70">Un espace rapide pour gérer le catalogue sans perdre le fil de la collection.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/admin/produits/nouveau" className="rounded-full bg-forest-700 px-5 py-3 text-sm text-ivory-50">Nouveau produit</a><a href="/admin/commandes" className="rounded-full border border-forest-700/15 px-5 py-3 text-sm text-forest-800">Voir les commandes</a></div><AdminDashboard initialBoutiques={boutiques} initialProduits={serializableProduits} /></main>;
}

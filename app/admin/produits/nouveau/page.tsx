import { prisma } from "@/lib/db";
import { NewProductForm } from "@/app/admin/produits/nouveau/new-product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const boutiques = await prisma.boutique.findMany({ orderBy: { nom: "asc" }, select: { id: true, nom: true } });
  return <main className="container-shell py-16"><p className="badge">Catalogue</p><h1 className="section-title mt-5">Ajouter une pièce</h1><p className="mt-4 max-w-xl text-forest-800/70">Créez un produit, vérifiez ses images, puis publiez-le dans la bonne maison.</p><NewProductForm boutiques={boutiques} /></main>;
}

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getProduits() {
  return prisma.produit.findMany({
    include: {
      boutique: true,
      images: {
        orderBy: { ordre: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProduitBySlug(slug: string) {
  return prisma.produit.findUnique({
    where: { slug },
    include: {
      boutique: true,
      images: {
        orderBy: { ordre: "asc" },
      },
    },
  });
}

export async function createProduit(data: Prisma.ProduitCreateInput) {
  return prisma.produit.create({ data });
}

export async function updateProduit(id: string, data: Prisma.ProduitUpdateInput) {
  return prisma.produit.update({ where: { id }, data });
}

export async function deleteProduit(id: string) {
  return prisma.produit.delete({ where: { id } });
}

export async function createProduitImage(produitId: string, url: string, ordre: number) {
  return prisma.imageProduit.create({
    data: {
      produitId,
      url,
      ordre,
    },
  });
}

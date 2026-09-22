import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getBoutiques() {
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

export async function getBoutiqueBySlug(slug: string) {
  return prisma.boutique.findUnique({
    where: { slug },
    include: {
      produits: {
        include: {
          images: {
            orderBy: { ordre: "asc" },
          },
        },
      },
    },
  });
}

export async function createBoutique(data: Prisma.BoutiqueCreateInput) {
  return prisma.boutique.create({ data });
}

export async function updateBoutique(slug: string, data: Prisma.BoutiqueUpdateInput) {
  return prisma.boutique.update({
    where: { slug },
    data,
  });
}

export async function deleteBoutique(slug: string) {
  return prisma.boutique.delete({ where: { slug } });
}

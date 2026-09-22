import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getCommandes() {
  return prisma.commande.findMany({
    include: {
      utilisateur: true,
      lignes: {
        include: {
          produit: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCommande(data: Prisma.CommandeCreateInput) {
  return prisma.commande.create({ data });
}

export async function updateCommandeStatut(id: string, statut: Prisma.CommandeUpdateInput["statut"]) {
  return prisma.commande.update({
    where: { id },
    data: { statut },
  });
}

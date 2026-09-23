import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

const ligneSchema = z.object({
  produitId: z.string().min(1),
  quantite: z.number().int().positive(),
  prixUnitaire: z.number().positive(),
});

const commandeSchema = z.object({
  utilisateurId: z.string().min(1),
  statut: z.enum(["en_attente", "confirme", "expedie", "livre", "annule"]).optional(),
  total: z.number().positive(),
  lignes: z.array(ligneSchema).min(1),
});

export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
      include: {
        utilisateur: true,
        lignes: { include: { produit: true } },
      },
    });

    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer les commandes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Connectez-vous pour passer commande." }, { status: 401 });
    const body = await request.json();
    const parsed = commandeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const productIds = parsed.data.lignes.map((ligne) => ligne.produitId);
    const produits = await prisma.produit.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(produits.map((produit) => [produit.id, produit]));
    let total = 0;
    const lignes = parsed.data.lignes.map((ligne) => {
      const produit = productMap.get(ligne.produitId);
      if (!produit) throw new Error("Produit introuvable.");
      if (produit.stock < ligne.quantite) throw new Error(`Stock insuffisant pour ${produit.nom}.`);
      const prix = Number(produit.prixPromo ?? produit.prix);
      total += prix * ligne.quantite;
      return { produitId: produit.id, quantite: ligne.quantite, prixUnitaire: prix };
    });

    const commande = await prisma.$transaction(async (transaction) => {
      for (const ligne of lignes) {
        await transaction.produit.update({ where: { id: ligne.produitId }, data: { stock: { decrement: ligne.quantite } } });
      }
      return transaction.commande.create({
        data: { utilisateurId: session.user.id, statut: "en_attente", total, lignes: { create: lignes } },
        include: { lignes: true },
      });
    });

    return NextResponse.json(commande, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith("Stock insuffisant") || error.message === "Produit introuvable.")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "La commande n’a pas pu être créée." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

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
    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }
    const body = await request.json();
    const parsed = commandeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const commande = await prisma.commande.create({
      data: {
        utilisateurId: parsed.data.utilisateurId,
        statut: parsed.data.statut ?? "en_attente",
        total: parsed.data.total,
        lignes: {
          create: parsed.data.lignes.map((ligne) => ({
            produitId: ligne.produitId,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
          })),
        },
      },
      include: {
        lignes: true,
      },
    });

    return NextResponse.json(commande, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "La commande n’a pas pu être créée." },
      { status: 500 },
    );
  }
}

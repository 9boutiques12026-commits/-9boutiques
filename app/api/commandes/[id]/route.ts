import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

const statusSchema = z.object({
  statut: z.enum(["en_attente", "confirme", "expedie", "livre", "annule"]),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.id },
    include: { utilisateur: true, lignes: { include: { produit: true } } },
  });

  if (!commande) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  return NextResponse.json(commande);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user || !hasAdminAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
  }
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Statut de commande invalide.", details: parsed.error.flatten() }, { status: 400 });

  try {
    const commande = await prisma.commande.update({
      where: { id: params.id },
      data: { statut: parsed.data.statut },
    });
    return NextResponse.json(commande);
  } catch {
    return NextResponse.json({ error: "La commande n’a pas pu être mise à jour." }, { status: 404 });
  }
}

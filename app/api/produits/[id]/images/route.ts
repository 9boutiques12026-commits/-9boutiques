import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

const imageSchema = z.object({
  url: z.string().url(),
  ordre: z.number().int().min(0).default(0),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getCurrentSession();
    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }
    const body = await request.json();
    const parsed = imageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const produit = await prisma.produit.findUnique({ where: { id: params.id } });
    if (!produit) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    const image = await prisma.imageProduit.create({
      data: {
        produitId: params.id,
        url: parsed.data.url,
        ordre: parsed.data.ordre,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "L’image n’a pas pu être ajoutée." },
      { status: 500 },
    );
  }
}

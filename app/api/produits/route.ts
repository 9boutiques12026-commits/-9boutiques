import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

const produitSchema = z.object({
  nom: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  prix: z.number().positive(),
  stock: z.number().int().min(0),
  boutiqueId: z.string().min(1),
});

export async function GET() {
  try {
    const produits = await prisma.produit.findMany({
      include: {
        boutique: true,
        images: { orderBy: { ordre: "asc" } },
      },
    });

    return NextResponse.json(produits, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer les produits." },
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
    const parsed = produitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const produit = await prisma.produit.create({
      data: {
        ...parsed.data,
        prix: parsed.data.prix,
      },
    });

    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Le produit n’a pas pu être créé." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }
    const body = await request.json();
    const id = body.id as string | undefined;

    if (!id) {
      return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });
    }

    const parsed = produitSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const produit = await prisma.produit.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(produit, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Le produit n’a pas pu être modifié." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });
    }

    await prisma.produit.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Le produit n’a pas pu être supprimé." },
      { status: 500 },
    );
  }
}

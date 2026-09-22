import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

const boutiqueSchema = z.object({
  nom: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const boutiques = await prisma.boutique.findMany({
      include: {
        produits: {
          include: {
            images: { orderBy: { ordre: "asc" } },
          },
        },
      },
    });

    return NextResponse.json(boutiques, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer les boutiques." },
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
    const parsed = boutiqueSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const boutique = await prisma.boutique.create({
      data: {
        ...parsed.data,
        logoUrl: parsed.data.logoUrl || null,
      },
    });

    return NextResponse.json(boutique, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "La boutique n’a pas pu être créée." },
      { status: 500 },
    );
  }
}

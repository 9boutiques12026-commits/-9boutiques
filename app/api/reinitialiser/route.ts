import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { hashPassword, hashToken } from "@/lib/services/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Demande invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const record = await prisma.jetonMotDePasse.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });

  if (!record || record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau." },
      { status: 400 },
    );
  }

  const motDePasseHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.utilisateur.update({
      where: { id: record.userId },
      data: { motDePasseHash },
    }),
    // Le jeton est à usage unique : on supprime tous les jetons de l'utilisateur.
    prisma.jetonMotDePasse.deleteMany({ where: { userId: record.userId } }),
  ]);

  return NextResponse.json({ ok: true, message: "Votre mot de passe a bien été réinitialisé." });
}

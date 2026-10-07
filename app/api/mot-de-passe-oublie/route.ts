import crypto from "crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { appUrl, isEmailConfigured, sendPasswordResetEmail } from "@/lib/services/email";
import { hashToken } from "@/lib/services/auth";
import { SITE, whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email() });

const TOKEN_TTL_MINUTES = 30;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  // En production, si l'envoi d'email n'est pas configuré : on ne fait PAS
  // semblant d'envoyer un lien. On renvoie honnêtement le canal WhatsApp.
  // (Cet état est global au site, il ne révèle donc rien sur le compte saisi.)
  if (!isEmailConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json({
      ok: false,
      emailUnavailable: true,
      message: "La réinitialisation automatique par email n'est pas encore activée sur le site. Écris-nous sur WhatsApp et nous réinitialiserons ton accès avec toi.",
      whatsapp: SITE.whatsappAffiche,
      whatsappUrl: whatsappLink(`Bonjour ${SITE.nom}, je n'arrive plus à me connecter à mon compte et j'ai besoin de réinitialiser mon mot de passe.`),
    });
  }

  const user = await prisma.utilisateur.findUnique({ where: { email } });

  // Réponse identique que le compte existe ou non (évite l'énumération d'emails).
  const generic = { ok: true, message: "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé." };

  if (!user) {
    return NextResponse.json(generic);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  // Un seul jeton actif par utilisateur : on purge les anciens.
  await prisma.jetonMotDePasse.deleteMany({ where: { userId: user.id } });
  await prisma.jetonMotDePasse.create({
    data: { tokenHash: hashToken(token), userId: user.id, expiresAt },
  });

  const resetUrl = appUrl(`/reinitialiser?token=${token}`);
  const result = await sendPasswordResetEmail(user.email, resetUrl);

  // Hors production et sans SMTP configuré : on renvoie le lien pour pouvoir
  // tester le flux immédiatement. Jamais exposé en production.
  if (process.env.NODE_ENV !== "production" && !result.delivered) {
    return NextResponse.json({ ...generic, emailConfigured: false, devResetUrl: resetUrl });
  }

  return NextResponse.json({ ...generic, emailConfigured: isEmailConfigured() });
}

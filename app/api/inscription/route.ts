import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/services/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Email ou mot de passe invalide.", details: parsed.error.flatten() }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.utilisateur.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });

  const user = await prisma.utilisateur.create({
    data: { email, motDePasseHash: await hashPassword(parsed.data.password), role: "client" },
    select: { id: true, email: true, role: true },
  });
  return NextResponse.json(user, { status: 201 });
}

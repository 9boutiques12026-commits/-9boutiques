import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma } from "@/lib/db";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(email: string) {
  return prisma.utilisateur.findUnique({ where: { email } });
}

// Hachage SHA-256 du jeton de réinitialisation : on ne stocke jamais le jeton
// brut en base, seulement son empreinte (comme pour les mots de passe).
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}


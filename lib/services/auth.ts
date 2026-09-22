import bcrypt from "bcryptjs";
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

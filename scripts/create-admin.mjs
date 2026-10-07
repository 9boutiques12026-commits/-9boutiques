// Crée (ou promeut) le compte administrateur de 9boutiques.
// Usage local :  ADMIN_EMAIL="..." ADMIN_PASSWORD="..." node scripts/create-admin.mjs
// Usage Render : renseigner ADMIN_EMAIL / ADMIN_PASSWORD dans les variables
//                d'environnement, puis lancer ce script une fois.
//
// Ce script ne touche QUE le compte admin : il ne réinjecte ni boutiques ni
// produits de démonstration, il est donc sûr à exécuter en production.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function readCredentials() {
  // 1) variables d'environnement, 2) arguments en ligne de commande
  const [emailArg, passwordArg] = process.argv.slice(2);
  const email = (process.env.ADMIN_EMAIL || emailArg || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || passwordArg || "";

  const errors = [];
  if (!email) errors.push("ADMIN_EMAIL est vide.");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(`Email invalide : "${email}".`);
  if (!password) errors.push("ADMIN_PASSWORD est vide.");
  else if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères.");

  if (errors.length) {
    console.error("✗ Impossible de créer l'admin :");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  return { email, password };
}

async function main() {
  const { email, password } = readCredentials();
  const motDePasseHash = await bcrypt.hash(password, 10);

  const existing = await prisma.utilisateur.findUnique({ where: { email } });

  if (existing) {
    await prisma.utilisateur.update({
      where: { email },
      data: { motDePasseHash, role: "admin" },
    });
    console.log(`✓ Compte existant promu admin et mot de passe mis à jour : ${email}`);
  } else {
    await prisma.utilisateur.create({
      data: { email, motDePasseHash, role: "admin" },
    });
    console.log(`✓ Compte administrateur créé : ${email}`);
  }

  console.log("  Rôle : admin");
  console.log("  Connexion : page /login, puis accès automatique à /admin");
}

main()
  .catch((error) => {
    console.error("✗ Erreur :", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

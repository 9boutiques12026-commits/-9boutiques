// ============================================================
//  Création automatique du compte admin PENDANT LE BUILD Render.
//  ------------------------------------------------------------
//  - Lit ADMIN_EMAIL et ADMIN_PASSWORD dans les variables
//    d'environnement du service (Render Free : pas de Shell,
//    donc on crée le compte au déploiement).
//  - Si ces variables sont absentes, le script ne fait RIEN et
//    sort en succès (0) : le build ne casse jamais.
//  - Idempotent : relancé à chaque déploiement, il met à jour le
//    même compte au lieu de le dupliquer.
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

async function main() {
  if (!email || !password) {
    console.log(
      "ℹ ADMIN_EMAIL / ADMIN_PASSWORD non définis : création de l'admin ignorée. " +
        "Renseigne-les dans Render > Environment puis redéploie.",
    );
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(`✗ ADMIN_EMAIL invalide : "${email}". Admin non créé.`);
    return;
  }

  const motDePasseHash = await bcrypt.hash(password, 10);
  const existing = await prisma.utilisateur.findUnique({ where: { email } });

  if (existing) {
    await prisma.utilisateur.update({
      where: { email },
      data: { motDePasseHash, role: "admin" },
    });
    console.log(`✓ Compte admin mis à jour (rôle + mot de passe) : ${email}`);
  } else {
    await prisma.utilisateur.create({
      data: { email, motDePasseHash, role: "admin" },
    });
    console.log(`✓ Compte administrateur créé en base : ${email}`);
  }
}

main()
  .catch((error) => {
    // On n'interrompt volontairement pas le déploiement pour un échec admin :
    // le site doit rester en ligne même si l'admin n'a pas pu être créé.
    console.error("✗ Création de l'admin a échoué (le build continue) :", error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

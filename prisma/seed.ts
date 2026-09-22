import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const developerEmail = "developer@9boutiques.fr";
  const passwordHash = await bcrypt.hash("9boutiques-dev", 10);

  const existing = await prisma.utilisateur.findUnique({ where: { email: developerEmail } });
  if (!existing) {
    await prisma.utilisateur.create({
      data: {
        email: developerEmail,
        motDePasseHash: passwordHash,
        role: "developer",
      },
    });
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await prisma.utilisateur.upsert({
      where: { email: adminEmail },
      update: { motDePasseHash: adminHash, role: "admin" },
      create: { email: adminEmail, motDePasseHash: adminHash, role: "admin" },
    });
  }

  const boutiqueSeeds = [
    { nom: "Lune Atelier", slug: "lune-atelier", description: "Silhouettes discrètes et textures raffinées." },
    { nom: "Velours Dune", slug: "velours-dune", description: "Mode douce, féminine et structurée." },
    { nom: "Miroir & Cuir", slug: "miroir-cuir", description: "Éléments de caractère pour les looks audacieux." },
  ];

  for (const boutique of boutiqueSeeds) {
    const exists = await prisma.boutique.findUnique({ where: { slug: boutique.slug } });
    if (!exists) {
      await prisma.boutique.create({ data: boutique });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  const catalogue = [
    {
      boutiqueSlug: "lune-atelier",
      nom: "Jaguar Power",
      slug: "jaguar-power",
      description: "Sachets Jaguar Power, disponible en livraison discrète.",
      prix: 5000,
      stock: 20,
      image: "/produits/article-01.jpg",
    },
    {
      boutiqueSlug: "velours-dune",
      nom: "Culotte Jean",
      slug: "culotte-jean",
      description: "Culotte jean délavée, coupe confortable pour le quotidien.",
      prix: 7000,
      stock: 10,
      image: "/produits/article-07.jpg",
    },
    {
      boutiqueSlug: "miroir-cuir",
      nom: "Jean Gros Bas",
      slug: "jean-gros-bas",
      description: "Jean gros bas délavé, coupe ample et style affirmé.",
      prix: 12000,
      stock: 10,
      image: "/produits/article-09.jpg",
    },
    {
      boutiqueSlug: "lune-atelier",
      nom: "Gode vibrant",
      slug: "gode-vibrant",
      description: "Gode vibrant proposé à l’unité, avec emballage discret.",
      prix: 15000,
      stock: 8,
      image: "/produits/article-24.jpg",
    },
    {
      boutiqueSlug: "lune-atelier",
      nom: "Huile parfumée",
      slug: "huile-parfumee",
      description: "Huile parfumée proposée à l’unité.",
      prix: 10000,
      stock: 10,
      image: "/produits/article-06.jpg",
    },
  ];

  for (const item of catalogue) {
    const boutique = await prisma.boutique.findUnique({ where: { slug: item.boutiqueSlug } });
    if (!boutique) continue;
    const product = await prisma.produit.upsert({
      where: { slug: item.slug },
      update: { nom: item.nom, description: item.description, prix: item.prix, stock: item.stock, boutiqueId: boutique.id },
      create: { nom: item.nom, slug: item.slug, description: item.description, prix: item.prix, stock: item.stock, boutiqueId: boutique.id },
    });
    await prisma.imageProduit.upsert({
      where: { id: `${product.id}-cover` },
      update: { url: item.image, ordre: 0 },
      create: { id: `${product.id}-cover`, produitId: product.id, url: item.image, ordre: 0 },
    });
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

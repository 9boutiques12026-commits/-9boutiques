-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT IF EXISTS "Commande_utilisateurId_fkey";

-- AlterTable
ALTER TABLE "Commande" ALTER COLUMN "utilisateurId" DROP NOT NULL,
ADD COLUMN IF NOT EXISTS "nomClient" TEXT,
ADD COLUMN IF NOT EXISTS "telephone" TEXT,
ADD COLUMN IF NOT EXISTS "adresse" TEXT,
ADD COLUMN IF NOT EXISTS "ville" TEXT,
ADD COLUMN IF NOT EXISTS "modePaiement" TEXT NOT NULL DEFAULT 'especes_livraison',
ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

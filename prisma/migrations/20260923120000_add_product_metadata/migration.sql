-- CreateEnum
CREATE TYPE "ProduitStatut" AS ENUM ('brouillon', 'publie');

-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "categorie" TEXT,
ADD COLUMN     "couleurs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "marque" TEXT,
ADD COLUMN     "prixPromo" DECIMAL(10,2),
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "statut" "ProduitStatut" NOT NULL DEFAULT 'brouillon',
ADD COLUMN     "tailles" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Produit_sku_key" ON "Produit"("sku");


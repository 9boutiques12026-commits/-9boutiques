-- CreateTable
CREATE TABLE "JetonMotDePasse" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JetonMotDePasse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JetonMotDePasse_tokenHash_key" ON "JetonMotDePasse"("tokenHash");

-- CreateIndex
CREATE INDEX "JetonMotDePasse_userId_idx" ON "JetonMotDePasse"("userId");

-- AddForeignKey
ALTER TABLE "JetonMotDePasse" ADD CONSTRAINT "JetonMotDePasse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

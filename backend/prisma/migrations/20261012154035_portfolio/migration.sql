-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "braiderId" TEXT NOT NULL,
    "imageSrc" TEXT,
    "imageAlt" TEXT,
    "caption" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioItem_braiderId_createdAt_idx" ON "PortfolioItem"("braiderId", "createdAt");

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_braiderId_fkey" FOREIGN KEY ("braiderId") REFERENCES "Braider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

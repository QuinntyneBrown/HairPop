-- CreateEnum
CREATE TYPE "StyleCategory" AS ENUM ('braids', 'twists', 'locs');

-- CreateTable
CREATE TABLE "Style" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "StyleCategory" NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "imageSrc" TEXT,
    "imageAlt" TEXT,
    "typicalHoursMin" DOUBLE PRECISION,
    "typicalHoursMax" DOUBLE PRECISION,
    "typicalPriceMin" INTEGER,
    "typicalPriceMax" INTEGER,
    "intro" TEXT NOT NULL DEFAULT '',
    "typicalWearMin" INTEGER,
    "typicalWearMax" INTEGER,
    "variations" JSONB NOT NULL DEFAULT '[]',
    "quoteFactors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE INDEX "Style_published_sortOrder_idx" ON "Style"("published", "sortOrder");

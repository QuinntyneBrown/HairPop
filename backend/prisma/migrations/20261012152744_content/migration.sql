-- CreateTable
CREATE TABLE "ContentPage" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "effectiveDate" DATE,
    "sections" JSONB NOT NULL,
    "supportEmail" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPage_pkey" PRIMARY KEY ("slug")
);

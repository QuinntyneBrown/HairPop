-- CreateTable
CREATE TABLE "ConsentPreference" (
    "id" TEXT NOT NULL,
    "optionalUsage" BOOLEAN NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentPreference_pkey" PRIMARY KEY ("id")
);

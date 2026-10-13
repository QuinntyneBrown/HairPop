-- AlterTable
ALTER TABLE "BraiderService" ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;


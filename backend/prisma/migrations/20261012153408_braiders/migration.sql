-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('published', 'pending', 'removed');

-- CreateTable
CREATE TABLE "Braider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "photoSrc" TEXT,
    "photoAlt" TEXT,
    "area" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "travelKm" INTEGER,
    "bio" TEXT NOT NULL DEFAULT '',
    "studioAddress" TEXT,
    "preparationPolicy" TEXT,
    "changePolicy" TEXT,
    "cancellationPolicy" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Braider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BraiderService" (
    "id" TEXT NOT NULL,
    "braiderId" TEXT NOT NULL,
    "styleSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startingPrice" INTEGER NOT NULL,
    "typicalHours" DOUBLE PRECISION NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BraiderService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferedSlot" (
    "id" TEXT NOT NULL,
    "braiderId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "maxHours" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "braiderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Braider_slug_key" ON "Braider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Braider_userId_key" ON "Braider"("userId");

-- CreateIndex
CREATE INDEX "BraiderService_styleSlug_published_idx" ON "BraiderService"("styleSlug", "published");

-- CreateIndex
CREATE INDEX "BraiderService_braiderId_idx" ON "BraiderService"("braiderId");

-- CreateIndex
CREATE INDEX "OfferedSlot_braiderId_start_idx" ON "OfferedSlot"("braiderId", "start");

-- CreateIndex
CREATE INDEX "Review_braiderId_status_createdAt_idx" ON "Review"("braiderId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "Braider" ADD CONSTRAINT "Braider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BraiderService" ADD CONSTRAINT "BraiderService_braiderId_fkey" FOREIGN KEY ("braiderId") REFERENCES "Braider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BraiderService" ADD CONSTRAINT "BraiderService_styleSlug_fkey" FOREIGN KEY ("styleSlug") REFERENCES "Style"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferedSlot" ADD CONSTRAINT "OfferedSlot_braiderId_fkey" FOREIGN KEY ("braiderId") REFERENCES "Braider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_braiderId_fkey" FOREIGN KEY ("braiderId") REFERENCES "Braider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BraiderService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

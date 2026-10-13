-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('awaiting_reply', 'confirmed', 'declined', 'cancelled');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "braiderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "slotId" TEXT,
    "heldSlotId" TEXT,
    "serviceName" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "estimateMin" INTEGER NOT NULL,
    "estimateMax" INTEGER,
    "agreedAmount" INTEGER,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "hairDetails" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "changePolicy" TEXT NOT NULL,
    "cancellationPolicy" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'awaiting_reply',
    "version" INTEGER NOT NULL DEFAULT 1,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_number_key" ON "Appointment"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_heldSlotId_key" ON "Appointment"("heldSlotId");

-- CreateIndex
CREATE INDEX "Appointment_customerId_start_idx" ON "Appointment"("customerId", "start");

-- CreateIndex
CREATE INDEX "Appointment_braiderId_status_idx" ON "Appointment"("braiderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_customerId_idempotencyKey_key" ON "Appointment"("customerId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_braiderId_fkey" FOREIGN KEY ("braiderId") REFERENCES "Braider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BraiderService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "OfferedSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- References start at HP-1001; TRUNCATE ... RESTART IDENTITY returns here too.
ALTER SEQUENCE "Appointment_number_seq" START WITH 1001 RESTART WITH 1001;

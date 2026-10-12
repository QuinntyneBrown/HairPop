-- CreateEnum
CREATE TYPE "ChangeStatus" AS ENUM ('pending', 'accepted', 'declined', 'withdrawn');

-- CreateTable
CREATE TABLE "AppointmentChange" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "slotId" TEXT,
    "heldSlotId" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" "ChangeStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "AppointmentChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChange_heldSlotId_key" ON "AppointmentChange"("heldSlotId");

-- CreateIndex
CREATE INDEX "AppointmentChange_appointmentId_status_idx" ON "AppointmentChange"("appointmentId", "status");

-- AddForeignKey
ALTER TABLE "AppointmentChange" ADD CONSTRAINT "AppointmentChange_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChange" ADD CONSTRAINT "AppointmentChange_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "OfferedSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "booking_locks" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "bookingDate" TEXT NOT NULL,
    "bookingTime" TEXT NOT NULL,
    "lockedBy" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_locks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_locks_expiresAt_idx" ON "booking_locks"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "booking_locks_experienceId_bookingDate_bookingTime_key" ON "booking_locks"("experienceId", "bookingDate", "bookingTime");

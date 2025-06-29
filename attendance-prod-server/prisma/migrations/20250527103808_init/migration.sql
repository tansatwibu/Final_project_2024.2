/*
  Warnings:

  - You are about to drop the `ShiftPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftPlan" DROP CONSTRAINT "ShiftPlan_shiftId_fkey";

-- DropTable
DROP TABLE "ShiftPlan";

-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSession_employeeId_key" ON "ActiveSession"("employeeId");

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

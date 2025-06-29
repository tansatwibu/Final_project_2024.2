-- DropForeignKey
ALTER TABLE "ActiveSession" DROP CONSTRAINT "ActiveSession_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionLog" DROP CONSTRAINT "ProductionLog_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

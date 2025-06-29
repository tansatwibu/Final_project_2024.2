-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

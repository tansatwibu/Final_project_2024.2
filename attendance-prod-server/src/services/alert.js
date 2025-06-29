const cron = require('node-cron');
const prisma = require('../utils/prismaClient');

async function checkAlerts(io) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lấy tất cả các ca hôm nay
  const shifts = await prisma.shift.findMany({
    where: {
      startTime: { gte: today }
    }
  });

  for (const shift of shifts) {
    // Lấy danh sách nhân viên có trong ca này (dựa vào logs)
    const employees = await prisma.employee.findMany();

    for (const emp of employees) {
      // 1. Đi trễ: Có log IN nhưng sau giờ bắt đầu ca
      const lateLog = await prisma.attendanceLog.findFirst({
        where: {
          employeeId: emp.id,
          shiftId: shift.id,
          type: 'IN',
          timestamp: { gt: shift.startTime }
        }
      });
      if (lateLog) {
        const exist = await prisma.alert.findFirst({
          where: {
            type: 'late',
            employeeId: emp.id,
            shiftId: shift.id,
            date: today
          }
        });
        if (!exist) {
          const newAlert = await prisma.alert.create({
            data: {
              type: 'late',
              employeeId: emp.id,
              shiftId: shift.id,
              date: today,
              message: `${emp.name} đi trễ ca ${shift.name}`
            }
          });
          io.emit('alert', newAlert);
        }
      }

      // 2. Vắng mặt: Không có log IN cho ca
      const inLog = await prisma.attendanceLog.findFirst({
        where: {
          employeeId: emp.id,
          shiftId: shift.id,
          type: 'IN'
        }
      });
      if (!inLog) {
        const exist = await prisma.alert.findFirst({
          where: {
            type: 'absent',
            employeeId: emp.id,
            shiftId: shift.id,
            date: today
          }
        });
        if (!exist) {
          const newAlert = await prisma.alert.create({
            data: {
              type: 'absent',
              employeeId: emp.id,
              shiftId: shift.id,
              date: today,
              message: `${emp.name} vắng mặt ca ${shift.name}`
            }
          });
          io.emit('alert', newAlert);
        }
      }
    }
  }
}
exports.start = () => {
  cron.schedule('*/5 * * * *', async () => {
    const io = require('../app').app.get('io');
    await checkAlerts(io);
  });
};
const prisma = require('../utils/prismaClient');

exports.scan = async (req, res) => {
  console.log("Request body:", req.body);
  const io = req.app.get('io');
  const { rfid, timestamp } = req.body;

  try {
    // 1. Tìm employee
    const emp = await prisma.employee.findUnique({
      where: { rfidTag: rfid },
      include: { ActiveSession: true },
    });

    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    // 2. Xác định ca hiện tại
    const shift = await prisma.shift.findFirst({
      where: {
        startTime: { lte: timestamp },
        endTime: { gte: timestamp }
      }
    });

    if (!shift) return res.status(404).json({ error: 'Shift not found' });

    // 3. Kiểm tra xem có active session nào đang tồn tại của employee khác không
    const activeSessions = await prisma.activeSession.findMany();

    const otherActiveSession = activeSessions.find(session => session.employeeId !== emp.id);

    if (otherActiveSession) {
      // Có người khác đang làm việc => từ chối bắt đầu ca mới
      return res.status(400).json({ error: 'Another employee is currently working' });
    }

    let type;
    let message;

    if (!emp.ActiveSession) {
      // Bắt đầu phiên làm việc
      await prisma.activeSession.create({
        data: {
          employeeId: emp.id,
          shiftId: shift.id,
          startedAt: timestamp
        }
      });

      type = 'IN';
      message = 'Work session started';
    } else {
      // Kết thúc phiên làm việc
      await prisma.activeSession.delete({
        where: {
          employeeId: emp.id
        }
      });

      type = 'OUT';
      message = 'Work session ended';
    }

    // 4. Tạo log chấm công
    const log = await prisma.attendanceLog.create({
      data: {
        employeeId: emp.id,
        shiftId: shift.id,
        timestamp,
        type
      }
    });

    // 5. Emit sự kiện real-time
    io.emit('attendance_added', log);

    res.json({ message, log });

  } catch (error) {
    console.error('Error during attendance scan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.status = async (req, res) => {
  const { rfid } = req.query;

  if (!rfid) {
    return res.status(400).json({ error: 'Missing RFID' });
  }

  try {
    const emp = await prisma.employee.findUnique({
      where: { rfidTag: rfid },
      include: { ActiveSession: true }
    });

    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    if (emp.ActiveSession) {
      res.json({ status: "IN", startedAt: emp.ActiveSession.startedAt });
    } else {
      res.json({ status: "OUT" });
    }
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAttendanceLogs = async (req, res) => {
  try {
    const logs = await prisma.attendanceLog.findMany({
      include: {
        employee: { select: { name: true } },
        shift: { select: { name: true } }
      },
      orderBy: { timestamp: 'desc' }
    });
    const result = logs.map(log => ({
      id: log.id,
      employeeName: log.employee?.name,
      shiftName: log.shift?.name,
      type: log.type,
      timestamp: log.timestamp,
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const prisma = require('../utils/prismaClient');

// Lấy danh sách ca
exports.list = async (req, res) => {
  const shifts = await prisma.shift.findMany();
  res.json(shifts);
};

// Tạo ca mới
exports.create = async (req, res) => {
  let { name, startTime, endTime, plannedQuantity } = req.body;

  // Nếu thiếu giây, thêm ':00'
  if (startTime && startTime.length === 16) startTime += ':00';
  if (endTime && endTime.length === 16) endTime += ':00';

  // Chuyển sang đối tượng Date
  startTime = startTime ? new Date(startTime) : undefined;
  endTime = endTime ? new Date(endTime) : undefined;

  // Kiểm tra dữ liệu hợp lệ
  if (!name || !startTime || !endTime || !plannedQuantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Kiểm tra trùng thời gian
  const overlapping = await prisma.shift.findFirst({
    where: {
      OR: [
        {
          startTime: { lte: endTime },
          endTime: { gte: startTime }
        }
      ]
    }
  });

  if (overlapping) {
    return res.status(400).json({ error: 'Shift time overlaps with an existing shift' });
  }

  const shift = await prisma.shift.create({
    data: { name, startTime, endTime, plannedQuantity }
  });

  res.status(201).json(shift);
};

// Cập nhật ca
exports.update = async (req, res) => {
  const { id } = req.params;
  let { name, startTime, endTime, plannedQuantity } = req.body;

  // Nếu thiếu giây, thêm ':00'
  if (startTime && startTime.length === 16) startTime += ':00';
  if (endTime && endTime.length === 16) endTime += ':00';

  // Chuyển sang đối tượng Date
  startTime = startTime ? new Date(startTime) : undefined;
  endTime = endTime ? new Date(endTime) : undefined;

  // Kiểm tra nếu đang có session đang hoạt động
  const activeCount = await prisma.activeSession.count({
    where: { shiftId: Number(id) }
  });

  if (activeCount > 0) {
    return res.status(400).json({ error: 'Cannot update a shift with active sessions' });
  }

  const shift = await prisma.shift.update({
    where: { id: Number(id) },
    data: { name, startTime, endTime, plannedQuantity }
  });

  res.json(shift);
};

// Xóa ca
exports.remove = async (req, res) => {
  const { id } = req.params;

  const hasActiveSession = await prisma.activeSession.findFirst({
    where: { shiftId: Number(id) }
  });

  if (hasActiveSession) {
    return res.status(400).json({ error: 'Cannot delete shift with active sessions' });
  }

  await prisma.shift.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

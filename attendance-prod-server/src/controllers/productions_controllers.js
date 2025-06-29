const prisma = require('../utils/prismaClient');

exports.scan = async (req, res) => {
  const io = req.app.get('io');
  const { rfid, productCode, timestamp, quantity } = req.body;

  try {
    // 1. Tìm employee và kiểm tra phiên làm việc đang hoạt động
    const emp = await prisma.employee.findUnique({
      where: { rfidTag: rfid },
      include: { ActiveSession: true }
    });

    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    // 2. Kiểm tra xem employee có đang trong ca không
    if (!emp.ActiveSession) {
      return res.status(403).json({ error: 'Employee is not in an active session' });
    }

    // 3. Tìm sản phẩm
    const product = await prisma.product.findUnique({ where: { code: productCode } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 4. Ghi log sản xuất
    const log = await prisma.productionLog.create({
      data: {
        employeeId: emp.id,
        shiftId: emp.ActiveSession.shiftId,
        productId: product.id,
        timestamp,
        quantity: quantity || 1
      }
    });

    // 5. Emit sự kiện real-time
    io.emit('production_added', log);
    res.json({ message: 'Production log created', log });

  } catch (error) {
    console.error('Error during production scan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getProductionLogs = async (req, res) => {
  try {
    const logs = await prisma.productionLog.findMany({
      include: {
        employee: { select: { name: true } },
        product: { select: { name: true, code: true } },
      },
      orderBy: { timestamp: 'desc' }
    });
    // Định dạng lại dữ liệu nếu cần
    const result = logs.map(log => ({
      id: log.id,
      employeeName: log.employee?.name,
      productName: log.product?.name,
      productCode: log.product?.code,
      quantity: log.quantity,
      timestamp: log.timestamp,
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching production logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

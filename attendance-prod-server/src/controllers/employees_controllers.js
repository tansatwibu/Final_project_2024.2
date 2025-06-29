const prisma = require('../utils/prismaClient');

exports.list = async (req, res) => {
  const emps = await prisma.employee.findMany();
  res.json(emps);
};

exports.create = async (req, res) => {
  const { name, rfidTag } = req.body;
  const emp = await prisma.employee.create({ data: { name, rfidTag } });
  res.status(201).json(emp);
};

// update, remove tương tự…
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, rfidTag } = req.body;
  const emp = await prisma.employee.update({
    where: { id: Number(id) },
    data: { name, rfidTag },
  });
  res.json(emp);
};
exports.remove = async (req, res) => {
  const { id } = req.params;
  await prisma.employee.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

const jwt = require('jsonwebtoken');

exports.loginEmployee = async (req, res) => {
  const { rfidTag } = req.body;
  const emp = await prisma.employee.findUnique({ where: { rfidTag } });
  if (!emp) return res.status(401).json({ error: 'Invalid RFID' });

  // Tạo JWT cho employee
  const token = jwt.sign(
    { employeeId: emp.id, name: emp.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token, name: emp.name });
};

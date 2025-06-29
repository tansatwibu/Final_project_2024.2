const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // Tạo JWT
  const token = jwt.sign({ adminId: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
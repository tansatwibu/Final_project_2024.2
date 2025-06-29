const prisma = require('../utils/prismaClient');

exports.list = async (req, res) => {
  const pro = await prisma.product.findMany();
  res.json(pro);
};

exports.create = async (req, res) => {
  const { name, code } = req.body;
  const pro = await prisma.product.create({ data: { name, code } });
  res.status(201).json(pro);
};

// update, remove tương tự…
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  const pro = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, code },
  });
  res.json(pro);
};
exports.remove = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: Number(id) } });
  res.status(204).send();
};


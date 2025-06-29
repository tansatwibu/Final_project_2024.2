const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');

async function main() {
  const hash = await bcrypt.hash('1', 10);
  await prisma.admin.create({
    data: {
      username: 'admin2',
      password: hash,
    }
  });
  console.log('Admin created!');
  process.exit();
}
main();
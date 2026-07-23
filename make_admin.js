require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { role: 'admin' }
  });
  console.log('All users have been set to admin role.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

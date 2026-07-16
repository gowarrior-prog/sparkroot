import { prisma } from './lib/prisma.js';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@luxemart.com' } });
  console.log('Current User from DB:', user);
  
  if (user && user.role !== 'admin') {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' }
    });
    console.log('Successfully updated to admin:', updated);
  } else if (!user) {
    console.log('User not found in DB!');
  } else {
    console.log('User is already admin.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

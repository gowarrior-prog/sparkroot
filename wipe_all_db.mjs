import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  console.log('Wiping ALL database tables completely...');

  try {
    // Delete in reverse dependency order
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrders.count} Orders`);

    const deletedReviews = await prisma.review.deleteMany({});
    console.log(`Deleted ${deletedReviews.count} Reviews`);

    const deletedImages = await prisma.productImage.deleteMany({});
    console.log(`Deleted ${deletedImages.count} ProductImages`);

    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`Deleted ${deletedProducts.count} Products`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deletedUsers.count} Users`);

    console.log('✅ ALL DATABASE TABLES ARE NOW 100% EMPTY!');
  } catch (err) {
    console.error('Wipe DB error:', err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

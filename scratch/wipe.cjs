const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting full A to Z database wipe...');
  try {
    await prisma.productImage.deleteMany({});
    console.log('Cleared ProductImages');
  } catch (e) { console.warn(e.message); }

  try {
    await prisma.review.deleteMany({});
    console.log('Cleared Reviews');
  } catch (e) { console.warn(e.message); }

  try {
    await prisma.order.deleteMany({});
    console.log('Cleared Orders');
  } catch (e) { console.warn(e.message); }

  try {
    await prisma.product.deleteMany({});
    console.log('Cleared Products');
  } catch (e) { console.warn(e.message); }

  try {
    await prisma.user.deleteMany({});
    console.log('Cleared Users');
  } catch (e) { console.warn(e.message); }

  const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');
  if (fs.existsSync(reviewsFile)) {
    try {
      fs.writeFileSync(reviewsFile, '[]', 'utf-8');
      console.log('Cleared data/reviews.json');
    } catch (e) { console.warn(e.message); }
  }

  console.log('SUCCESS: Full Database Wiped A to Z!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

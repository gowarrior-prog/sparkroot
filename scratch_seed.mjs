import 'dotenv/config';
import { prisma } from './lib/prisma.js';
import { products } from './src/dataproducts.js';

async function main() {
  console.log('Seeding database with fresh PKR luxury products...');

  try {
    // Delete existing orders & reviews first due to FK constraints
    await prisma.order.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    for (const p of products) {
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          stock: p.stock || 20,
          description: p.description,
          featured: p.featured || true,
          sizes: p.sizes,
          colors: p.colors
        }
      });
    }

    console.log('Database seeded successfully with PKR luxury catalog!');
  } catch (err) {
    console.error('Seed error:', err);
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

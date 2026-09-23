import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  console.log('Clearing database tables...');
  
  // Delete records in order of foreign key dependencies
  await prisma.review.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('All existing products, reviews, images, and orders deleted successfully.');

  // Seed sample products matching the design
  const seedProducts = [
    {
      name: 'Wireless Earbuds',
      price: 39.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      description: 'High fidelity wireless noise cancelling earbuds with crystal clear sound.',
      featured: true,
      stock: 50,
      sizes: 'Standard',
      colors: 'White, Black'
    },
    {
      name: 'Smart Watch',
      price: 84.99,
      category: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      description: 'Fitness & health tracker luxury smartwatch with AMOLED display.',
      featured: true,
      stock: 35,
      sizes: '40mm, 44mm',
      colors: 'Black, Silver'
    },
    {
      name: 'Travel Backpack',
      price: 44.99,
      category: 'Bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      description: 'Waterproof laptop travel backpack with USB charging port.',
      featured: true,
      stock: 40,
      sizes: 'Medium, Large',
      colors: 'Black, Navy'
    },
    {
      name: 'Running Shoes',
      price: 59.99,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      description: 'Lightweight breathable sports running shoes for maximum comfort.',
      featured: true,
      stock: 25,
      sizes: '7, 8, 9, 10, 11',
      colors: 'White/Black, Red'
    },
    {
      name: 'Men\'s Hoodie',
      price: 34.99,
      category: 'Men\'s Wear',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      description: 'Premium heavyweight cotton pullover hoodie.',
      featured: true,
      stock: 60,
      sizes: 'S, M, L, XL',
      colors: 'Black, Charcoal'
    },
    {
      name: 'Italian Leather Handbag',
      price: 129.99,
      category: 'Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      description: 'Genuine Italian leather structured handbag with gold hardware.',
      featured: true,
      stock: 15,
      sizes: 'One Size',
      colors: 'Black, Tan'
    },
    {
      name: 'Classic Black T-Shirt',
      price: 19.99,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      description: 'Soft combed organic cotton minimalist black t-shirt.',
      featured: true,
      stock: 80,
      sizes: 'S, M, L, XL',
      colors: 'Black, White'
    },
    {
      name: 'Elegance Black Dress',
      price: 79.99,
      category: 'Women\'s Wear',
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=80',
      description: 'Sophisticated evening black dress with tailored silhouette.',
      featured: true,
      stock: 20,
      sizes: 'XS, S, M, L',
      colors: 'Black'
    }
  ];

  for (const p of seedProducts) {
    await prisma.product.create({
      data: p
    });
  }

  console.log('Seeded database with initial products successfully!');
}

main()
  .catch((e) => {
    console.error('Error in database reset/seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });

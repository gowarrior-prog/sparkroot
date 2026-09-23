import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

const formatProduct = (p) => {
  let sizesList = [];
  if (p.sizes) {
    sizesList = typeof p.sizes === 'string'
      ? p.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(p.sizes) ? p.sizes : []);
  }

  let colorsList = [];
  if (p.colors) {
    colorsList = typeof p.colors === 'string'
      ? p.colors.split(',').map(c => c.trim()).filter(Boolean)
      : (Array.isArray(p.colors) ? p.colors : []);
  }

  return {
    ...p,
    images: Array.isArray(p.images) ? p.images.map(img => img.url || img) : [],
    sizesList,
    colorsList,
    reviews: Array.isArray(p.reviews) ? p.reviews : []
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let whereClause = {};
    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (category) whereClause.category = category;

    let products = [];
    try {
      products = await prisma.product.findMany({
        where: whereClause,
        include: { images: true, reviews: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (dbErr) {
      console.warn('Prisma DB query failed, using fallback products:', dbErr.message);
    }

    const formatted = products.map(formatProduct);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([]);
  }
}

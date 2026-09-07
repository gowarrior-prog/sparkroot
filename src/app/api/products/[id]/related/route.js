import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';

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
    colorsList
  };
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, category: true, name: true }
    });

    if (!currentProduct || !currentProduct.category) {
      return NextResponse.json([]);
    }

    const cat = currentProduct.category.trim();

    const related = await prisma.product.findMany({
      where: {
        category: { equals: cat, mode: 'insensitive' },
        id: { not: currentProduct.id }
      },
      include: { images: true },
      take: 8,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(related.map(formatProduct));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

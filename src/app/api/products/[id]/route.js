import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, reviews: { orderBy: { createdAt: 'desc' } } }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(formatProduct(product));
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

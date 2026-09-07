import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { products as fallbackProducts } from '../../../dataproducts.js';

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
    if (search) whereClause.name = { contains: search, mode: 'insensitive' };
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

    // If database is empty or returns no products, use fallback products!
    if (!products || products.length === 0) {
      let filtered = fallbackProducts;
      if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        filtered = filtered.filter(p => 
          p.category.toLowerCase().includes(category.toLowerCase()) ||
          (category.toLowerCase() === 'jewelry' && (p.category.toLowerCase().includes('jewel') || p.name.toLowerCase().includes('ring') || p.name.toLowerCase().includes('earring') || p.name.toLowerCase().includes('necklace')))
        );
      }
      products = filtered.length > 0 ? filtered : fallbackProducts;
    }

    const formatted = products.map(formatProduct);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching products, serving fallback:', error);
    return NextResponse.json(fallbackProducts.map(formatProduct));
  }
}

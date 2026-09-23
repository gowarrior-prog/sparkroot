import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

// Allow larger request bodies for base64 image uploads (App Router format)
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products.map(formatProduct));
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, stock, description, featured, image, sizes, colors, extraImages } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const mainImg = image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop';
    const galleryList = Array.isArray(extraImages) ? extraImages.map(img => (typeof img === 'object' && img?.url ? img.url : img)).filter(Boolean) : [];
    const uniqueImages = Array.from(new Set([mainImg, ...galleryList]));

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock) || 0,
        description: description ? description.trim() : '',
        featured: Boolean(featured),
        image: mainImg,
        sizes: sizes ? String(sizes).trim() : null,
        colors: colors ? String(colors).trim() : null,
        images: {
          create: uniqueImages.map(url => ({ url }))
        }
      },
      include: { images: true }
    });

    return NextResponse.json(formatProduct(product), { status: 201 });
  } catch (error) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

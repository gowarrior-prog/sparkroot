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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, stock, description, featured, image, sizes, colors } = body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category.trim();
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (description !== undefined) updateData.description = description.trim();
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (sizes !== undefined) updateData.sizes = sizes ? String(sizes).trim() : null;
    if (colors !== undefined) updateData.colors = colors ? String(colors).trim() : null;
    if (image) updateData.image = image;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    return NextResponse.json(formatProduct(product));
  } catch (error) {
    console.error('Admin product PUT error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin product DELETE error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userName, rating, comment } = body;

    if (!userName || !comment) {
      return NextResponse.json({ error: 'Name and review comment are required' }, { status: 400 });
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating) || 5));

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        userName: userName.trim(),
        rating: numericRating,
        comment: comment.trim()
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

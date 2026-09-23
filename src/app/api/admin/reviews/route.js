import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import { memoryReviews } from '../../../../lib/contactStore.js';

export async function GET() {
  try {
    let dbReviews = [];
    try {
      dbReviews = await prisma.review.findMany({
        include: {
          product: {
            select: { id: true, name: true, image: true, category: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn('Prisma fetch reviews warning:', e.message);
      dbReviews = [];
    }

    // Filter DB reviews to include only genuine product reviews (excluding contact messages saved in DB)
    const productDbReviews = dbReviews.filter(r => !r.comment || !r.comment.includes('[CONTACT MESSAGE]'));

    const existingComments = new Set(productDbReviews.map(r => r.comment?.trim()));
    const merged = [...productDbReviews];

    for (const memRev of memoryReviews) {
      const cleanComment = memRev.comment?.trim();
      if (cleanComment && !existingComments.has(cleanComment)) {
        existingComments.add(cleanComment);
        merged.push(memRev);
      }
    }

    merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Admin reviews error:', error);
    return NextResponse.json(memoryReviews);
  }
}

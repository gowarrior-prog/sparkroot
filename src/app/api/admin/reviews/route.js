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

    const existingIds = new Set(dbReviews.map(r => String(r.id)));
    const merged = [...dbReviews];

    for (const memRev of memoryReviews) {
      if (!existingIds.has(String(memRev.id))) {
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

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { memoryReviews } from '../../../../lib/contactStore.js';
import { memoryOrders } from '../../../../lib/orderStore.js';

export async function POST() {
  try {
    try { await prisma.productImage.deleteMany({}); } catch {}
    try { await prisma.review.deleteMany({}); } catch {}
    try { await prisma.order.deleteMany({}); } catch {}
    try { await prisma.product.deleteMany({}); } catch {}
    try { await prisma.user.deleteMany({}); } catch {}

    // Reset memory stores
    if (Array.isArray(memoryReviews)) memoryReviews.length = 0;
    if (Array.isArray(memoryOrders)) memoryOrders.length = 0;

    const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');
    if (fs.existsSync(reviewsFile)) {
      try { fs.writeFileSync(reviewsFile, '[]', 'utf-8'); } catch {}
    }

    return NextResponse.json({ success: true, message: 'All database data cleared A to Z successfully!' });
  } catch (error) {
    console.error('Reset DB error:', error);
    return NextResponse.json({ error: 'Failed to reset database', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}

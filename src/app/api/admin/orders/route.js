import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import { memoryOrders } from '../../../../lib/orderStore.js';

export async function GET() {
  try {
    let dbOrders = [];
    try {
      dbOrders = await prisma.order.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn('Prisma fetch orders failed:', e.message);
      dbOrders = [];
    }

    // Merge DB orders and in-memory orders (avoiding duplicates by id)
    const existingIds = new Set(dbOrders.map(o => String(o.id)));
    const merged = [...dbOrders];
    for (const memOrder of memoryOrders) {
      if (!existingIds.has(String(memOrder.id))) {
        merged.push({
          ...memOrder,
          user: { name: 'Customer', email: memOrder.email || 'customer@sparkroot.com' }
        });
      }
    }

    merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json(memoryOrders);
  }
}

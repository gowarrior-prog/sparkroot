import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { memoryOrders } from '../../../lib/orderStore.js';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const parsed = JSON.parse(atob(token.split('.')[1]));
        if (parsed?.id) userId = Number(parsed.id);
      } catch {}
    }

    let dbOrders = [];
    try {
      dbOrders = await prisma.order.findMany({
        where: userId ? { userId } : undefined,
        orderBy: { createdAt: 'desc' }
      });
    } catch {
      dbOrders = [];
    }

    const existingIds = new Set(dbOrders.map(o => String(o.id)));
    const merged = [...dbOrders];

    for (const memOrder of memoryOrders) {
      if (!existingIds.has(String(memOrder.id))) {
        if (!userId || memOrder.userId === userId || !memOrder.userId || memOrder.userId === 1) {
          merged.push(memOrder);
        }
      }
    }

    merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json(merged);
  } catch (error) {
    console.error('My orders error:', error);
    return NextResponse.json(memoryOrders);
  }
}

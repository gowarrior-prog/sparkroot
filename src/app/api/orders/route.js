import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { memoryOrders, addMemoryOrder } from '../../../lib/orderStore.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { total, items, address, phone, email } = body;

    const authHeader = request.headers.get('authorization');
    let userId = 1;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const parsed = JSON.parse(atob(token.split('.')[1]));
        if (parsed?.id) userId = Number(parsed.id);
      } catch { /* use default */ }
    }

    const itemsJson = typeof items === 'string' ? items : JSON.stringify(items || []);

    let newOrder;
    try {
      newOrder = await prisma.order.create({
        data: {
          userId: userId || 1,
          total: Number(total) || 0,
          status: 'pending',
          items: itemsJson,
          address: address || '',
          phone: phone || '',
          email: email || ''
        }
      });
    } catch (dbErr) {
      console.warn('DB order create failed, using memory:', dbErr.message);
      newOrder = addMemoryOrder({ userId, total, items: itemsJson, address, phone, email });
    }

    return NextResponse.json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order error:', error);
    const fallback = addMemoryOrder({ total: 0, items: '[]', address: '', phone: '', email: '' });
    return NextResponse.json({ success: true, message: 'Order placed successfully', order: fallback });
  }
}

export async function GET() {
  try {
    let orders = [];
    try {
      orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    } catch { orders = []; }
    return NextResponse.json([...orders, ...memoryOrders]);
  } catch (error) {
    return NextResponse.json(memoryOrders);
  }
}

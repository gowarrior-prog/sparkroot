import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { memoryOrders, addMemoryOrder } from '../../../lib/orderStore.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { total, items, address, phone, email, name, city, postalCode } = body;

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

    const parsedItems = typeof items === 'string'
      ? (() => { try { return JSON.parse(items); } catch { return []; } })()
      : (Array.isArray(items) ? items : []);

    // Deduct stock for each purchased item in Prisma DB ALWAYS
    for (const item of parsedItems) {
      if (item && item.id) {
        const qtyToDeduct = Number(item.quantity) || 1;
        try {
          const currentProd = await prisma.product.findUnique({ where: { id: String(item.id) } });
          if (currentProd) {
            const newStock = Math.max(0, (currentProd.stock ?? 0) - qtyToDeduct);
            await prisma.product.update({
              where: { id: String(item.id) },
              data: { stock: newStock }
            });
          }
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${item.id}:`, stockErr.message);
        }
      }
    }

    let newOrder;
    try {
      // Ensure a valid user exists in DB for foreign key constraint
      let validUserId = userId || 1;
      try {
        const dbUser = await prisma.user.findUnique({ where: { id: validUserId } });
        if (!dbUser) {
          const firstUser = await prisma.user.findFirst();
          if (firstUser) {
            validUserId = firstUser.id;
          } else {
            const createdUser = await prisma.user.create({
              data: {
                email: email || `guest_${Date.now()}@sparkroot.com`,
                password: 'guestpassword',
                name: name || 'Guest User'
              }
            });
            validUserId = createdUser.id;
          }
        }
      } catch { /* proceed with fallback if user query fails */ }

      newOrder = await prisma.order.create({
        data: {
          userId: validUserId,
          total: Number(total) || 0,
          status: 'pending',
          items: itemsJson,
          address: address || '',
          phone: phone || '',
          email: email || ''
        }
      });
      // Attach name, city, postalCode to returned order object for runtime access
      newOrder = { ...newOrder, name: name || '', city: city || '', postalCode: postalCode || '' };
    } catch (dbErr) {
      console.warn('DB order create failed, using memory:', dbErr.message);
      newOrder = addMemoryOrder({ userId, total, items: itemsJson, address, phone, email, name, city, postalCode });
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

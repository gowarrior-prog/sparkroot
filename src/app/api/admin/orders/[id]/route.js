import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';
import { updateMemoryOrderStatus, deleteMemoryOrder } from '../../../../../lib/orderStore.js';

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Try DB update
    try {
      await prisma.order.update({
        where: { id: Number(id) || id },
        data: { status }
      });
    } catch {
      // Fallback in memory
      updateMemoryOrderStatus(id, status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    try {
      await prisma.order.delete({
        where: { id: Number(id) || id }
      });
    } catch {
      deleteMemoryOrder(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

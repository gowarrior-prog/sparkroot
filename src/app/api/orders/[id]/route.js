import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import { deleteMemoryOrder, updateMemoryOrderStatus } from '../../../../lib/orderStore.js';

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const numId = Number(id);

    try {
      await prisma.order.update({
        where: { id: !isNaN(numId) ? numId : id },
        data: { status }
      });
    } catch (e) {
      console.warn('Prisma update status warning:', e.message);
    }

    updateMemoryOrderStatus(id, status);

    return NextResponse.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const numId = Number(id);

    try {
      await prisma.order.delete({
        where: { id: !isNaN(numId) ? numId : id }
      });
    } catch (e) {
      console.warn('Prisma delete order warning:', e.message);
    }

    deleteMemoryOrder(id);

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

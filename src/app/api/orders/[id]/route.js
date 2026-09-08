import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import { deleteMemoryOrder } from '../../../../lib/orderStore.js';

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

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

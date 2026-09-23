import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';
import { deleteMemoryReview } from '../../../../../lib/contactStore.js';

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    try {
      await prisma.review.delete({ where: { id: Number(id) || id } });
    } catch (e) {
      console.warn('Prisma delete review warning:', e.message);
    }

    deleteMemoryReview(id);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

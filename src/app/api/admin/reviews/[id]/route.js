import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { addMemoryReview } from '../../../lib/contactStore.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, address, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const formattedComment = `[CONTACT MESSAGE]\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress/Subject: ${address || 'N/A'}\n\nMessage:\n${message}`;

    const reviewData = {
      userName: name,
      comment: formattedComment,
      rating: 5,
      createdAt: new Date().toISOString()
    };

    // Try saving to DB Review table
    try {
      // Find any valid product ID to link review, or create orphan entry
      const firstProduct = await prisma.product.findFirst({ select: { id: true } });
      const productId = firstProduct ? firstProduct.id : 1;

      await prisma.review.create({
        data: {
          productId,
          userName: name,
          comment: formattedComment,
          rating: 5
        }
      });
    } catch (e) {
      console.warn('Prisma contact review save fallback:', e.message);
    }

    // Save to memory store as well
    addMemoryReview(reviewData);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to SparkRoot Admin!',
      data: { name, email, phone, address, message }
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

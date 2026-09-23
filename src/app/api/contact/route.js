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

    // Save contact message ONCE in contact store
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

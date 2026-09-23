import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, address, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    // Save as review or inquiry record linked to product or general store contact
    // If no specific product, find or default to first product or store review entry
    let targetProduct = await prisma.product.findFirst();

    if (!targetProduct) {
      targetProduct = await prisma.product.create({
        data: {
          name: 'General Store Inquiry',
          price: 0,
          image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=200&auto=format&fit=crop&q=80',
          category: 'General',
          description: 'Store Contact & Support Channel',
          stock: 0
        }
      });
    }

    await prisma.review.create({
      data: {
        productId: targetProduct.id,
        userName: name,
        rating: 5,
        comment: `[CONTACT MESSAGE]\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress: ${address || 'N/A'}\nMessage: ${message}`
      }
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully to admin.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

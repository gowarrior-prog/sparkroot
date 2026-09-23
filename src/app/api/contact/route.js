import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, address, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    console.log(`[CONTACT INQUIRY] From: ${name} (${email}), Phone: ${phone || 'N/A'}, Address: ${address || 'N/A'}, Message: ${message}`);

    return NextResponse.json({ success: true, message: 'Message sent successfully to admin.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@sparkroot.com').toLowerCase();
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admiN_#unLoCk_*pass';

export async function POST(request) {
  try {
    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 });
    }

    const cleanInput = String(email).trim().toLowerCase();

    // 1. Search database for matching user by email or name (case-insensitive)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanInput, mode: 'insensitive' } },
          { name: { equals: cleanInput, mode: 'insensitive' } }
        ]
      }
    });

    // 2. If no admin user exists in DB at all, seed initial admin user
    if (!user) {
      const adminCount = await prisma.user.count({ where: { role: 'admin' } });
      if (adminCount === 0 && (cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL)) {
        if (password === ADMIN_PASSWORD) {
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
          user = await prisma.user.create({
            data: {
              name: ADMIN_USERNAME,
              email: ADMIN_EMAIL,
              password: hashedPassword,
              role: 'admin'
            }
          });
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    // 3. Strictly verify password against database bcrypt hash (no old fallback)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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

    // 2. If no user found in DB at all, check if it's initial seed admin login
    if (!user && (cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL)) {
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

    if (!user) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    // 3. Verify password against DB hash (or fallback env password if initial seed)
    let isValid = await bcrypt.compare(password, user.password);
    if (!isValid && (cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL || user.role === 'admin') && password === ADMIN_PASSWORD) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    // Ensure role is admin if it matches admin credentials or role
    if ((cleanInput === ADMIN_EMAIL || cleanInput === ADMIN_USERNAME || user.name.toLowerCase() === ADMIN_USERNAME) && user.role !== 'admin') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      });
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

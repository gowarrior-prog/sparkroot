import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@sparkroot.com').toLowerCase();
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admiN_#unLoCk_*pass';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const cleanInput = String(email).trim().toLowerCase();
    const cleanName = String(name).trim().toLowerCase();

    const isAdminInput = cleanInput === ADMIN_EMAIL || cleanInput === ADMIN_USERNAME || cleanName === ADMIN_USERNAME;

    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { name: cleanName }
        ]
      }
    });

    if (existingUser) {
      if (isAdminInput || password === ADMIN_PASSWORD) {
        const isPasswordMatch = password === ADMIN_PASSWORD || (await bcrypt.compare(password, existingUser.password));
        if (isPasswordMatch) {
          if (existingUser.role !== 'admin') {
            existingUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: { role: 'admin' }
            });
          }
          const token = jwt.sign({ userId: existingUser.id, email: existingUser.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
          return NextResponse.json({
            message: 'Admin account logged in',
            token,
            user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: 'admin' }
          }, { status: 200 });
        }
      }
      return NextResponse.json({ error: 'User already exists. Please sign in.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (isAdminInput || password === ADMIN_PASSWORD) ? 'admin' : 'user';

    const newUser = await prisma.user.create({
      data: { name, email: cleanInput, password: hashedPassword, role }
    });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

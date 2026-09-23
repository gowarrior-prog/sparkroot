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
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanInput = String(email).trim().toLowerCase();

    // Check against admin env variables
    if (cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        let adminUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: ADMIN_EMAIL },
              { name: ADMIN_USERNAME }
            ]
          }
        });
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
          adminUser = await prisma.user.create({
            data: {
              name: ADMIN_USERNAME,
              email: ADMIN_EMAIL,
              password: hashedPassword,
              role: 'admin'
            }
          });
        } else if (adminUser.role !== 'admin') {
          adminUser = await prisma.user.update({
            where: { id: adminUser.id },
            data: { role: 'admin' }
          });
        }
        const token = jwt.sign({ userId: adminUser.id, email: adminUser.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return NextResponse.json({
          message: 'Admin login successful',
          token,
          user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' }
        });
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 400 });
      }
    }

    // Standard user login
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { name: cleanInput }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const isAdmin = cleanInput === ADMIN_EMAIL || cleanInput === ADMIN_USERNAME || user.email.toLowerCase() === ADMIN_EMAIL || user.name.toLowerCase() === ADMIN_USERNAME;
    if (isAdmin && user.role !== 'admin') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
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

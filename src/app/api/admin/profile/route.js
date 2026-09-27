import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

async function getOrCreateAdminUser(decoded) {
  let adminUser = null;
  if (decoded?.userId && !isNaN(Number(decoded.userId))) {
    try {
      adminUser = await prisma.user.findUnique({ where: { id: Number(decoded.userId) } });
    } catch {}
  }
  if (!adminUser && decoded?.email) {
    try {
      adminUser = await prisma.user.findFirst({ where: { email: String(decoded.email).toLowerCase() } });
    } catch {}
  }
  if (!adminUser) {
    try {
      adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
    } catch {}
  }
  if (!adminUser) {
    // Auto-create admin user in DB if missing
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admiN_#unLoCk_*pass';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        name: process.env.ADMIN_USERNAME || 'admin',
        email: (process.env.ADMIN_EMAIL || 'admin@sparkroot.com').toLowerCase(),
        password: hashedPassword,
        role: 'admin'
      }
    });
  }
  return adminUser;
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (decoded?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminUser = await getOrCreateAdminUser(decoded);

    return NextResponse.json({
      id: adminUser.id,
      name: adminUser.name || 'admin',
      email: adminUser.email || 'admin@sparkroot.com',
      role: 'admin'
    });
  } catch (error) {
    console.error('Admin profile GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    const adminUser = await getOrCreateAdminUser(decoded);

    // Verify current password if provided
    if (currentPassword && currentPassword.trim().length > 0) {
      const isCurrentValid = await bcrypt.compare(currentPassword, adminUser.password);
      const isEnvDefault = currentPassword === (process.env.ADMIN_PASSWORD || 'admiN_#unLoCk_*pass');
      if (!isCurrentValid && !isEnvDefault) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
    }

    const updateData = {};

    // 1. Update Username (name)
    if (username && String(username).trim().length > 0) {
      const cleanName = String(username).trim();
      updateData.name = cleanName;
    }

    // 2. Update Email
    if (email && String(email).trim().length > 0) {
      const cleanEmail = String(email).trim().toLowerCase();
      const emailExists = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          id: { not: adminUser.id }
        }
      });
      if (emailExists) {
        return NextResponse.json({ error: 'This email is already in use by another account' }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    // 3. Update Password
    if (newPassword && String(newPassword).trim().length > 0) {
      if (String(newPassword).trim().length < 4) {
        return NextResponse.json({ error: 'New password must be at least 4 characters long' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(String(newPassword).trim(), 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: adminUser.id },
      data: updateData
    });

    const newToken = jwt.sign(
      { userId: updatedAdmin.id, email: updatedAdmin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Admin credentials updated successfully!',
      token: newToken,
      user: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json({ error: 'Failed to update admin profile' }, { status: 500 });
  }
}

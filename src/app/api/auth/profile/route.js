import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userId, email, name, password } = body;

    if (!userId && !email) {
      return NextResponse.json({ error: 'User identifier is required' }, { status: 400 });
    }

    // Find existing user by ID or Email
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: Number(userId) || userId } });
    }
    if (!user && email) {
      user = await prisma.user.findFirst({ where: { email: String(email).trim().toLowerCase() } });
    }

    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const updateData = {};

    // 1. Update Name if provided
    if (name && String(name).trim().length > 0) {
      updateData.name = String(name).trim();
    }

    // 2. Update Email if provided and not taken by another user
    if (body.newEmail && String(body.newEmail).trim().toLowerCase() !== user.email) {
      const cleanNewEmail = String(body.newEmail).trim().toLowerCase();
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: cleanNewEmail,
          id: { not: user.id }
        }
      });
      if (emailTaken) {
        return NextResponse.json({ error: 'This email is already in use by another account' }, { status: 400 });
      }
      updateData.email = cleanNewEmail;
    }

    // 3. Update Password if provided
    if (password && String(password).trim().length >= 6) {
      updateData.password = await bcrypt.hash(String(password).trim(), 10);
    }

    // Apply updates if any
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    const token = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

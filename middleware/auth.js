import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    // Temporarily allowing all users to access Admin panel for testing
    // if (!user || user.role?.toLowerCase() !== 'admin') {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }
    next();
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
};

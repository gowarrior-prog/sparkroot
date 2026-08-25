import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET admin stats / dashboard
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, recentOrders, allOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      prisma.order.findMany({
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const chartData = new Array(10).fill(0);
    if (allOrders.length > 0) {
      allOrders.forEach((order, index) => {
        const bucket = Math.min(Math.floor((index / allOrders.length) * 10), 9);
        chartData[bucket] += order.total;
      });
    }

    const revenue = await prisma.order.aggregate({ _sum: { total: true } });
    res.json({ totalUsers, totalOrders, totalProducts, totalRevenue: revenue._sum.total || 0, recentOrders, chartData });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all orders
router.get('/orders', authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH update order status
router.patch('/orders/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

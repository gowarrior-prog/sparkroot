import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST place order (authenticated)
router.post('/orders', authenticate, async (req, res) => {
  try {
    const { total, items, address, phone, email } = req.body;

    for (const item of items) {
      if (item.id) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ error: `Not enough stock for ${item.name}` });
        }
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total,
        items: JSON.stringify(items),
        address,
        phone,
        email,
        status: 'pending'
      }
    });
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my orders (authenticated)
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const parsed = orders.map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
    }));
    res.json(parsed);
  } catch (error) {
    console.error('My orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE cancel pending order (authenticated)
router.delete('/orders/:id', authenticate, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });
    if (order.status !== 'pending') return res.status(400).json({ error: 'Only pending orders can be deleted' });

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.id) {
          const product = await prisma.product.findUnique({ where: { id: item.id } });
          if (product) {
            await prisma.product.update({
              where: { id: item.id },
              data: { stock: { increment: item.quantity } }
            });
          }
        }
      }
    }

    await prisma.order.delete({ where: { id: orderId } });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

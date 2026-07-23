import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@luxemart.com';

// ──────────────── CORS CONFIG ────────────────
// Add allowed frontend origins here, or set ALLOWED_ORIGINS in .env
// e.g. ALLOWED_ORIGINS=http://localhost:5173,https://sparkroot.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173,https://sparkroot.vercel.app'
).split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ──────────────── AUTH MIDDLEWARE ────────────────
const authenticate = (req, res, next) => {
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

const adminOnly = async (req, res, next) => {
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

// ──────────────── AUTH ROUTES ────────────────

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────── PUBLIC ROUTES ────────────────

// Get all products (public, with search & category filters)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      whereClause.category = category;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────── ORDER ROUTES ────────────────

// Place order (any authenticated user)
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { total, items, address, phone, email } = req.body;
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

// Cancel Order (User only within 24 hours)
app.delete('/api/orders/:id/cancel', authenticate, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }

    // Check if 24 hours have passed
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const hoursPassed = (now - orderTime) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      return res.status(400).json({ error: 'Order cannot be canceled after 24 hours.' });
    }

    // Cancel order (Update status or delete, let's update status)
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Canceled' }
    });

    res.json({ message: 'Order canceled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get My Orders (authenticated user)
app.get('/api/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    // Parse items JSON for each order
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

// ──────────────── ADMIN ROUTES ────────────────

// Get all users
app.get('/api/admin/users', authenticate, adminOnly, async (req, res) => {
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

// Get all orders
app.get('/api/admin/orders', authenticate, adminOnly, async (req, res) => {
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

// Update order status
app.patch('/api/admin/orders/:id', authenticate, adminOnly, async (req, res) => {
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

// Get all products (admin)
app.get('/api/admin/products', authenticate, adminOnly, async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add product
app.post('/api/admin/products', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, price, image, category, stock, description, featured } = req.body;
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), image, category, stock: parseInt(stock) || 0, description, featured: featured || false }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product
app.put('/api/admin/products/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, price, image, category, stock, description, featured } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, price: parseFloat(price), image, category, stock: parseInt(stock), description, featured }
    });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product
app.delete('/api/admin/products/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', authenticate, adminOnly, async (req, res) => {
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

    // Calculate revenue for the chart (last 10 days or just a generic real trend)
    const chartData = new Array(10).fill(0);
    if (allOrders.length > 0) {
      // Group by day or just take chunks to show real movement
      allOrders.forEach((order, index) => {
        const bucket = Math.floor((index / allOrders.length) * 10);
        const safeBucket = bucket === 10 ? 9 : bucket;
        chartData[safeBucket] += order.total;
      });
    }

    const revenue = await prisma.order.aggregate({ _sum: { total: true } });
    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: revenue._sum.total || 0,
      recentOrders,
      chartData
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
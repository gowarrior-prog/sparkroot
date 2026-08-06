import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from './lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@luxemart.com';

// ──────────────── STORAGE & UPLOADS ────────────────
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (!isVercel) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

let upload;
if (isVercel) {
  // On Vercel, use memory storage (no persistent disk)
  upload = multer({ storage: multer.memoryStorage() });
} else {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  upload = multer({ storage: storage });
}

// ──────────────── CORS CONFIG ────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173,https://sparkroot.vercel.app'
).split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    // Allow all vercel.app domains, localhost, and custom domains
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
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
    
    // Fallback: If DB category case is different, filter manually if needed, but simple exact match is best.
    let finalProducts = products;
    if (category && products.length === 0) {
       // manual case-insensitive fallback if exact match fails
       const allProducts = await prisma.product.findMany({
         where: search ? { name: { contains: search } } : {},
         orderBy: { createdAt: 'desc' }
       });
       finalProducts = allProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    } else {
       finalProducts = products;
    }

    res.json(finalProducts);
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
    
    // Check stock and decrement
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

// Delete/Cancel pending order (customer)
app.delete('/api/orders/:id', authenticate, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user and is pending
    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be deleted' });
    }

    // Restore stock
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

    await prisma.order.delete({
      where: { id: orderId }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
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
app.post('/api/admin/products', authenticate, adminOnly, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, stock, description, featured } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    // Use uploaded file URL or fallback to string image field if provided
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.create({
      data: { 
        name, 
        price: parseFloat(price) || 0, 
        image: imageUrl, 
        category, 
        stock: parseInt(stock) || 0, 
        description: description || '', 
        featured: featured === 'true' || featured === true 
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Update product
// Update product
app.put('/api/admin/products/:id', authenticate, adminOnly, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, stock, description, featured } = req.body;
    
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const dataToUpdate = { 
      name, 
      price: parseFloat(price), 
      category, 
      stock: parseInt(stock), 
      description, 
      featured: featured === 'true' || featured === true 
    };
    if (imageUrl) {
      dataToUpdate.image = imageUrl;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
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

// Ensure Admin User exists on startup
async function ensureAdminUser() {
  try {
    const email = 'admin@sparkroot.com';
    const password = 'admiN_#unLoCk_*pass';
    const name = 'Admin';
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, role: 'admin' }
      });
      console.log('Admin password updated successfully.');
    } else {
      await prisma.user.create({
        data: { name, email, password: hashedPassword, role: 'admin' }
      });
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
}
ensureAdminUser();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
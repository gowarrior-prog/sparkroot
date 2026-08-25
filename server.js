import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { prisma } from './lib/prisma.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────── STATIC FILES ────────────────
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
if (!isVercel) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// ──────────────── CORS ────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ──────────────── ROUTES ────────────────
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin', adminRoutes);

// ──────────────── HEALTH CHECK ────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ──────────────── ENSURE ADMIN ────────────────
async function ensureAdminUser() {
  try {
    const email = 'admin@sparkroot.com';
    const password = 'admiN_#unLoCk_*pass';
    const name = 'Admin';
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      await prisma.user.update({ where: { email }, data: { password: hashedPassword, role: 'admin' } });
      console.log('Admin password updated successfully.');
    } else {
      await prisma.user.create({ data: { name, email, password: hashedPassword, role: 'admin' } });
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
}
ensureAdminUser();

// ──────────────── START ────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
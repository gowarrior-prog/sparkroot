import express from 'express';
import { prisma } from '../lib/prisma.js';
import { cache } from '../lib/cache.js';

const router = express.Router();

const formatProduct = (p) => ({
  ...p,
  images: Array.isArray(p.images) ? p.images.map(img => img.url || img) : []
});

// GET all products (cached for fast response)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const cacheKey = `products_${search || 'all'}_${category || 'all'}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.json(cachedData);
    }

    let whereClause = {};
    if (search) whereClause.name = { contains: search, mode: 'insensitive' };
    if (category) whereClause.category = category;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });

    let finalProducts = products;
    if (category && products.length === 0) {
      const allProducts = await prisma.product.findMany({
        where: search ? { name: { contains: search } } : {},
        include: { images: true },
        orderBy: { createdAt: 'desc' }
      });
      finalProducts = allProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    const formatted = finalProducts.map(formatProduct);
    cache.set(cacheKey, formatted, 60); // 60s cache

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json(formatted);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `product_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const formatted = formatProduct(product);
    cache.set(cacheKey, formatted, 120);

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(formatted);
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

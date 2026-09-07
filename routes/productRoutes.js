import express from 'express';
import { prisma } from '../lib/prisma.js';
import { cache } from '../lib/cache.js';

const router = express.Router();

const formatProduct = (p) => {
  let sizesList = [];
  if (p.sizes) {
    sizesList = typeof p.sizes === 'string'
      ? p.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(p.sizes) ? p.sizes : []);
  }

  let colorsList = [];
  if (p.colors) {
    colorsList = typeof p.colors === 'string'
      ? p.colors.split(',').map(c => c.trim()).filter(Boolean)
      : (Array.isArray(p.colors) ? p.colors : []);
  }

  return {
    ...p,
    images: Array.isArray(p.images) ? p.images.map(img => img.url || img) : [],
    sizesList,
    colorsList,
    reviews: Array.isArray(p.reviews) ? p.reviews : []
  };
};

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
      include: { images: true, reviews: true },
      orderBy: { createdAt: 'desc' }
    });

    let finalProducts = products;
    if (category && products.length === 0) {
      const allProducts = await prisma.product.findMany({
        where: search ? { name: { contains: search } } : {},
        include: { images: true, reviews: true },
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

// GET related products for a product (strictly same category)
router.get('/:id/related', async (req, res) => {
  try {
    const currentProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { id: true, category: true, name: true }
    });

    if (!currentProduct || !currentProduct.category) {
      return res.json([]);
    }

    const cat = currentProduct.category.trim();

    // Find products strictly in the same category (case-insensitive)
    const related = await prisma.product.findMany({
      where: {
        category: { equals: cat, mode: 'insensitive' },
        id: { not: currentProduct.id }
      },
      include: { images: true },
      take: 8,
      orderBy: { createdAt: 'desc' }
    });

    res.json(related.map(formatProduct));
  } catch (error) {
    console.error('Related products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET product reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST submit a review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    if (!userName || !comment) {
      return res.status(400).json({ error: 'Name and review comment are required' });
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating) || 5));

    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const review = await prisma.review.create({
      data: {
        productId: req.params.id,
        userName: userName.trim(),
        rating: numericRating,
        comment: comment.trim()
      }
    });

    // Invalidate product cache
    cache.clearPattern('product');

    res.status(201).json(review);
  } catch (error) {
    console.error('Submit review error:', error);
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
      include: { images: true, reviews: { orderBy: { createdAt: 'desc' } } }
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

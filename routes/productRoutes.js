import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Format product images helper
const formatProduct = (p) => ({
  ...p,
  images: Array.isArray(p.images) ? p.images.map(img => img.url || img) : []
});

// GET all products (public, with search & category filters)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
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

    res.json(finalProducts.map(formatProduct));
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product));
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

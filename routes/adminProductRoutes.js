import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
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
    colorsList
  };
};

// GET all products (admin)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products.map(formatProduct));
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add product
router.post('/', authenticate, adminOnly, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, stock, description, featured, sizes, colors } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    let imageUrl = req.body.image || '';
    if (req.file) {
      if (req.file.buffer) {
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
      } else if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    let imagesArray = [];
    if (req.body.extraImages) {
      if (Array.isArray(req.body.extraImages)) {
        imagesArray = req.body.extraImages.filter(Boolean);
      } else if (typeof req.body.extraImages === 'string') {
        try {
          const parsed = JSON.parse(req.body.extraImages);
          imagesArray = Array.isArray(parsed) ? parsed.filter(Boolean) : [req.body.extraImages];
        } catch {
          imagesArray = req.body.extraImages.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const cleanSizes = typeof sizes === 'string' ? sizes.trim() : (Array.isArray(sizes) ? sizes.join(', ') : '');
    const cleanColors = typeof colors === 'string' ? colors.trim() : (Array.isArray(colors) ? colors.join(', ') : '');

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price) || 0,
        image: imageUrl,
        category,
        stock: parseInt(stock) || 0,
        description: description || '',
        featured: featured === 'true' || featured === true,
        sizes: cleanSizes || null,
        colors: cleanColors || null,
        images: imagesArray.length > 0 ? { create: imagesArray.map(url => ({ url })) } : undefined
      },
      include: { images: true }
    });

    cache.clearPattern('product');
    res.status(201).json(formatProduct(product));
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// PUT update product
router.put('/:id', authenticate, adminOnly, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, stock, description, featured, sizes, colors } = req.body;

    let imageUrl = req.body.image;
    if (req.file) {
      if (req.file.buffer) {
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
      } else if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    let imagesArray = null;
    if (req.body.extraImages !== undefined) {
      if (Array.isArray(req.body.extraImages)) {
        imagesArray = req.body.extraImages.filter(Boolean);
      } else if (typeof req.body.extraImages === 'string') {
        try {
          const parsed = JSON.parse(req.body.extraImages);
          imagesArray = Array.isArray(parsed) ? parsed.filter(Boolean) : [req.body.extraImages];
        } catch {
          imagesArray = req.body.extraImages.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const cleanSizes = sizes !== undefined ? (typeof sizes === 'string' ? sizes.trim() : (Array.isArray(sizes) ? sizes.join(', ') : '')) : undefined;
    const cleanColors = colors !== undefined ? (typeof colors === 'string' ? colors.trim() : (Array.isArray(colors) ? colors.join(', ') : '')) : undefined;

    const dataToUpdate = {
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      description,
      featured: featured === 'true' || featured === true
    };
    if (imageUrl) dataToUpdate.image = imageUrl;
    if (cleanSizes !== undefined) dataToUpdate.sizes = cleanSizes || null;
    if (cleanColors !== undefined) dataToUpdate.colors = cleanColors || null;

    if (imagesArray !== null) {
      await prisma.productImage.deleteMany({ where: { productId: req.params.id } });
      if (imagesArray.length > 0) {
        await prisma.productImage.createMany({
          data: imagesArray.map(url => ({ url, productId: req.params.id }))
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: dataToUpdate,
      include: { images: true }
    });

    cache.clearPattern('product');
    res.json(formatProduct(product));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// DELETE product
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    cache.clearPattern('product');
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

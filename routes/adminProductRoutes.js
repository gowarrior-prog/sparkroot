import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const formatProduct = (p) => ({
  ...p,
  images: Array.isArray(p.images) ? p.images.map(img => img.url || img) : []
});

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
    const { name, price, category, stock, description, featured } = req.body;

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

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price) || 0,
        image: imageUrl,
        category,
        stock: parseInt(stock) || 0,
        description: description || '',
        featured: featured === 'true' || featured === true,
        images: imagesArray.length > 0 ? { create: imagesArray.map(url => ({ url })) } : undefined
      },
      include: { images: true }
    });
    res.status(201).json(formatProduct(product));
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// PUT update product
router.put('/:id', authenticate, adminOnly, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, stock, description, featured } = req.body;

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

    const dataToUpdate = {
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      description,
      featured: featured === 'true' || featured === true
    };
    if (imageUrl) dataToUpdate.image = imageUrl;

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
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

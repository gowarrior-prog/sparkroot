// src/productStore.js — Ultra-fast in-memory and local client-side cache
import { API } from './api';

let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes fresh TTL

const DEFAULT_PRODUCTS = [
  { id: 'prod_1', name: 'Luxury Diamond Necklace Set', price: 16465, image: '/images/categories/jewelry.png', category: 'jewelry', stock: 5, sizes: '23, 44', colors: 'gold, silver', description: 'Handcrafted diamond necklace with matching drop earrings.' },
  { id: 'prod_2', name: 'Premium Leather Handbag', price: 12500, image: '/images/categories/bags.png', category: 'bags', stock: 3, sizes: 'Standard', colors: 'black, tan', description: 'Genuine leather handbag with gold accents.' },
  { id: 'prod_3', name: 'Classic Gold Bangle Bracelet', price: 5465, image: '/images/categories/jewelry.png', category: 'jewelry', stock: 4, sizes: '26, 44', colors: 'gold, rose gold', description: '24K Gold plated handcrafted bangles.' },
  { id: 'prod_4', name: 'Wireless Noise Canceling Headphones', price: 8900, image: '/images/categories/electronics.png', category: 'electronics', stock: 8, sizes: 'Standard', colors: 'black, silver', description: 'Studio grade wireless headphones.' },
  { id: 'prod_5', name: 'Designer Evening Dress', price: 18500, image: '/images/categories/womens-wear.png', category: 'womens-wear', stock: 2, sizes: 'S, M, L', colors: 'red, black', description: 'Elegantly tailored silk evening gown.' },
  { id: 'prod_6', name: 'Men’s Luxury Chronograph Watch', price: 24000, image: '/images/categories/electronics.png', category: 'electronics', stock: 6, sizes: 'Standard', colors: 'silver, gold', description: 'Precision automatic watch with stainless steel band.' }
];

export const getInitialProducts = () => {
  if (cachedProducts && cachedProducts.length > 0) return cachedProducts;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sparkroot_cached_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedProducts = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return DEFAULT_PRODUCTS;
};

export const getCachedProducts = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedProducts;
  }

  try {
    const res = await fetch(`${API}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        cachedProducts = data;
        lastFetchTime = now;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('sparkroot_cached_products', JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }

  return getInitialProducts();
};

export const invalidateProductCache = () => {
  lastFetchTime = 0; // Mark cache as expired so next getCachedProducts() fetches fresh data from server
};

export const deductProductStock = (purchasedItems = []) => {
  if (!Array.isArray(purchasedItems) || purchasedItems.length === 0) return;

  const updateProductItem = (p) => {
    const match = purchasedItems.find(item => String(item.id) === String(p.id));
    if (match) {
      const qty = Number(match.quantity) || 1;
      const currentStock = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
      return { ...p, stock: Math.max(0, currentStock - qty) };
    }
    return p;
  };

  let currentList = cachedProducts && cachedProducts.length > 0 ? cachedProducts : getInitialProducts();
  cachedProducts = currentList.map(updateProductItem);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sparkroot_cached_products', JSON.stringify(cachedProducts));
    } catch {}
  }
};

export const restoreProductStock = (restoredItems = []) => {
  if (!Array.isArray(restoredItems) || restoredItems.length === 0) return;

  const updateProductItem = (p) => {
    const match = restoredItems.find(item => String(item.id) === String(p.id));
    if (match) {
      const qty = Number(match.quantity) || 1;
      const currentStock = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0;
      return { ...p, stock: currentStock + qty };
    }
    return p;
  };

  let currentList = cachedProducts && cachedProducts.length > 0 ? cachedProducts : getInitialProducts();
  cachedProducts = currentList.map(updateProductItem);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sparkroot_cached_products', JSON.stringify(cachedProducts));
    } catch {}
  }
};

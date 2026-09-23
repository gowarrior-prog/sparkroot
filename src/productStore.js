// src/productStore.js — Ultra-fast in-memory and local client-side cache
import { API } from './api';

let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes fresh TTL

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
  return [];
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
  cachedProducts = null;
  lastFetchTime = 0;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('sparkroot_cached_products');
    } catch {}
  }
};

export const deductProductStock = (purchasedItems = []) => {
  if (!Array.isArray(purchasedItems) || purchasedItems.length === 0) return;

  if (cachedProducts && Array.isArray(cachedProducts)) {
    cachedProducts = cachedProducts.map(p => {
      const match = purchasedItems.find(item => String(item.id) === String(p.id));
      if (match) {
        const qty = Number(match.quantity) || 1;
        const currentStock = p.stock !== undefined ? Number(p.stock) : 10;
        return { ...p, stock: Math.max(0, currentStock - qty) };
      }
      return p;
    });
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sparkroot_cached_products');
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed = parsed.map(p => {
            const match = purchasedItems.find(item => String(item.id) === String(p.id));
            if (match) {
              const qty = Number(match.quantity) || 1;
              const currentStock = p.stock !== undefined ? Number(p.stock) : 10;
              return { ...p, stock: Math.max(0, currentStock - qty) };
            }
            return p;
          });
          localStorage.setItem('sparkroot_cached_products', JSON.stringify(parsed));
        }
      }
    } catch {}
  }
};

// src/productStore.js — Ultra-fast in-memory client-side cache
import { API } from './api';

let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh TTL

export const getCachedProducts = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedProducts;
  }

  try {
    const res = await fetch(`${API}/products`);
    if (res.ok) {
      const data = await res.json();
      cachedProducts = data;
      lastFetchTime = now;
      return data;
    }
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }

  return cachedProducts || [];
};

export const invalidateProductCache = () => {
  cachedProducts = null;
  lastFetchTime = 0;
};

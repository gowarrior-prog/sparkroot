// src/api.js — Central API base URL config for Next.js & Vite
const isNext = typeof window !== 'undefined' || typeof process !== 'undefined';
const API_BASE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) 
  ? process.env.NEXT_PUBLIC_API_URL 
  : '';

export const API = API_BASE ? `${API_BASE}/api` : '/api';
export default API_BASE;


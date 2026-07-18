// src/api.js — Central API base URL config
// In development: uses localhost:5000
// In production (Vercel): uses the same domain so just '' is fine for base URL

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

export const API = `${API_BASE}/api`;
export default API_BASE;

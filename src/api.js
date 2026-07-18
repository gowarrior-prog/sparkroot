// src/api.js — Central API base URL config
// In development: uses localhost:5000
// In production (Vercel): uses the deployed backend URL

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = `${API_BASE}/api`;
export default API_BASE;

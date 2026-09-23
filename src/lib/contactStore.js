import fs from 'fs';
import path from 'path';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

function ensureDataDir() {
  const dir = path.dirname(REVIEWS_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

function loadPersistedReviews() {
  try {
    ensureDataDir();
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (e) {
    console.warn('Could not read reviews.json:', e.message);
  }
  return [];
}

function savePersistedReviews(reviews) {
  try {
    ensureDataDir();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save reviews.json:', e.message);
  }
}

const globalForReviews = globalThis;
if (!globalForReviews.memoryReviews) {
  globalForReviews.memoryReviews = loadPersistedReviews();
}

export const memoryReviews = globalForReviews.memoryReviews;

export function addMemoryReview(reviewData) {
  const newEntry = {
    id: reviewData.id || `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    productId: reviewData.productId || 1,
    userName: reviewData.name || reviewData.userName || 'Customer',
    rating: reviewData.rating || 5,
    comment: reviewData.comment || '',
    createdAt: reviewData.createdAt || new Date().toISOString()
  };
  globalForReviews.memoryReviews.unshift(newEntry);
  savePersistedReviews(globalForReviews.memoryReviews);
  return newEntry;
}

export function deleteMemoryReview(id) {
  const index = globalForReviews.memoryReviews.findIndex(r => String(r.id) === String(id));
  if (index !== -1) {
    const deleted = globalForReviews.memoryReviews.splice(index, 1)[0];
    savePersistedReviews(globalForReviews.memoryReviews);
    return deleted;
  }
  return null;
}

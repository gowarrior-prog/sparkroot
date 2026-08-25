import multer from 'multer';

// Use memory storage for Vercel compatibility (no disk access)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

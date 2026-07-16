import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Adapter initialize karein
const adapter = new PrismaPg(pool);

// 3. Next.js hot-reloading mein multiple instances se bachne ke liye singleton pattern:
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
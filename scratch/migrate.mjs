import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected. Adding missing columns to Order table...');

  try {
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "city" TEXT`);
    console.log('✔ Added city');
  } catch (e) { console.warn('city:', e.message); }

  try {
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "postalCode" TEXT`);
    console.log('✔ Added postalCode');
  } catch (e) { console.warn('postalCode:', e.message); }

  try {
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "name" TEXT`);
    console.log('✔ Added name');
  } catch (e) { console.warn('name:', e.message); }

  await client.end();
  console.log('🎉 Migration done!');
}

main().catch(console.error);

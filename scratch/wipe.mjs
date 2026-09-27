import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function main() {
  const connStr = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connStr) {
    console.error('ERROR: No DATABASE_URL or DIRECT_URL found in .env');
    process.exit(1);
  }

  console.log('Connecting to DB...');
  const client = new Client({ connectionString: connStr });
  await client.connect();
  console.log('Connected!');

  try {
    // Delete in FK-safe order
    await client.query('DELETE FROM "ProductImage"');
    console.log('✔ Cleared ProductImages');

    await client.query('DELETE FROM "Review"');
    console.log('✔ Cleared Reviews');

    await client.query('DELETE FROM "Order"');
    console.log('✔ Cleared Orders');

    await client.query('DELETE FROM "Product"');
    console.log('✔ Cleared Products');

    await client.query('DELETE FROM "User"');
    console.log('✔ Cleared Users');
  } catch (e) {
    console.error('DB Error:', e.message);
  } finally {
    await client.end();
  }

  // Clear local file store
  const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');
  if (fs.existsSync(reviewsFile)) {
    fs.writeFileSync(reviewsFile, '[]', 'utf-8');
    console.log('✔ Cleared data/reviews.json');
  }

  console.log('🎉 SUCCESS: Database Wiped A to Z!');
}

main().catch(console.error);

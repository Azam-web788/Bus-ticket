// Script to remove duplicate route entries
// Keeps the first route per from_city→to_city pair and updates schedules to point to it

import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bus_ticket',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10,
});

async function deduplicateRoutes() {
  const client = await pool.connect();
  try {
    // Find duplicate routes
    const dupes = await client.query(`
      SELECT from_city, to_city, COUNT(*) as cnt, ARRAY_AGG(id ORDER BY created_at ASC) as ids
      FROM routes
      GROUP BY from_city, to_city
      HAVING COUNT(*) > 1
    `);

    console.log(`Found ${dupes.rows.length} route pairs with duplicates:\n`);

    for (const dupe of dupes.rows) {
      const [keepId, ...removeIds] = dupe.ids;
      console.log(`${dupe.from_city} → ${dupe.to_city}: keeping ${keepId}, removing ${removeIds}`);

      // Update schedules to point to the kept route ID
      for (const removeId of removeIds) {
        const updateResult = await client.query(
          `UPDATE schedules SET route_id = $1 WHERE route_id = $2`,
          [keepId, removeId]
        );
        console.log(`  → Updated ${updateResult.rowCount} schedules from ${removeId} to ${keepId}`);

        // Check if there are any bookings referencing this route via schedules... 
        // Actually bookings reference schedule_id, not route_id directly, so this is fine.

        // Delete the duplicate route
        await client.query(`DELETE FROM routes WHERE id = $1`, [removeId]);
        console.log(`  → Deleted duplicate route ${removeId}`);
      }
    }

    console.log('\n✅ Routes deduplicated!');

    // Verify
    const remaining = await client.query(
      `SELECT from_city, to_city, COUNT(*) as cnt FROM routes GROUP BY from_city, to_city HAVING COUNT(*) > 1`
    );
    if (remaining.rows.length === 0) {
      console.log('✅ No more duplicate routes!');
    } else {
      console.log('⚠️ Still have duplicates:', remaining.rows);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

deduplicateRoutes();

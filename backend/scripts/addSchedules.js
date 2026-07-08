// Script to add schedules for ALL routes across multiple dates
// Each route gets 2-3 bus options with different timings

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

async function addSchedules() {
  const client = await pool.connect();
  try {
    // Get buses
    const busesResult = await client.query('SELECT id, name, type, total_seats FROM buses WHERE status = $1', ['active']);
    const buses = busesResult.rows;
    console.log(`Found ${buses.length} buses:`);
    buses.forEach(b => console.log(`  ${b.id}: ${b.name} (${b.type}, ${b.total_seats} seats)`));

    // Get routes
    const routesResult = await client.query('SELECT id, from_city, to_city, base_price, duration FROM routes WHERE status = $1', ['active']);
    const routes = routesResult.rows;
    console.log(`\nFound ${routes.length} routes:`);
    routes.forEach(r => console.log(`  ${r.id}: ${r.from_city} → ${r.to_city} (Rs.${r.base_price})`));

    // Get today's date
    const todayResult = await client.query("SELECT CURRENT_DATE as today");
    const today = new Date(todayResult.rows[0].today);
    console.log(`\nToday's date: ${today.toISOString().split('T')[0]}`);

    // Define schedules for each route: bus name, departure, arrival, price multiplier
    // Each route gets 2-3 options
    const schedulesConfig = {
      'Lahore→Islamabad': [
        { bus: 'Skyline Express', dep: '08:00', arr: '12:30', priceMult: 1.0 },
        { bus: 'City Cruiser', dep: '10:00', arr: '14:30', priceMult: 0.83 },
        { bus: 'Comfort Ride', dep: '14:00', arr: '18:30', priceMult: 0.92 },
        { bus: 'Swift Express', dep: '22:00', arr: '02:30', priceMult: 1.25 },
      ],
      'Lahore→Karachi': [
        { bus: 'Royal Star', dep: '06:00', arr: '20:00', priceMult: 1.0 },
        { bus: 'Skyline Express', dep: '08:00', arr: '22:00', priceMult: 0.95 },
        { bus: 'Comfort Ride', dep: '21:00', arr: '11:00', priceMult: 0.90 },
      ],
      'Islamabad→Lahore': [
        { bus: 'Green Line', dep: '07:00', arr: '11:30', priceMult: 1.0 },
        { bus: 'City Cruiser', dep: '09:00', arr: '13:30', priceMult: 1.0 },
        { bus: 'Swift Express', dep: '15:00', arr: '19:30', priceMult: 1.1 },
      ],
      'Karachi→Lahore': [
        { bus: 'Swift Express', dep: '05:00', arr: '19:00', priceMult: 1.0 },
        { bus: 'Manthar Express', dep: '07:00', arr: '21:00', priceMult: 0.85 },
        { bus: 'Royal Star', dep: '22:00', arr: '12:00', priceMult: 1.05 },
      ],
      'Lahore→Faisalabad': [
        { bus: 'Comfort Ride', dep: '09:00', arr: '11:00', priceMult: 1.0 },
        { bus: 'Green Line', dep: '12:00', arr: '14:00', priceMult: 0.90 },
        { bus: 'City Cruiser', dep: '17:00', arr: '19:00', priceMult: 0.85 },
      ],
      'Islamabad→Rawalpindi': [
        { bus: 'City Cruiser', dep: '06:00', arr: '06:30', priceMult: 1.0 },
        { bus: 'Comfort Ride', dep: '08:00', arr: '08:30', priceMult: 1.0 },
        { bus: 'Green Line', dep: '10:00', arr: '10:30', priceMult: 1.0 },
        { bus: 'Swift Express', dep: '12:00', arr: '12:30', priceMult: 1.0 },
        { bus: 'Skyline Express', dep: '14:00', arr: '14:30', priceMult: 1.0 },
        { bus: 'Manthar Express', dep: '16:00', arr: '16:30', priceMult: 1.0 },
        { bus: 'Royal Star', dep: '18:00', arr: '18:30', priceMult: 1.0 },
      ],
      'Karachi→Hyderabad': [
        { bus: 'Green Line', dep: '14:00', arr: '16:30', priceMult: 1.0 },
        { bus: 'Manthar Express', dep: '08:00', arr: '10:30', priceMult: 0.90 },
        { bus: 'Comfort Ride', dep: '19:00', arr: '21:30', priceMult: 1.1 },
      ],
      'Multan→Lahore': [
        { bus: 'Skyline Express', dep: '06:00', arr: '10:00', priceMult: 1.0 },
        { bus: 'Royal Star', dep: '07:30', arr: '11:30', priceMult: 1.05 },
        { bus: 'Swift Express', dep: '14:00', arr: '18:00', priceMult: 0.95 },
      ],
      'Faisalabad→Islamabad': [
        { bus: 'City Cruiser', dep: '08:00', arr: '11:30', priceMult: 1.0 },
        { bus: 'Green Line', dep: '13:00', arr: '16:30', priceMult: 0.90 },
        { bus: 'Manthar Express', dep: '18:00', arr: '21:30', priceMult: 0.95 },
      ],
      'Peshawar→Islamabad': [
        { bus: 'Royal Star', dep: '10:00', arr: '12:30', priceMult: 1.0 },
        { bus: 'Skyline Express', dep: '07:00', arr: '09:30', priceMult: 1.0 },
        { bus: 'Swift Express', dep: '15:00', arr: '17:30', priceMult: 1.0 },
      ],
    };

    // Remove existing future schedules to avoid conflicts
    console.log('\nRemoving existing future schedules...');
    await client.query('DELETE FROM schedules WHERE date >= $1 AND status = $2', [today.toISOString().split('T')[0], 'active']);
    console.log('Done.');

    let totalInserted = 0;

    // Generate schedules for 7 days: today through today+6
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      for (const route of routes) {
        const routeKey = `${route.from_city}→${route.to_city}`;
        const config = schedulesConfig[routeKey];
        if (!config) {
          console.log(`  ⚠️ No schedule config for ${routeKey}, skipping`);
          continue;
        }

        for (const sched of config) {
          const bus = buses.find(b => b.name === sched.bus);
          if (!bus) {
            console.log(`  ⚠️ Bus "${sched.bus}" not found, skipping`);
            continue;
          }

          const price = Math.round(parseFloat(route.base_price) * sched.priceMult);
          const availableSeats = bus.total_seats;

          await client.query(
            `INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')`,
            [bus.id, route.id, dateStr, sched.dep, sched.arr, price, availableSeats]
          );
          totalInserted++;
        }
      }
    }

    console.log(`\n✅ Total schedules inserted: ${totalInserted}`);
    console.log(`Dates covered: ${today.toISOString().split('T')[0]} through ${new Date(today.getTime() + 6*86400000).toISOString().split('T')[0]}`);

    // Summary
    console.log('\n📊 Schedule Summary:');
    for (const route of routes) {
      const key = `${route.from_city}→${route.to_city}`;
      const count = await client.query(
        'SELECT COUNT(*) as count FROM schedules s JOIN routes r ON s.route_id = r.id WHERE r.from_city = $1 AND r.to_city = $2 AND s.status = $3',
        [route.from_city, route.to_city, 'active']
      );
      console.log(`  ${key}: ${count.rows[0].count} schedules`);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

addSchedules();

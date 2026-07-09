import {
  putItem,
  generateId,
  Keys,
  GSIKeys,
} from '../src/config/dynamoClient.js';
import bcrypt from 'bcryptjs';

const now = new Date().toISOString();

async function seed() {
  console.log('Seeding DynamoDB table...');

  // ==================== Buses ====================
  const buses = [
    {
      name: 'Skyline Express',
      type_bus: 'AC Sleeper',
      total_seats: 40,
      operator: 'Skyline Travels',
      registration_number: 'SKY-001',
      amenities: ['wifi', 'ac', 'charging', 'snacks', 'tv'],
    },
    {
      name: 'City Cruiser',
      type_bus: 'AC Seater',
      total_seats: 50,
      operator: 'CityBus Co.',
      registration_number: 'CTY-001',
      amenities: ['wifi', 'ac', 'charging'],
    },
    {
      name: 'Green Line',
      type_bus: 'Non-AC',
      total_seats: 45,
      operator: 'Green Transport',
      registration_number: 'GRN-001',
      amenities: ['charging'],
    },
    {
      name: 'Royal Star',
      type_bus: 'AC Sleeper',
      total_seats: 36,
      operator: 'Royal Travels',
      registration_number: 'RYL-001',
      amenities: ['wifi', 'ac', 'charging', 'snacks', 'tv'],
    },
    {
      name: 'Swift Express',
      type_bus: 'AC Semi-Sleeper',
      total_seats: 42,
      operator: 'Swift Buses',
      registration_number: 'SWF-001',
      amenities: ['wifi', 'ac', 'charging', 'tv'],
    },
    {
      name: 'Comfort Ride',
      type_bus: 'AC Seater',
      total_seats: 50,
      operator: 'Comfort Lines',
      registration_number: 'CMF-001',
      amenities: ['wifi', 'ac', 'charging', 'snacks'],
    },
  ];

  const busIds = [];
  for (const b of buses) {
    const id = generateId();
    busIds.push(id);
    await putItem({
      ...Keys.bus(id),
      type: 'bus',
      id,
      ...b,
      status: 'active',
      created_at: now,
      updated_at: now,
    });
    console.log(`  + Bus: ${b.name} (${id})`);
  }

  // ==================== Routes ====================
  const routesData = [
    { from_city: 'Lahore', to_city: 'Islamabad', distance: '375 km', duration: '4h 30m', base_price: 1200 },
    { from_city: 'Lahore', to_city: 'Karachi', distance: '1200 km', duration: '14h', base_price: 3500 },
    { from_city: 'Islamabad', to_city: 'Lahore', distance: '375 km', duration: '4h 30m', base_price: 1200 },
    { from_city: 'Karachi', to_city: 'Lahore', distance: '1200 km', duration: '14h', base_price: 3500 },
    { from_city: 'Lahore', to_city: 'Faisalabad', distance: '130 km', duration: '2h', base_price: 600 },
    { from_city: 'Islamabad', to_city: 'Rawalpindi', distance: '15 km', duration: '30m', base_price: 200 },
    { from_city: 'Karachi', to_city: 'Hyderabad', distance: '150 km', duration: '2h 30m', base_price: 500 },
    { from_city: 'Multan', to_city: 'Lahore', distance: '320 km', duration: '4h', base_price: 1000 },
    { from_city: 'Faisalabad', to_city: 'Islamabad', distance: '280 km', duration: '3h 30m', base_price: 900 },
    { from_city: 'Peshawar', to_city: 'Islamabad', distance: '180 km', duration: '2h 30m', base_price: 700 },
  ];

  const routeIds = [];
  for (const r of routesData) {
    const id = generateId();
    routeIds.push(id);
    await putItem({
      ...Keys.route(id),
      type: 'route',
      id,
      ...r,
      status: 'active',
      created_at: now,
      updated_at: now,
    });
    console.log(`  + Route: ${r.from_city} -> ${r.to_city} (${id})`);
  }

  // ==================== Schedules ====================
  function getDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  const schedulesData = [
    { busIdx: 0, routeIdx: 0, date: getDate(1), dep: '08:00', arr: '12:30', price: null },
    { busIdx: 1, routeIdx: 0, date: getDate(1), dep: '10:00', arr: '14:30', price: 1000 },
    { busIdx: 3, routeIdx: 1, date: getDate(1), dep: '06:00', arr: '20:00', price: null },
    { busIdx: 2, routeIdx: 2, date: getDate(1), dep: '07:00', arr: '11:30', price: 800 },
    { busIdx: 4, routeIdx: 3, date: getDate(1), dep: '05:00', arr: '19:00', price: null },
    { busIdx: 5, routeIdx: 4, date: getDate(1), dep: '09:00', arr: '11:00', price: null },
    { busIdx: 0, routeIdx: 7, date: getDate(2), dep: '06:00', arr: '10:00', price: null },
    { busIdx: 1, routeIdx: 8, date: getDate(2), dep: '08:00', arr: '11:30', price: null },
    { busIdx: 3, routeIdx: 9, date: getDate(2), dep: '10:00', arr: '12:30', price: null },
    { busIdx: 2, routeIdx: 6, date: getDate(2), dep: '14:00', arr: '16:30', price: null },
    { busIdx: 4, routeIdx: 0, date: getDate(1), dep: '22:00', arr: '02:30', price: 1500 },
    { busIdx: 5, routeIdx: 0, date: getDate(1), dep: '14:00', arr: '18:30', price: 1100 },
  ];

  for (const s of schedulesData) {
    const id = generateId();
    const bus = buses[s.busIdx];
    const route = routesData[s.routeIdx];
    const busId = busIds[s.busIdx];
    const routeId = routeIds[s.routeIdx];
    const price = s.price || route.base_price;
    const totalSeats = bus.total_seats;

    await putItem({
      ...Keys.schedule(id),
      ...GSIKeys.scheduleByRoute(route.from_city, route.to_city, s.date, s.dep),
      ...GSIKeys.scheduleByBus(busId, s.date, s.dep),
      type: 'schedule',
      id,
      bus_id: busId,
      route_id: routeId,
      date: s.date,
      departure_time: s.dep,
      arrival_time: s.arr,
      price,
      available_seats: totalSeats,
      status: 'active',
      created_at: now,
      updated_at: now,
      // Denormalized bus info
      bus_name: bus.name,
      bus_type: bus.type_bus,
      bus_total_seats: totalSeats,
      bus_amenities: bus.amenities,
      bus_operator: bus.operator,
      bus_registration_number: bus.registration_number,
      // Denormalized route info
      from_city: route.from_city,
      to_city: route.to_city,
      distance: route.distance,
      route_duration: route.duration,
    });
    console.log(`  + Schedule: ${bus.name} | ${route.from_city}->${route.to_city} | ${s.date} ${s.dep} (${id})`);
  }

  // ==================== Admin User ====================
  const adminId = generateId();
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await putItem({
    ...Keys.user(adminId),
    ...GSIKeys.userEmail('admin@busticket.com', adminId),
    type: 'user',
    id: adminId,
    name: 'Admin User',
    email: 'admin@busticket.com',
    phone: '+1234567890',
    password_hash: adminPasswordHash,
    role: 'admin',
    created_at: now,
    updated_at: now,
  });
  console.log(`  + Admin user: admin@busticket.com / admin123 (${adminId})`);

  console.log('\nSeeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

<<<<<<< HEAD
import { queryGSI, scanTable } from '../config/dynamoClient.js';
=======
import pool from '../config/database.js';
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

export const searchBuses = async (req, res, next) => {
  try {
    const { from, to, date, passengers } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From city, to city, and date are required.' });
    }

    const minSeats = parseInt(passengers) || 1;

<<<<<<< HEAD
    // Query schedules by route cities + date via GSI1
    const gsiKey = `ROUTE_CITY#${from.toLowerCase()}#${to.toLowerCase()}`;
    const schedules = await queryGSI('GSI1', gsiKey, {
      skBeginsWith: `DATE#${date}#`,
    });

    // Filter by active status and available seats
    const filtered = schedules.filter(
      (s) => s.status === 'active' && s.available_seats >= minSeats
    );

    // Get average ratings for each bus
    const busIds = [...new Set(filtered.map((s) => s.bus_id))];
    const ratingsMap = {};
    for (const busId of busIds) {
      const reviews = await queryGSI('GSI3', `BUS#${busId}`);
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        ratingsMap[busId] = {
          rating: Math.round((sum / reviews.length) * 10) / 10,
          totalRatings: reviews.length,
        };
      } else {
        ratingsMap[busId] = { rating: 0, totalRatings: 0 };
      }
    }

    // Calculate durations and format response
    const buses = filtered.map((s) => {
      const dep = s.departure_time ? s.departure_time.slice(0, 5) : '';
      const arr = s.arrival_time ? s.arrival_time.slice(0, 5) : '';
=======
    const result = await pool.query(
      `SELECT s.id,
              b.id as bus_id, b.name, b.type, b.total_seats, b.amenities, b.operator, b.registration_number,
              r.from_city, r.to_city, r.distance, r.duration as route_duration,
              s.date, s.departure_time, s.arrival_time, s.price, s.available_seats,
              COALESCE(rv.avg_rating, 0) as rating,
              COALESCE(rv.total_reviews, 0) as total_ratings
       FROM schedules s
       JOIN buses b ON s.bus_id = b.id
       JOIN routes r ON s.route_id = r.id
       LEFT JOIN (
         SELECT bus_id, ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*) as total_reviews
         FROM reviews GROUP BY bus_id
       ) rv ON b.id = rv.bus_id
       WHERE LOWER(r.from_city) = LOWER($1)
         AND LOWER(r.to_city) = LOWER($2)
         AND s.date = $3
         AND s.status = 'active'
         AND b.status = 'active'
         AND s.available_seats >= $4
       ORDER BY s.departure_time ASC`,
      [from, to, date, minSeats]
    );

    // Calculate durations for each bus
    const buses = result.rows.map((row) => {
      const dep = row.departure_time.slice(0, 5);
      const arr = row.arrival_time.slice(0, 5);
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      const [depH, depM] = dep.split(':').map(Number);
      const [arrH, arrM] = arr.split(':').map(Number);
      let diffMinutes = (arrH * 60 + arrM) - (depH * 60 + depM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const duration = `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;

<<<<<<< HEAD
      const ratings = ratingsMap[s.bus_id] || { rating: 0, totalRatings: 0 };

      return {
        _id: s.id,
        name: s.bus_name,
        type: s.bus_type,
        departureTime: dep,
        arrivalTime: arr,
        duration,
        price: parseFloat(s.price) || 0,
        totalSeats: s.bus_total_seats || 40,
        availableSeats: s.available_seats,
        amenities: s.bus_amenities || [],
        rating: ratings.rating,
        totalRatings: ratings.totalRatings,
        from: s.from_city,
        to: s.to_city,
        date: s.date,
      };
    });

    // Sort by departure time
    buses.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

=======
      return {
        _id: row.id,
        name: row.name,
        type: row.type,
        departureTime: dep,
        arrivalTime: arr,
        duration,
        price: parseFloat(row.price),
        totalSeats: row.total_seats,
        availableSeats: row.available_seats,
        amenities: row.amenities || [],
        rating: parseFloat(row.rating) || 0,
        totalRatings: parseInt(row.total_ratings) || 0,
        from: row.from_city,
        to: row.to_city,
        date: row.date,
      };
    });

>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
    res.json({ buses, total: buses.length });
  } catch (err) {
    next(err);
  }
};

export const getPopularRoutes = async (req, res, next) => {
  try {
<<<<<<< HEAD
    // Get all routes
    const routes = await scanTable({
      filterExpression: '#type = :type AND #status = :status',
      expressionAttributeNames: { '#type': 'type', '#status': 'status' },
      expressionAttributeValues: { ':type': 'route', ':status': 'active' },
    });

    // Get all bookings to count per route
    const bookings = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'booking' },
    });

    // Count bookings per route (via schedules)
    const scheduleIds = bookings.map((b) => b.schedule_id);
    
    // For each route, estimate popularity based on how many schedules exist
    const allSchedules = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'schedule' },
    });

    const schedulesByRoute = {};
    allSchedules.forEach((s) => {
      if (!schedulesByRoute[s.route_id]) schedulesByRoute[s.route_id] = [];
      schedulesByRoute[s.route_id].push(s);
    });

    const routeBookingCounts = {};
    for (const scheduleId of scheduleIds) {
      // Find the schedule to get its route_id
      const schedule = allSchedules.find((s) => s.id === scheduleId);
      if (schedule) {
        routeBookingCounts[schedule.route_id] = (routeBookingCounts[schedule.route_id] || 0) + 1;
      }
    }

    const popularRoutes = routes
      .map((r) => ({
        from_city: r.from_city,
        to_city: r.to_city,
        base_price: r.base_price,
        booking_count: routeBookingCounts[r.id] || 0,
      }))
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, 8);

    res.json({ routes: popularRoutes });
=======
    const result = await pool.query(
      `SELECT r.from_city, r.to_city, r.base_price, COUNT(b.id) as booking_count
       FROM routes r
       LEFT JOIN schedules s ON r.id = s.route_id
       LEFT JOIN bookings b ON s.id = b.schedule_id
       WHERE r.status = 'active'
       GROUP BY r.id
       ORDER BY booking_count DESC
       LIMIT 8`
    );
    res.json({ routes: result.rows });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

import pool from '../config/database.js';

export const searchBuses = async (req, res, next) => {
  try {
    const { from, to, date, passengers } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From city, to city, and date are required.' });
    }

    const minSeats = parseInt(passengers) || 1;

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
      const [depH, depM] = dep.split(':').map(Number);
      const [arrH, arrM] = arr.split(':').map(Number);
      let diffMinutes = (arrH * 60 + arrM) - (depH * 60 + depM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const duration = `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;

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

    res.json({ buses, total: buses.length });
  } catch (err) {
    next(err);
  }
};

export const getPopularRoutes = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

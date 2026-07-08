import pool from '../config/database.js';

export const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.id, s.bus_id, s.route_id, s.date, s.departure_time, s.arrival_time,
              s.price, s.available_seats, s.status,
              b.id as bus_id, b.name as bus_name, b.type as bus_type, b.total_seats,
              b.amenities, b.operator, b.registration_number,
              r.from_city, r.to_city, r.distance, r.duration as route_duration
       FROM schedules s
       JOIN buses b ON s.bus_id = b.id
       JOIN routes r ON s.route_id = r.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    // Get average rating
    const ratingResult = await pool.query(
      'SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE bus_id = $1',
      [result.rows[0].bus_id]
    );

    const schedule = result.rows[0];
    schedule.rating = parseFloat(ratingResult.rows[0].avg_rating) || 0;
    schedule.totalRatings = parseInt(ratingResult.rows[0].total_reviews) || 0;

    res.json({ schedule });
  } catch (err) {
    next(err);
  }
};

export const getSchedules = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.bus_id, s.route_id, s.date, s.departure_time, s.arrival_time,
              s.price, s.available_seats, s.status, s.created_at,
              b.name as bus_name, b.type as bus_type,
              r.from_city, r.to_city, r.duration as route_duration
       FROM schedules s
       JOIN buses b ON s.bus_id = b.id
       JOIN routes r ON s.route_id = r.id
       ORDER BY s.date DESC, s.departure_time ASC`
    );
    res.json({ schedules: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const { busId, routeId, date, departureTime, arrivalTime, price, availableSeats, status } = req.body;

    if (!busId || !routeId || !date || !departureTime || !arrivalTime || !price) {
      return res.status(400).json({ error: 'Bus, route, date, departure/arrival times, and price are required.' });
    }

    const result = await pool.query(
      `INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, bus_id, route_id, date, departure_time, arrival_time, price, available_seats, status, created_at`,
      [busId, routeId, date, departureTime, arrivalTime, price, availableSeats || 40, status || 'active']
    );

    res.status(201).json({ schedule: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { busId, routeId, date, departureTime, arrivalTime, price, availableSeats, status } = req.body;

    const result = await pool.query(
      `UPDATE schedules SET
        bus_id = COALESCE($1, bus_id),
        route_id = COALESCE($2, route_id),
        date = COALESCE($3, date),
        departure_time = COALESCE($4, departure_time),
        arrival_time = COALESCE($5, arrival_time),
        price = COALESCE($6, price),
        available_seats = COALESCE($7, available_seats),
        status = COALESCE($8, status)
       WHERE id = $9
       RETURNING id, bus_id, route_id, date, departure_time, arrival_time, price, available_seats, status, created_at`,
      [busId, routeId, date, departureTime, arrivalTime, price, availableSeats, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    res.json({ schedule: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    res.json({ message: 'Schedule deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

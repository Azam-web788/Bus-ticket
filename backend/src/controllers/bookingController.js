import pool from '../config/database.js';

export const getUserBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.user_id, b.schedule_id, b.seats, b.total_fare, b.status, b.booking_date, b.created_at,
              s.date, s.departure_time, s.arrival_time, s.price,
              bus.name as bus_name, bus.type as bus_type,
              r.from_city, r.to_city
       FROM bookings b
       JOIN schedules s ON b.schedule_id = s.id
       JOIN buses bus ON s.bus_id = bus.id
       JOIN routes r ON s.route_id = r.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    const bookings = result.rows.map((row) => ({
      _id: row.id,
      busName: row.bus_name,
      busType: row.bus_type,
      from: row.from_city,
      to: row.to_city,
      date: row.date,
      departureTime: row.departure_time.slice(0, 5),
      arrivalTime: row.arrival_time.slice(0, 5),
      seats: row.seats,
      totalFare: parseFloat(row.total_fare),
      status: row.status,
      bookingDate: row.booking_date,
    }));

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { scheduleId, seats } = req.body;

    if (!scheduleId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'Schedule ID and seats array are required.' });
    }

    // Start a transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Lock the schedule row and check availability
      const scheduleResult = await client.query(
        'SELECT id, price, available_seats FROM schedules WHERE id = $1 AND status = \'active\' FOR UPDATE',
        [scheduleId]
      );

      if (scheduleResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Schedule not found or inactive.' });
      }

      const schedule = scheduleResult.rows[0];

      if (schedule.available_seats < seats.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Only ${schedule.available_seats} seats available. Requested ${seats.length}.`,
        });
      }

      const totalFare = schedule.price * seats.length;

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (user_id, schedule_id, seats, total_fare, status)
         VALUES ($1, $2, $3, $4, 'confirmed')
         RETURNING id, user_id, schedule_id, seats, total_fare, status, booking_date`,
        [req.user.id, scheduleId, seats, totalFare]
      );

      // Update available seats
      await client.query(
        'UPDATE schedules SET available_seats = available_seats - $1 WHERE id = $2',
        [seats.length, scheduleId]
      );

      await client.query('COMMIT');

      const booking = bookingResult.rows[0];
      res.status(201).json({
        booking: {
          _id: booking.id,
          seats: booking.seats,
          totalFare: parseFloat(booking.total_fare),
          status: booking.status,
          bookingDate: booking.booking_date,
        },
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      let bookingQuery;
      if (req.user.role === 'admin') {
        bookingQuery = client.query(
          'SELECT id, schedule_id, seats, status FROM bookings WHERE id = $1 FOR UPDATE',
          [id]
        );
      } else {
        bookingQuery = client.query(
          'SELECT id, schedule_id, seats, status FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE',
          [id, req.user.id]
        );
      }
      const bookingResult = await bookingQuery;

      if (bookingResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Booking not found or unauthorized.' });
      }

      const booking = bookingResult.rows[0];

      if (booking.status === 'cancelled') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Booking is already cancelled.' });
      }

      if (booking.status === 'completed') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Cannot cancel a completed booking.' });
      }

      // Update booking status
      await client.query(
        'UPDATE bookings SET status = \'cancelled\' WHERE id = $1',
        [id]
      );

      // Restore available seats
      await client.query(
        'UPDATE schedules SET available_seats = available_seats + $1 WHERE id = $2',
        [booking.seats.length, booking.schedule_id]
      );

      await client.query('COMMIT');

      res.json({ message: 'Booking cancelled successfully.' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};

export const getBookedSeats = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const result = await pool.query(
      `SELECT seats FROM bookings
       WHERE schedule_id = $1 AND status IN ('confirmed', 'pending')`,
      [scheduleId]
    );

    // Flatten all seat arrays into one array of unique seats
    const bookedSeats = result.rows.reduce((acc, row) => {
      if (row.seats && Array.isArray(row.seats)) {
        acc.push(...row.seats);
      }
      return acc;
    }, []);

    res.json({ bookedSeats: [...new Set(bookedSeats)].sort((a, b) => a - b) });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.user_id, b.schedule_id, b.seats, b.total_fare, b.status, b.booking_date,
              s.date, s.departure_time, s.arrival_time,
              bus.name as bus_name, bus.type as bus_type,
              r.from_city, r.to_city,
              u.name as user_name, u.email as user_email
       FROM bookings b
       JOIN schedules s ON b.schedule_id = s.id
       JOIN buses bus ON s.bus_id = bus.id
       JOIN routes r ON s.route_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC
       LIMIT 50`
    );
    res.json({ bookings: result.rows });
  } catch (err) {
    next(err);
  }
};

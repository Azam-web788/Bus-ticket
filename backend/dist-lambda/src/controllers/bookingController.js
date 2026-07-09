import {
  getItem,
  putItem,
  updateItem,
  scanTable,
  queryGSI,
  generateId,
  Keys,
  GSIKeys,
  transactWrite,
} from '../config/dynamoClient.js';

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await queryGSI('GSI2', `USER#${req.user.id}`);

    // Sort by created_at descending
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      bookings: bookings.map((row) => ({
        _id: row.id,
        busName: row.bus_name,
        busType: row.bus_type,
        from: row.from_city,
        to: row.to_city,
        date: row.date,
        departureTime: row.departure_time ? row.departure_time.slice(0, 5) : '',
        arrivalTime: row.arrival_time ? row.arrival_time.slice(0, 5) : '',
        seats: row.seats || [],
        totalFare: parseFloat(row.total_fare) || 0,
        status: row.status,
        bookingDate: row.booking_date,
      })),
    });
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

    // Get schedule to check availability
    const scheduleKey = Keys.schedule(scheduleId);
    const schedule = await getItem(scheduleKey.PK, scheduleKey.SK);

    if (!schedule || schedule.status !== 'active') {
      return res.status(404).json({ error: 'Schedule not found or inactive.' });
    }

    if (schedule.available_seats < seats.length) {
      return res.status(400).json({
        error: `Only ${schedule.available_seats} seats available. Requested ${seats.length}.`,
      });
    }

    const id = generateId();
    const now = new Date().toISOString();
    const totalFare = parseFloat(schedule.price) * seats.length;

    // Use DynamoDB transaction to atomically decrement seats and create booking
    await transactWrite([
      {
        // Update schedule: decrement available_seats
        Update: {
          TableName: process.env.DYNAMODB_TABLE || 'BusTicket',
          Key: { PK: scheduleKey.PK, SK: scheduleKey.SK },
          UpdateExpression: 'SET available_seats = available_seats - :seatCount, #upd = :now',
          ConditionExpression: 'available_seats >= :seatCount AND #status = :active',
          ExpressionAttributeNames: {
            '#upd': 'updated_at',
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':seatCount': seats.length,
            ':now': now,
            ':active': 'active',
          },
        },
      },
      {
        // Create booking
        Put: {
          TableName: process.env.DYNAMODB_TABLE || 'BusTicket',
          Item: {
            ...Keys.booking(id),
            ...GSIKeys.bookingByUser(req.user.id, now),
            ...GSIKeys.bookingBySchedule(scheduleId, 'confirmed', id),
            type: 'booking',
            id,
            user_id: req.user.id,
            schedule_id: scheduleId,
            seats,
            total_fare: totalFare,
            status: 'confirmed',
            booking_date: now,
            created_at: now,
            updated_at: now,
            // Denormalized info for easy display
            bus_name: schedule.bus_name,
            bus_type: schedule.bus_type,
            from_city: schedule.from_city,
            to_city: schedule.to_city,
            date: schedule.date,
            departure_time: schedule.departure_time,
            arrival_time: schedule.arrival_time,
            user_name: req.user.name,
            user_email: req.user.email,
          },
          ConditionExpression: 'attribute_not_exists(PK)',
        },
      },
    ]);

    res.status(201).json({
      booking: {
        _id: id,
        seats,
        totalFare,
        status: 'confirmed',
        bookingDate: now,
      },
    });
  } catch (err) {
    if (err.name === 'TransactionCanceledException') {
      // Check if it's a conditional check failure
      return res.status(400).json({
        error: 'Booking failed. Seats may no longer be available.',
      });
    }
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookingKey = Keys.booking(id);
    const booking = await getItem(bookingKey.PK, bookingKey.SK);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found or unauthorized.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking.' });
    }

    const now = new Date().toISOString();
    const scheduleKey = Keys.schedule(booking.schedule_id);

    // Use transaction to atomically update booking status and restore seats
    await transactWrite([
      {
        // Update schedule: increment available_seats
        Update: {
          TableName: process.env.DYNAMODB_TABLE || 'BusTicket',
          Key: { PK: scheduleKey.PK, SK: scheduleKey.SK },
          UpdateExpression: 'SET available_seats = available_seats + :seatCount, #upd = :now',
          ExpressionAttributeValues: {
            ':seatCount': booking.seats.length,
            ':now': now,
          },
          ExpressionAttributeNames: {
            '#upd': 'updated_at',
          },
        },
      },
      {
        // Update booking: change status to cancelled
        Update: {
          TableName: process.env.DYNAMODB_TABLE || 'BusTicket',
          Key: { PK: bookingKey.PK, SK: bookingKey.SK },
          UpdateExpression: 'SET #status = :cancelled, #upd = :now',
          ConditionExpression: '#status IN (:confirmed, :pending)',
          ExpressionAttributeValues: {
            ':cancelled': 'cancelled',
            ':confirmed': 'confirmed',
            ':pending': 'pending',
            ':now': now,
          },
          ExpressionAttributeNames: {
            '#status': 'status',
            '#upd': 'updated_at',
          },
        },
      },
    ]);

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    if (err.name === 'TransactionCanceledException') {
      return res.status(400).json({ error: 'Cancellation failed. Booking may already be cancelled.' });
    }
    next(err);
  }
};

export const getBookedSeats = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    // Query bookings for this schedule via GSI1
    const bookings = await queryGSI('GSI1', `SCHEDULE#${scheduleId}`);

    // Filter confirmed/pending bookings and collect seats
    const activeBookings = bookings.filter((b) =>
      b.status === 'confirmed' || b.status === 'pending'
    );

    const bookedSeats = activeBookings.reduce((acc, row) => {
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
    const bookings = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'booking' },
      limit: 50,
    });

    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      bookings: bookings.slice(0, 50).map((b) => ({
        id: b.id,
        user_id: b.user_id,
        schedule_id: b.schedule_id,
        seats: b.seats || [],
        total_fare: b.total_fare,
        status: b.status,
        booking_date: b.booking_date,
        date: b.date,
        departure_time: b.departure_time,
        arrival_time: b.arrival_time,
        bus_name: b.bus_name,
        bus_type: b.bus_type,
        from_city: b.from_city,
        to_city: b.to_city,
        user_name: b.user_name,
        user_email: b.user_email,
      })),
    });
  } catch (err) {
    next(err);
  }
};

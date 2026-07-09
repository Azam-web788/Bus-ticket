import {
  putItem,
  getItem,
  updateItem,
  deleteItem,
  scanTable,
  queryGSI,
  generateId,
  Keys,
  GSIKeys,
} from '../config/dynamoClient.js';

export const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const key = Keys.schedule(id);
    const schedule = await getItem(key.PK, key.SK);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    // Get average rating from reviews via GSI3
    const reviews = await queryGSI('GSI3', `BUS#${schedule.bus_id}`);
    let avgRating = 0;
    let totalRatings = 0;
    if (reviews.length > 0) {
      totalRatings = reviews.length;
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = Math.round((sum / totalRatings) * 10) / 10;
    }

    res.json({
      schedule: {
        id: schedule.id,
        bus_id: schedule.bus_id,
        route_id: schedule.route_id,
        date: schedule.date,
        departure_time: schedule.departure_time,
        arrival_time: schedule.arrival_time,
        price: schedule.price,
        available_seats: schedule.available_seats,
        status: schedule.status,
        bus_name: schedule.bus_name,
        bus_type: schedule.bus_type,
        bus_total_seats: schedule.bus_total_seats,
        amenities: schedule.bus_amenities || [],
        operator: schedule.bus_operator,
        registration_number: schedule.bus_registration_number,
        from_city: schedule.from_city,
        to_city: schedule.to_city,
        distance: schedule.distance,
        route_duration: schedule.route_duration,
        rating: avgRating,
        totalRatings,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'schedule' },
    });

    schedules.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (a.departure_time || '').localeCompare(b.departure_time || '');
    });

    res.json({
      schedules: schedules.map((s) => ({
        id: s.id,
        bus_id: s.bus_id,
        route_id: s.route_id,
        date: s.date,
        departure_time: s.departure_time,
        arrival_time: s.arrival_time,
        price: s.price,
        available_seats: s.available_seats,
        status: s.status,
        created_at: s.created_at,
        bus_name: s.bus_name,
        bus_type: s.bus_type,
        from_city: s.from_city,
        to_city: s.to_city,
        route_duration: s.route_duration,
      })),
    });
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

    // Get bus and route info for denormalization
    const busKey = Keys.bus(busId);
    const routeKey = Keys.route(routeId);
    const [bus, route] = await Promise.all([
      getItem(busKey.PK, busKey.SK),
      getItem(routeKey.PK, routeKey.SK),
    ]);

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }
    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    const id = generateId();
    const now = new Date().toISOString();

    const schedule = {
      ...Keys.schedule(id),
      ...GSIKeys.scheduleByRoute(route.from_city, route.to_city, date, departureTime),
      ...GSIKeys.scheduleByBus(busId, date, departureTime),
      type: 'schedule',
      id,
      bus_id: busId,
      route_id: routeId,
      date,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      price: parseFloat(price),
      available_seats: availableSeats || bus.total_seats,
      status: status || 'active',
      created_at: now,
      updated_at: now,
      // Denormalized bus info
      bus_name: bus.name,
      bus_type: bus.type_bus,
      bus_total_seats: bus.total_seats,
      bus_amenities: bus.amenities || [],
      bus_operator: bus.operator,
      bus_registration_number: bus.registration_number,
      // Denormalized route info
      from_city: route.from_city,
      to_city: route.to_city,
      distance: route.distance,
      route_duration: route.duration,
    };

    await putItem(schedule);

    res.status(201).json({
      schedule: {
        id: schedule.id,
        bus_id: schedule.bus_id,
        route_id: schedule.route_id,
        date: schedule.date,
        departure_time: schedule.departure_time,
        arrival_time: schedule.arrival_time,
        price: schedule.price,
        available_seats: schedule.available_seats,
        status: schedule.status,
        created_at: schedule.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { busId, routeId, date, departureTime, arrivalTime, price, availableSeats, status } = req.body;
    const key = Keys.schedule(id);
    const now = new Date().toISOString();

    const updates = { updated_at: now };
    if (busId) updates.bus_id = busId;
    if (routeId) updates.route_id = routeId;
    if (date) updates.date = date;
    if (departureTime) updates.departure_time = departureTime;
    if (arrivalTime) updates.arrival_time = arrivalTime;
    if (price) updates.price = parseFloat(price);
    if (availableSeats !== undefined) updates.available_seats = availableSeats;
    if (status) updates.status = status;

    const updated = await updateItem(key.PK, key.SK, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    res.json({
      schedule: {
        id: updated.id,
        bus_id: updated.bus_id,
        route_id: updated.route_id,
        date: updated.date,
        departure_time: updated.departure_time,
        arrival_time: updated.arrival_time,
        price: updated.price,
        available_seats: updated.available_seats,
        status: updated.status,
        created_at: updated.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const key = Keys.schedule(id);
    const schedule = await getItem(key.PK, key.SK);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    await deleteItem(key.PK, key.SK);
    res.json({ message: 'Schedule deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

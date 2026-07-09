import { queryGSI, scanTable } from '../config/dynamoClient.js';

export const searchBuses = async (req, res, next) => {
  try {
    const { from, to, date, passengers } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From city, to city, and date are required.' });
    }

    const minSeats = parseInt(passengers) || 1;

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
      const [depH, depM] = dep.split(':').map(Number);
      const [arrH, arrM] = arr.split(':').map(Number);
      let diffMinutes = (arrH * 60 + arrM) - (depH * 60 + depM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const duration = `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;

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

    res.json({ buses, total: buses.length });
  } catch (err) {
    next(err);
  }
};

export const getPopularRoutes = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

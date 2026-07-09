<<<<<<< HEAD
import {
  putItem,
  getItem,
  updateItem,
  deleteItem,
  scanTable,
  queryGSI,
  generateId,
  Keys,
} from '../config/dynamoClient.js';

export const getBuses = async (req, res, next) => {
  try {
    const buses = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'bus' },
    });

    buses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      buses: buses.map((b) => ({
        id: b.id,
        name: b.name,
        type: b.type,
        total_seats: b.total_seats,
        operator: b.operator,
        registration_number: b.registration_number,
        amenities: b.amenities || [],
        status: b.status,
        created_at: b.created_at,
      })),
    });
=======
import pool from '../config/database.js';

export const getBuses = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, type, total_seats, operator, registration_number, amenities, status, created_at FROM buses ORDER BY created_at DESC'
    );
    res.json({ buses: result.rows });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const getBusById = async (req, res, next) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const key = Keys.bus(id);
    const bus = await getItem(key.PK, key.SK);

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    // Get average rating from reviews via GSI3
    const reviews = await queryGSI('GSI3', `BUS#${id}`);
    let avgRating = 0;
    let totalRatings = 0;
    if (reviews.length > 0) {
      totalRatings = reviews.length;
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = Math.round((sum / totalRatings) * 10) / 10;
    }

    res.json({
      bus: {
        id: bus.id,
        name: bus.name,
        type: bus.type,
        total_seats: bus.total_seats,
        operator: bus.operator,
        registration_number: bus.registration_number,
        amenities: bus.amenities || [],
        status: bus.status,
        created_at: bus.created_at,
        rating: avgRating,
        totalRatings,
      },
    });
=======
    const result = await pool.query(
      `SELECT id, name, type, total_seats, operator, registration_number, amenities, status, created_at
       FROM buses WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    const bus = result.rows[0];

    // Get average rating
    const ratingResult = await pool.query(
      'SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE bus_id = $1',
      [id]
    );
    bus.rating = parseFloat(ratingResult.rows[0].avg_rating) || 0;
    bus.totalRatings = parseInt(ratingResult.rows[0].total_reviews) || 0;

    res.json({ bus });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const createBus = async (req, res, next) => {
  try {
    const { name, type, totalSeats, operator, registrationNumber, amenities, status } = req.body;

    if (!name || !type || !operator || !registrationNumber) {
      return res.status(400).json({ error: 'Name, type, operator, and registration number are required.' });
    }

<<<<<<< HEAD
    const id = generateId();
    const now = new Date().toISOString();

    const bus = {
      ...Keys.bus(id),
      type: 'bus',
      id,
      name,
      type_bus: type,
      total_seats: totalSeats || 40,
      operator,
      registration_number: registrationNumber,
      amenities: amenities || [],
      status: status || 'active',
      created_at: now,
      updated_at: now,
    };

    await putItem(bus);

    res.status(201).json({
      bus: {
        id: bus.id,
        name: bus.name,
        type: bus.type_bus,
        total_seats: bus.total_seats,
        operator: bus.operator,
        registration_number: bus.registration_number,
        amenities: bus.amenities,
        status: bus.status,
        created_at: bus.created_at,
      },
    });
=======
    const result = await pool.query(
      `INSERT INTO buses (name, type, total_seats, operator, registration_number, amenities, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, type, total_seats, operator, registration_number, amenities, status, created_at`,
      [name, type, totalSeats || 40, operator, registrationNumber, amenities || [], status || 'active']
    );

    res.status(201).json({ bus: result.rows[0] });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const updateBus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, totalSeats, operator, registrationNumber, amenities, status } = req.body;
<<<<<<< HEAD
    const key = Keys.bus(id);
    const now = new Date().toISOString();

    const updates = { updated_at: now };
    if (name) updates.name = name;
    if (type) updates.type_bus = type;
    if (totalSeats) updates.total_seats = totalSeats;
    if (operator) updates.operator = operator;
    if (registrationNumber) updates.registration_number = registrationNumber;
    if (amenities) updates.amenities = amenities;
    if (status) updates.status = status;

    const updated = await updateItem(key.PK, key.SK, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.json({
      bus: {
        id: updated.id,
        name: updated.name,
        type: updated.type_bus,
        total_seats: updated.total_seats,
        operator: updated.operator,
        registration_number: updated.registration_number,
        amenities: updated.amenities || [],
        status: updated.status,
        created_at: updated.created_at,
      },
    });
=======

    const result = await pool.query(
      `UPDATE buses SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        total_seats = COALESCE($3, total_seats),
        operator = COALESCE($4, operator),
        registration_number = COALESCE($5, registration_number),
        amenities = COALESCE($6, amenities),
        status = COALESCE($7, status)
       WHERE id = $8
       RETURNING id, name, type, total_seats, operator, registration_number, amenities, status, created_at`,
      [name, type, totalSeats, operator, registrationNumber, amenities, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.json({ bus: result.rows[0] });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const key = Keys.bus(id);
    const bus = await getItem(key.PK, key.SK);

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    await deleteItem(key.PK, key.SK);
=======
    const result = await pool.query('DELETE FROM buses WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
    res.json({ message: 'Bus deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

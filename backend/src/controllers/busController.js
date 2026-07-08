import pool from '../config/database.js';

export const getBuses = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, type, total_seats, operator, registration_number, amenities, status, created_at FROM buses ORDER BY created_at DESC'
    );
    res.json({ buses: result.rows });
  } catch (err) {
    next(err);
  }
};

export const getBusById = async (req, res, next) => {
  try {
    const { id } = req.params;
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

    const result = await pool.query(
      `INSERT INTO buses (name, type, total_seats, operator, registration_number, amenities, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, type, total_seats, operator, registration_number, amenities, status, created_at`,
      [name, type, totalSeats || 40, operator, registrationNumber, amenities || [], status || 'active']
    );

    res.status(201).json({ bus: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateBus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, totalSeats, operator, registrationNumber, amenities, status } = req.body;

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
  } catch (err) {
    next(err);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM buses WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.json({ message: 'Bus deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

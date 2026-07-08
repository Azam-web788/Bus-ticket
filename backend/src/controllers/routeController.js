import pool from '../config/database.js';

export const getRoutes = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, from_city, to_city, distance, duration, base_price, status, created_at FROM routes ORDER BY created_at DESC'
    );
    res.json({ routes: result.rows });
  } catch (err) {
    next(err);
  }
};

export const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, from_city, to_city, distance, duration, base_price, status, created_at FROM routes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    res.json({ route: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const createRoute = async (req, res, next) => {
  try {
    const { fromCity, toCity, distance, duration, basePrice, status } = req.body;

    if (!fromCity || !toCity || !duration || !basePrice) {
      return res.status(400).json({ error: 'From city, to city, duration, and base price are required.' });
    }

    const result = await pool.query(
      `INSERT INTO routes (from_city, to_city, distance, duration, base_price, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, from_city, to_city, distance, duration, base_price, status, created_at`,
      [fromCity, toCity, distance || null, duration, basePrice, status || 'active']
    );

    res.status(201).json({ route: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fromCity, toCity, distance, duration, basePrice, status } = req.body;

    const result = await pool.query(
      `UPDATE routes SET
        from_city = COALESCE($1, from_city),
        to_city = COALESCE($2, to_city),
        distance = COALESCE($3, distance),
        duration = COALESCE($4, duration),
        base_price = COALESCE($5, base_price),
        status = COALESCE($6, status)
       WHERE id = $7
       RETURNING id, from_city, to_city, distance, duration, base_price, status, created_at`,
      [fromCity, toCity, distance, duration, basePrice, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    res.json({ route: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    res.json({ message: 'Route deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

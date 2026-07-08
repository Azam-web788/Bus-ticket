import pool from '../config/database.js';

export const getBusReviews = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.bus_id = $1
       ORDER BY r.created_at DESC`,
      [busId]
    );

    res.json({ reviews: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { busId, rating, comment } = req.body;

    if (!busId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Bus ID and rating (1-5) are required.' });
    }

    // Check if user already reviewed this bus
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND bus_id = $2',
      [req.user.id, busId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this bus.' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, bus_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, rating, comment, created_at`,
      [req.user.id, busId, rating, comment || null]
    );

    res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

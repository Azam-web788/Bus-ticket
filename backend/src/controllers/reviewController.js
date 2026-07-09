<<<<<<< HEAD
import {
  putItem,
  queryGSI,
  generateId,
  Keys,
  GSIKeys,
} from '../config/dynamoClient.js';
=======
import pool from '../config/database.js';
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

export const getBusReviews = async (req, res, next) => {
  try {
    const { busId } = req.params;

<<<<<<< HEAD
    const reviews = await queryGSI('GSI3', `BUS#${busId}`);

    // Sort by created_at descending
    reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        user_name: r.user_name,
      })),
    });
=======
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
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
    const existingReviews = await queryGSI('GSI3', `BUS#${busId}`);
    const alreadyReviewed = existingReviews.find(
      (r) => r.user_id === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(409).json({ error: 'You have already reviewed this bus.' });
    }

    const id = generateId();
    const now = new Date().toISOString();

    const review = {
      ...Keys.review(id),
      ...GSIKeys.reviewByBus(busId, now),
      type: 'review',
      id,
      user_id: req.user.id,
      bus_id: busId,
      rating: parseInt(rating),
      comment: comment || null,
      created_at: now,
      user_name: req.user.name,
    };

    await putItem(review);

    res.status(201).json({
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
      },
    });
=======
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
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

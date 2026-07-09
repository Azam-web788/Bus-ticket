import {
  putItem,
  queryGSI,
  generateId,
  Keys,
  GSIKeys,
} from '../config/dynamoClient.js';

export const getBusReviews = async (req, res, next) => {
  try {
    const { busId } = req.params;

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
  } catch (err) {
    next(err);
  }
};

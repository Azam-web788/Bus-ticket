import { Router } from 'express';
import { getBusReviews, createReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/bus/:busId', getBusReviews);
router.post('/', auth, createReview);

export default router;

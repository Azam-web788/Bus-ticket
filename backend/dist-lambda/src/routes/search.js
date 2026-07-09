import { Router } from 'express';
import { searchBuses, getPopularRoutes } from '../controllers/searchController.js';

const router = Router();

router.get('/buses', searchBuses);
router.get('/popular-routes', getPopularRoutes);

export default router;

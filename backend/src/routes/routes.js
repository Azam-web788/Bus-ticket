import { Router } from 'express';
import { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../controllers/routeController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getRoutes);
router.get('/:id', getRouteById);
router.post('/', auth, adminOnly, createRoute);
router.put('/:id', auth, adminOnly, updateRoute);
router.delete('/:id', auth, adminOnly, deleteRoute);

export default router;

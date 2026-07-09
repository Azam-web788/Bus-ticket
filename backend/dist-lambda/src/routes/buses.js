import { Router } from 'express';
import { getBuses, getBusById, createBus, updateBus, deleteBus } from '../controllers/busController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getBuses);
router.get('/:id', getBusById);
router.post('/', auth, adminOnly, createBus);
router.put('/:id', auth, adminOnly, updateBus);
router.delete('/:id', auth, adminOnly, deleteBus);

export default router;

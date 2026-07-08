import { Router } from 'express';
import { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getSchedules);
router.get('/:id', getScheduleById);
router.post('/', auth, adminOnly, createSchedule);
router.put('/:id', auth, adminOnly, updateSchedule);
router.delete('/:id', auth, adminOnly, deleteSchedule);

export default router;

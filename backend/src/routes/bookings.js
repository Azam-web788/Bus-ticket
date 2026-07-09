import { Router } from 'express';
import { getUserBookings, createBooking, cancelBooking, getAllBookings, getBookedSeats } from '../controllers/bookingController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/my', auth, getUserBookings);
router.get('/all', auth, adminOnly, getAllBookings);
router.get('/schedule/:scheduleId', getBookedSeats);
router.post('/', auth, createBooking);
router.put('/:id/cancel', auth, cancelBooking);

export default router;

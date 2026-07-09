import { Router } from 'express';
import { register, login, getProfile, updateProfile, getUsers, updateUserRole } from '../controllers/authController.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', auth, adminOnly, getUsers);
router.put('/users/:id/role', auth, adminOnly, updateUserRole);

export default router;

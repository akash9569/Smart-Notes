import express from 'express';
import { register, login, getMe, logout, refreshToken, updateDetails } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/refresh-token', refreshToken);

export default router;

import { Router } from 'express';
import { signup, verifyEmail, resendEmail, login, logout, me } from '../controllers/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-email', resendEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
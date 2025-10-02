import { Router } from 'express';
import { signup, login, verifyOtp, refresh, logout } from '@/controller/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
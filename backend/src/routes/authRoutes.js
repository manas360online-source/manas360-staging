import { Router } from 'express';
import { authenticateToken, refreshTokenHandler, logoutHandler } from '../middleware/authMiddleware-unified.js';
import { sendOtp, loginWithOtp, adminLoginInitiate, adminLoginVerifyMfa } from '../controllers/authUnifiedController.js';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', loginWithOtp);
router.post('/login', loginWithOtp);
router.post('/admin-login', adminLoginInitiate);
router.post('/admin-login/verify-mfa', adminLoginVerifyMfa);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', authenticateToken, logoutHandler);

export default router;

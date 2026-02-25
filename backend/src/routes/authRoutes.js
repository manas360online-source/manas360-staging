import { Router } from 'express';
import { sendOTPController, verifyOTPController } from '../controllers/authController.js';

const router = Router();

router.post('/send-otp', sendOTPController);
router.post('/verify-otp', verifyOTPController);

export default router;

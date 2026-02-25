import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware-unified.js';
import { createPayment, handlePaymentWebhook, getPaymentStatus } from '../controllers/paymentController.js';

const router = Router();

router.post('/webhook', handlePaymentWebhook);
router.post('/create', authenticateToken, createPayment);
router.get('/:id', authenticateToken, getPaymentStatus);

export default router;

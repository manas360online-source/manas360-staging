import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware-unified.js';
import { getPlans, getCurrentSubscription, upgradeSubscription, cancelSubscription } from '../controllers/subscriptionController.js';

const router = Router();

router.get('/plans', getPlans);
router.get('/current', authenticateToken, getCurrentSubscription);
router.post('/upgrade', authenticateToken, upgradeSubscription);
router.post('/cancel', authenticateToken, cancelSubscription);

export default router;

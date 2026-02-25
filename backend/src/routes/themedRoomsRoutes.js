import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware-unified.js';
import { requireSubscription } from '../middleware/subscriptionGating.js';
import { listThemes, createSession, endSession } from '../controllers/themedRoomsController.js';

const router = Router();

router.get('/themes', listThemes);
router.post('/sessions', authenticateToken, requireSubscription('premium_themed_rooms'), createSession);
router.patch('/sessions/:id/end', authenticateToken, endSession);

export default router;

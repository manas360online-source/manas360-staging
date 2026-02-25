import { Router } from 'express';
import { getOverview, getSessionsMetrics, getOutcomeMetrics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/sessions', getSessionsMetrics);
router.get('/outcomes', getOutcomeMetrics);

export default router;

import { Router } from 'express';
import { listUsers, suspendUser, unsuspendUser } from '../controllers/adminController.js';

const router = Router();

router.get('/users', listUsers);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id/suspend', unsuspendUser);

export default router;

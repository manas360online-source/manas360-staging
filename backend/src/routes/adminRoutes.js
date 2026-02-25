import { Router } from 'express';
import {
  listUsers,
  suspendUser,
  unsuspendUser,
  generateMfaSecret,
  enableMfa,
  disableMfa,
  getMfaStatus
} from '../controllers/adminController.js';

const router = Router();

router.get('/users', listUsers);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id/suspend', unsuspendUser);

// MFA Setup Routes
router.get('/mfa/status', getMfaStatus);
router.post('/mfa/generate-secret', generateMfaSecret);
router.post('/mfa/enable', enableMfa);
router.post('/mfa/disable', disableMfa);

export default router;

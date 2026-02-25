// ================================================================
// Admin Module - Main Entry Point
// ================================================================
// All routes require admin role authorization
// These routes are protected with authorizeRole('admin', 'superadmin')
// ================================================================

import express from 'express';
import * as controllers from './controllers.js';
import { authorizeRole } from '../../middlewares/rbac.js';
import { validateInput } from '../../middlewares/validateInput.js';

const router = express.Router();

/**
 * ================================================================
 * USER MANAGEMENT ROUTES
 * ================================================================
 */

/**
 * GET /api/v1/admin/users
 * List all users (paginated)
 * Query: { page: number, limit: number, role: string }
 * Auth: admin only
 */
router.get('/users', controllers.listUsers);

/**
 * GET /api/v1/admin/users/:userId
 * Get single user details
 * Auth: admin only
 */
router.get('/users/:userId', controllers.getUserDetails);

/**
 * PATCH /api/v1/admin/users/:userId
 * Update user information
 * Auth: admin only
 */
router.patch('/users/:userId', validateInput((req) => {
  // Validate update fields if provided
  if (req.body.email && !req.body.email.includes('@')) {
    throw new Error('Invalid email');
  }
}), controllers.updateUser);

/**
 * DELETE /api/v1/admin/users/:userId
 * Soft delete user account
 * Auth: admin only
 */
router.delete('/users/:userId', controllers.deleteUser);

/**
 * ================================================================
 * THERAPIST MANAGEMENT ROUTES
 * ================================================================
 */

/**
 * GET /api/v1/admin/therapists
 * List all therapists
 * Query: { page: number, limit: number, status: string }
 * Auth: admin only
 */
router.get('/therapists', controllers.listTherapists);

/**
 * PATCH /api/v1/admin/therapists/:therapistId/verify
 * Verify therapist credentials
 * Body: { verified: boolean, notes: string }
 * Auth: admin only
 */
router.patch('/therapists/:therapistId/verify', 
  validateInput((req) => {
    if (typeof req.body.verified !== 'boolean') {
      throw new Error('Verified must be boolean');
    }
  }), 
  controllers.verifyTherapist
);

/**
 * ================================================================
 * SUBSCRIPTION MANAGEMENT ROUTES
 * ================================================================
 */

/**
 * GET /api/v1/admin/subscriptions
 * List all active subscriptions
 * Query: { page: number, limit: number, status: string }
 * Auth: admin only
 */
router.get('/subscriptions', controllers.listSubscriptions);

/**
 * PATCH /api/v1/admin/subscriptions/:subscriptionId/cancel
 * Cancel active subscription
 * Body: { reason: string }
 * Auth: admin only
 */
router.patch('/subscriptions/:subscriptionId/cancel', controllers.cancelSubscription);

/**
 * ================================================================
 * METRICS & REPORTING ROUTES
 * ================================================================
 */

/**
 * GET /api/v1/admin/metrics
 * Platform metrics dashboard
 * Query: { interval: 'day|week|month|year' }
 * Auth: admin only
 */
router.get('/metrics', controllers.getMetrics);

/**
 * GET /api/v1/admin/reports/:reportType
 * Generate specific report
 * Auth: admin only
 */
router.get('/reports/:reportType', controllers.generateReport);

/**
 * ================================================================
 * AUDIT LOG ROUTES
 * ================================================================
 */

/**
 * GET /api/v1/admin/audit-logs
 * Get audit trail
 * Query: { page: number, limit: number, action: string }
 * Auth: admin only
 */
router.get('/audit-logs', controllers.getAuditLogs);

export default router;

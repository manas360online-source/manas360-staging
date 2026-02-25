/**
 * ═══════════════════════════════════════════════════════════════
 * SAAS EXAMPLE ROUTES - PROTECTED ENDPOINTS WITH MIDDLEWARE
 * Demonstrates authentication, RBAC, feature gating, and rate limits
 * ═══════════════════════════════════════════════════════════════
 */

import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRole, checkPermission } from '../middleware/rbacMiddleware.js';
import { checkFeatureAccess, rateLimitByPlan } from '../middleware/featureAccessMiddleware.js';

const router = express.Router();

/**
 * Example 1: Basic authenticated route
 * Usage: GET /api/profile
 * Returns: User profile data (requires valid JWT)
 */
router.get('/profile',
    authenticateToken,
    async (req, res) => {
        try {
            const userId = req.user.id;

            const result = await pool.query(
                'SELECT id, email, first_name, last_name, role_id FROM user_accounts WHERE id = $1',
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                user: result.rows[0]
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * Example 2: Role-restricted route (Admin only)
 * Usage: DELETE /api/admin/users/:userId
 * Returns: Soft delete user (requires admin or superadmin role)
 */
router.delete('/admin/users/:userId',
    authenticateToken,
    authorizeRole(['admin', 'superadmin']),
    async (req, res) => {
        try {
            const { userId } = req.params;

            await pool.query(
                'UPDATE user_accounts SET deleted_at = NOW() WHERE id = $1',
                [userId]
            );

            res.json({ success: true, message: 'User deleted' });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * Example 3: Permission-checked route
 * Usage: GET /api/admin/analytics
 * Returns: Analytics dashboard data (requires view_analytics permission)
 */
router.get('/admin/analytics',
    authenticateToken,
    checkPermission('view_analytics'),
    async (req, res) => {
        try {
            // Return analytics data
            res.json({
                success: true,
                analytics: {
                    totalUsers: 1250,
                    activeSubscriptions: 450,
                    monthlyRecurringRevenue: 125000
                }
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * Example 4: Feature access route (Premium feature)
 * Usage: GET /api/features/premium-dashboard
 * Returns: Premium dashboard data (requires active subscription with feature)
 */
router.get('/features/premium-dashboard',
    authenticateToken,
    checkFeatureAccess('premium_dashboard'),
    async (req, res) => {
        try {
            res.json({
                success: true,
                data: {
                    title: 'Premium Dashboard',
                    widgets: ['revenue', 'users', 'churn', 'ltv'],
                    refreshRate: 60 // seconds
                }
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * Example 5: API rate limited by plan
 * Usage: GET /api/data/export (counts against monthly quota)
 * Returns: CSV export data (requests limited based on subscription plan)
 */
router.get('/data/export',
    authenticateToken,
    rateLimitByPlan(),
    async (req, res) => {
        try {
            // Your export logic here
            res.json({
                success: true,
                message: 'Exporting data...'
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export default router;

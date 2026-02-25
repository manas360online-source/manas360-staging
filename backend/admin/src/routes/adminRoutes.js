// ================================================
// MANAS360 Session Analytics - Admin Routes
// Story 3.6: Session Analytics
// ================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminAuth');

// All routes in this file are protected by adminAuth
router.use(adminAuth);

/**
 * @route GET /api/v1/admin/users
 * @desc List all users
 * @access Admin
 */
router.get('/users', adminController.getUsers);

/**
 * @route GET /api/v1/admin/users/:id
 * @desc Get user details
 * @access Admin
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @route PATCH /api/v1/admin/therapists/:id/verify
 * @desc Verify a therapist
 * @access Admin
 */
router.patch('/therapists/:id/verify', adminController.verifyTherapist);

/**
 * @route GET /api/v1/admin/metrics
 * @desc Get platform-wide metrics
 * @access Admin
 */
router.get('/metrics', adminController.getPlatformMetrics);

/**
 * @route GET /api/v1/admin/subscriptions
 * @desc List all subscriptions
 * @access Admin
 */
router.get('/subscriptions', adminController.getSubscriptions);

module.exports = router;

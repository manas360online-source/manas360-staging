// ================================================
// MANAS360 Session Analytics - API Routes
// Story 3.6: Session Analytics
// ================================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { adminAuth } = require('../middleware/adminAuth');

// =========================================
// Apply Admin Auth to All Routes
// =========================================
router.use(adminAuth);

// =========================================
// Analytics Endpoints
// =========================================

/**
 * @route   GET /api/analytics/overview
 * @desc    Get dashboard overview metrics
 * @access  Admin only
 * @query   startDate, endDate (YYYY-MM-DD)
 */
router.get('/overview', analyticsController.getOverview.bind(analyticsController));

/**
 * @route   GET /api/analytics/sessions
 * @desc    Get session metrics by type/mode
 * @access  Admin only
 * @query   startDate, endDate, groupBy (type|mode)
 */
router.get('/sessions', analyticsController.getSessions.bind(analyticsController));

/**
 * @route   GET /api/analytics/outcomes
 * @desc    Get patient outcome analytics
 * @access  Admin only
 * @query   startDate, endDate
 */
router.get('/outcomes', analyticsController.getOutcomes.bind(analyticsController));

/**
 * @route   GET /api/analytics/therapists
 * @desc    Get therapist performance rankings
 * @access  Admin only
 * @query   startDate, endDate, limit
 */
router.get('/therapists', analyticsController.getTherapists.bind(analyticsController));

/**
 * @route   GET /api/analytics/trends
 * @desc    Get time-based trend analysis
 * @access  Admin only
 * @query   startDate, endDate, interval (day|week|month)
 */
router.get('/trends', analyticsController.getTrends.bind(analyticsController));

/**
 * @route   GET /api/analytics/dropoff
 * @desc    Get patient drop-off analysis
 * @access  Admin only
 * @query   startDate, endDate
 */
router.get('/dropoff', analyticsController.getDropoff.bind(analyticsController));

/**
 * @route   GET /api/analytics/export/excel
 * @desc    Export analytics to Excel file
 * @access  Admin only
 * @query   startDate, endDate
 */
router.get('/export/excel', analyticsController.exportExcel.bind(analyticsController));

/**
 * @route   GET /api/analytics/export/pdf
 * @desc    Export analytics to PDF file
 * @access  Admin only
 * @query   startDate, endDate
 */
router.get('/export/pdf', analyticsController.exportPDF.bind(analyticsController));

module.exports = router;

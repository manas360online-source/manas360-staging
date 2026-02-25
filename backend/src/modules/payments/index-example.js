// ================================================================
// Payments Module - Main Entry Point
// ================================================================
// Handles payment processing and PhonePe webhook
// Protected routes require authentication
// Webhook route is public but has signature verification
// ================================================================

import express from 'express';
import * as controllers from './controllers.js';
import { verifyPaymentSignature } from './verification.js';
import { validateInput } from '../../middlewares/validateInput.js';

const router = express.Router();

/**
 * ================================================================
 * AUTHENTICATED PAYMENT ROUTES
 * ================================================================
 */

/**
 * POST /api/v1/payments/create
 * Initialize payment for subscription
 * Auth: required (Bearer token)
 * Body: { planId: number, plan_duration: 'month|year' }
 */
router.post('/create', validateInput((req) => {
  if (!req.body.planId) throw new Error('Plan ID required');
  if (!req.body.plan_duration) throw new Error('Plan duration required');
}), controllers.createPayment);

/**
 * GET /api/v1/payments/:transactionId
 * Get payment status
 * Auth: required
 * Params: transactionId (string)
 */
router.get('/:transactionId', controllers.getPaymentStatus);

/**
 * GET /api/v1/payments/history
 * Get user's payment history
 * Auth: required
 * Query: { page: number, limit: number }
 */
router.get('/history', controllers.getPaymentHistory);

/**
 * ================================================================
 * PUBLIC WEBHOOK ROUTE (No Auth Required)
 * ================================================================
 * PhonePe sends response to this endpoint after payment
 */

/**
 * POST /api/v1/payments/webhook
 * Receive payment confirmation from PhonePe
 * 
 * Security:
 * - Verifies X-Verify header signature (PhonePe -> us)
 * - Extracts transactionId from response
 * - Updates user_subscriptions in transaction
 * - Prevents duplicate activations with UNIQUE constraint
 * 
 * Body: { 
 *   success: boolean,
 *   code: string,
 *   message: string,
 *   data: {
 *     merchantId: string,
 *     transactionId: string,
 *     amount: number,
 *     ...
 *   }
 * }
 * 
 * Response: { success: true, message: 'Payment processed' }
 */
router.post('/webhook', verifyPaymentSignature, controllers.handlePaymentWebhook);

export default router;

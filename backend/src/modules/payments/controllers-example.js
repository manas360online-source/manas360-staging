// ================================================================
// Payments Controller - Payment Webhook Handler
// ================================================================
// Example implementation of complex payment webhook processing
// Shows database transactions, error handling, audit logging
// ================================================================

import { transaction, query } from '../../config/database-unified.js';
import { AppError } from '../../utils/errors.js';

/**
 * ================================================================
 * HANDLE PAYMENT WEBHOOK
 * ================================================================
 * 
 * When PhonePe confirms payment success:
 * 1. Verify signature (already done by middleware)
 * 2. Extract transaction details
 * 3. Get user and plan details
 * 4. Update user_subscriptions in transaction
 * 5. Log audit event
 * 6. Return success response
 * 
 * ⚠️ CRITICAL: Use DB transaction to prevent race conditions
 * ⚠️ CRITICAL: Check for duplicate payments
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export async function handlePaymentWebhook(req, res, next) {
  try {
    const { success, code, data } = req.body;

    // Step 1: Validate PhonePe response
    if (!success || code !== 'PAYMENT_SUCCESS') {
      console.warn('⚠️  Payment failed:', code, data?.message);
      return res.json({
        success: false,
        message: 'Payment was not successful',
        transactionId: data?.transactionId,
      });
    }

    // Step 2: Extract transaction details
    const {
      transactionId,
      merchantId,
      amount,
      timestamp,
    } = data;

    if (!transactionId || !amount) {
      throw new AppError('Invalid payment data from PhonePe', 400);
    }

    // Step 3: Use database transaction
    const result = await transaction(async (client) => {
      // ================================================================
      // GET EXISTING TRANSACTION (Check for duplicates)
      // ================================================================
      
      const existingTxn = await client.query(
        `SELECT id, user_id, status FROM payment_transactions 
         WHERE transaction_id = $1`,
        [transactionId]
      );

      if (existingTxn.rows.length > 0 && existingTxn.rows[0].status === 'completed') {
        console.warn('⚠️  Duplicate payment webhook:', transactionId);
        return {
          isDuplicate: true,
          transactionId,
          userId: existingTxn.rows[0].user_id,
        };
      }

      const userId = existingTxn.rows[0]?.user_id;

      // ================================================================
      // GET PLAN DETAILS
      // ================================================================
      
      const planResult = await client.query(
        `SELECT id, name, price_monthly FROM subscription_plans 
         WHERE price_monthly = $1 OR price_yearly = $1`,
        [amount / 100] // PhonePe sends amount in paise
      );

      if (planResult.rows.length === 0) {
        throw new AppError('Plan not found for payment amount', 400);
      }

      const planId = planResult.rows[0].id;

      // ================================================================
      // CANCEL EXISTING SUBSCRIPTIONS FOR THIS USER
      // ================================================================
      
      await client.query(
        `UPDATE user_subscriptions 
         SET status = 'cancelled', updated_at = NOW()
         WHERE user_id = $1 AND status IN ('active', 'pending')`,
        [userId]
      );

      // ================================================================
      // CREATE NEW ACTIVE SUBSCRIPTION
      // ================================================================
      
      const subscriptionResult = await client.query(
        `INSERT INTO user_subscriptions 
         (user_id, plan_id, status, starts_at, ends_at, created_at, updated_at)
         VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '1 month', NOW(), NOW())
         RETURNING id, user_id, plan_id`,
        [userId, planId]
      );

      const subscriptionId = subscriptionResult.rows[0].id;

      // ================================================================
      // UPDATE TRANSACTION STATUS
      // ================================================================
      
      const updateResult = await client.query(
        `UPDATE payment_transactions 
         SET status = 'completed', 
             subscription_id = $2,
             processed_at = NOW(),
             updated_at = NOW()
         WHERE transaction_id = $1
         RETURNING id`,
        [transactionId, subscriptionId]
      );

      // Insert if not exists
      if (updateResult.rows.length === 0) {
        await client.query(
          `INSERT INTO payment_transactions 
           (transaction_id, merchant_id, user_id, subscription_id, amount, status, processed_at, created_at)
           VALUES ($1, $2, $3, $4, $5, 'completed', NOW(), NOW())`,
          [transactionId, merchantId, userId, subscriptionId, amount]
        );
      }

      // ================================================================
      // LOG AUDIT EVENT
      // ================================================================
      
      await client.query(
        `INSERT INTO audit_logs 
         (user_id, action, resource, resource_id, details, created_at)
         VALUES ($1, 'payment_success', 'subscription', $2, $3, NOW())`,
        [userId, subscriptionId, JSON.stringify({
          amount,
          transactionId,
          planId,
          source: 'phoneme_webhook',
        })]
      );

      return {
        transactionId,
        subscriptionId,
        userId,
        amount,
        status: 'completed',
      };
    });

    // ================================================================
    // RESPONSE
    // ================================================================
    
    if (result.isDuplicate) {
      console.log('✅ Duplicate webhook handled (subscription already active)');
      return res.json({
        success: true,
        message: 'Payment already processed',
        transactionId: result.transactionId,
      });
    }

    // Send success response
    console.log('✅ Payment webhook processed successfully:', result.transactionId);
    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId: result.transactionId,
        subscriptionId: result.subscriptionId,
        status: result.status,
      },
    });

  } catch (error) {
    // ================================================================
    // ERROR HANDLING
    // ================================================================
    
    console.error('❌ Payment webhook error:', error);

    // Log failure to audit log for investigation
    try {
      await query(
        `INSERT INTO audit_logs 
         (action, resource, details, created_at)
         VALUES ('payment_webhook_error', 'payment', $1, NOW())`,
        [JSON.stringify({
          error: error.message,
          statusCode: error.statusCode || 500,
        })]
      );
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    // Return error response
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Payment processing failed',
    });
  }
}

/**
 * ================================================================
 * CREATE PAYMENT
 * ================================================================
 * Initialize payment with PhonePe API
 * Returns payment link for frontend
 */
export async function createPayment(req, res, next) {
  try {
    const { planId, plan_duration } = req.body;
    const userId = req.user.id;

    // Get plan details
    const planResult = await query(
      `SELECT id, name, price_monthly, price_yearly FROM subscription_plans 
       WHERE id = $1`,
      [planId]
    );

    if (planResult.rows.length === 0) {
      throw new AppError('Plan not found', 404);
    }

    const plan = planResult.rows[0];
    const amount = plan_duration === 'year' ? plan.price_yearly : plan.price_monthly;

    // Create transaction record
    const txnResult = await query(
      `INSERT INTO payment_transactions 
       (transaction_id, user_id, amount, status, created_at)
       VALUES ($1, $2, $3, 'pending', NOW())
       RETURNING transaction_id, amount`,
      [`TXN-${Date.now()}-${userId}`, userId, amount * 100]
    );

    const transactionId = txnResult.rows[0].transaction_id;

    // TODO: Call PhonePe API to get payment link

    res.json({
      success: true,
      data: {
        transactionId,
        amount,
        paymentLink: 'https://phoneme.in/pay/...',
      },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * ================================================================
 * GET PAYMENT STATUS
 * ================================================================
 */
export async function getPaymentStatus(req, res, next) {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `SELECT id, transaction_id, status, amount, created_at FROM payment_transactions 
       WHERE transaction_id = $1 AND user_id = $2`,
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Transaction not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    next(error);
  }
}

/**
 * ================================================================
 * GET PAYMENT HISTORY
 * ================================================================
 */
export async function getPaymentHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, transaction_id, status, amount, created_at FROM payment_transactions 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, count: result.rows.length },
    });

  } catch (error) {
    next(error);
  }
}

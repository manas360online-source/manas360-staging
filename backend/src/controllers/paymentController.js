import crypto from 'crypto';
import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';
import { logSecurityEvent } from '../utils/securityLogger.js';
import { validateTimestamp, verifyWebhookSignature } from '../utils/webhookSignature.js';

export async function createPayment(req, res) {
  try {
    const { planId } = req.body || {};
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const planResult = await pool.query(
      'SELECT id, name, price_monthly_paise FROM subscription_plans WHERE id = $1::uuid AND is_active = true',
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const plan = planResult.rows[0];
    const merchantTransactionId = `txn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const payment = await pool.query(
      `INSERT INTO payments (user_id, plan_id, merchant_transaction_id, amount_paise, status)
       VALUES ($1::uuid, $2::uuid, $3, $4, 'pending')
       RETURNING id, merchant_transaction_id, status, amount_paise, created_at`,
      [req.user.userId, plan.id, merchantTransactionId, plan.price_monthly_paise || 0]
    );

    return res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: {
        ...payment.rows[0],
        paymentGateway: 'PhonePe',
        redirectUrl: `/payments/checkout/${merchantTransactionId}`
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to create payment', error, 'createPayment failed');
  }
}

export async function handlePaymentWebhook(req, res) {
  const client = await pool.connect();
  try {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-signature'];
    const timestamp = req.headers['x-webhook-timestamp'] || req.headers['x-timestamp'];
    const eventId = req.headers['x-webhook-id'] || req.headers['x-event-id'];
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.PHONEPE_SALT_KEY;

    if (!signature || !timestamp || !eventId) {
      await logSecurityEvent('webhook_rejected', {
        reason: 'missing_signature_headers',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : JSON.stringify(req.body || {});

    const tsCheck = validateTimestamp(timestamp);
    if (!tsCheck.valid) {
      await logSecurityEvent('webhook_rejected', {
        reason: tsCheck.reason,
        eventId,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'Webhook timestamp validation failed' });
    }

    const sigCheck = verifyWebhookSignature({
      rawBody,
      timestamp,
      signature,
      secret
    });

    if (!sigCheck.valid) {
      await logSecurityEvent('webhook_rejected', {
        reason: sigCheck.reason,
        eventId,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'Webhook signature mismatch' });
    }

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(rawBody || '{}');
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    }

    const { merchantTransactionId, status = 'success' } = parsedPayload || {};

    if (!merchantTransactionId) {
      return res.status(400).json({ success: false, message: 'merchantTransactionId is required' });
    }

    await client.query('BEGIN');

    const idempotencyResult = await client.query(
      `INSERT INTO payment_webhook_events (event_id, signature, payload, status, received_at)
       VALUES ($1, $2, $3::jsonb, 'received', NOW())
       ON CONFLICT (event_id) DO NOTHING
       RETURNING event_id`,
      [String(eventId), String(signature), parsedPayload]
    );

    if (idempotencyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await logSecurityEvent('webhook_rejected', {
        reason: 'duplicate_event_id',
        eventId,
        merchantTransactionId,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(409).json({ success: false, message: 'Duplicate webhook event' });
    }

    const paymentResult = await client.query(
      'SELECT * FROM payments WHERE merchant_transaction_id = $1 FOR UPDATE',
      [merchantTransactionId]
    );

    if (paymentResult.rows.length === 0) {
      await client.query(
        `UPDATE payment_webhook_events
         SET status = 'rejected', processed_at = NOW(), error_message = 'payment_not_found'
         WHERE event_id = $1`,
        [String(eventId)]
      );
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const payment = paymentResult.rows[0];
    const normalizedStatus = String(status).toLowerCase() === 'success' ? 'success' : 'failed';

    await client.query(
      `UPDATE payments
       SET status = $1, paid_at = CASE WHEN $1 = 'success' THEN NOW() ELSE paid_at END, updated_at = NOW()
       WHERE id = $2::uuid`,
      [normalizedStatus, payment.id]
    );

    if (normalizedStatus === 'success') {
      await client.query(
        `UPDATE subscriptions
         SET status = 'cancelled', updated_at = NOW()
         WHERE user_id = $1::uuid AND status = 'active'`,
        [payment.user_id]
      );

      await client.query(
        `INSERT INTO subscriptions (user_id, plan_id, status, starts_at, ends_at, payment_transaction_id)
         VALUES ($1::uuid, $2::uuid, 'active', NOW(), NOW() + INTERVAL '30 days', $3)`,
        [payment.user_id, payment.plan_id, payment.merchant_transaction_id]
      );
    }

    await client.query(
      `UPDATE payment_webhook_events
       SET status = 'processed', processed_at = NOW(), payment_id = $1::uuid
       WHERE event_id = $2`,
      [payment.id, String(eventId)]
    );

    await client.query('COMMIT');

    return res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    await client.query('ROLLBACK');
    await logSecurityEvent('webhook_processing_failed', {
      reason: error.message,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || null
    });
    return respondInternalError(res, 'Webhook processing failed', error, 'handlePaymentWebhook failed');
  } finally {
    client.release();
  }
}

export async function getPaymentStatus(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, merchant_transaction_id, status, amount_paise, paid_at, created_at
       FROM payments
       WHERE merchant_transaction_id = $1 AND user_id = $2::uuid`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch payment status', error, 'getPaymentStatus failed');
  }
}

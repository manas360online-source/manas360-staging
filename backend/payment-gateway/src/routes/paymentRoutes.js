
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { query } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ─── CONFIG ───
const PHONEPE_CONFIG = {
    merchantId: process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT",
    saltKey: process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
    saltIndex: process.env.PHONEPE_SALT_INDEX || 1,
    apiBase: process.env.PHONEPE_ENV === 'PRODUCTION'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox',
    callbackUrl: `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/v1/payment/webhook`,
    redirectUrl: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/payment/callback`,
};

// ─── PLAN PRICING (paise) ───
const PLAN_PRICING = {
    premium_monthly: { amount: 29900, days: 30, type: 'recurring' },
    premium_yearly: { amount: 299900, days: 365, type: 'recurring' },
    anytimebuddy_lifetime: { amount: 999900, days: -1, type: 'one_time' },
    track_single: { amount: 3000, days: -1, type: 'one_time' },
};

// ─── HELPER: Send Email Stub ───
async function sendConfirmation(userId, txnId) {
    console.log(`[Email Mock] Sending payment confirmation to user ${userId} for ${txnId}`);
    return Promise.resolve();
}

// ─── SHARED: Process Successful Payment ───
// Called by BOTH /verify and /webhook for consistency
async function processSuccessfulPayment(payment, pgData) {
    const plan = PLAN_PRICING[payment.plan_id];
    const now = new Date();
    const endDate = plan.days === -1
        ? new Date('2099-12-31')
        : new Date(now.getTime() + plan.days * 86400000);

    // Use query wrapper instead of raw client for mock/demo safety
    try {
        await query('BEGIN');

        // Update payment
        await query(`
      UPDATE payments SET
        status = 'SUCCESS',
        phonepe_payment_id = $1,
        payment_method = $2,
        updated_at = NOW()
      WHERE transaction_id = $3
    `, [pgData.data?.transactionId,
        pgData.data?.paymentInstrument?.type || 'UPI',
        payment.transaction_id]);

        // Upsert subscription
        await query(`
      INSERT INTO subscriptions (user_id, plan_id, status,
        starts_at, ends_at, payment_transaction_id, auto_renew)
      VALUES ($1, $2, 'active', NOW(), $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        plan_id = $2, status = 'active',
        starts_at = NOW(), ends_at = $3,
        payment_transaction_id = $4,
        auto_renew = $5, updated_at = NOW()
    `, [payment.user_id, payment.plan_id,
            endDate, payment.transaction_id,
        plan.type === 'recurring']);

        // Upgrade user
        await query(`
      UPDATE users SET
        subscription_tier = 'premium',
        subscription_status = 'active',
        premium_ends_at = $1, updated_at = NOW()
      WHERE user_id = $2
    `, [endDate, payment.user_id]);

        // Revenue split (if therapist involved)
        // Provider: 60% | Platform: 40%
        if (payment.therapist_id) {
            const providerShare = Math.round(plan.amount * 0.60);
            const platformShare = plan.amount - providerShare;

            await query(`
        INSERT INTO settlements
          (transaction_id, therapist_id, total_amount,
           provider_share, platform_share, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
      `, [payment.transaction_id, payment.therapist_id,
            plan.amount, providerShare, platformShare]);
        }

        // Audit log
        await query(`
            INSERT INTO audit_log
            (user_id, action, details, created_at)
            VALUES ($1, 'payment_success', $2, NOW())
        `, [payment.user_id, JSON.stringify({
            transaction_id: payment.transaction_id, plan_id: payment.plan_id,
            amount: plan.amount, source: payment.source_screen,
        })]);

        await query('COMMIT');
    } catch (e) {
        await query('ROLLBACK');
        console.error("Process Payment DB Error", e);
        throw e;
    }
}

// ═════════════════════════════════════════════
//  POST /api/v1/payment/create
// ═════════════════════════════════════════════
router.post('/create', authMiddleware, async (req, res) => {
    const {
        user_id = "demo_user", plan_id, source,
        therapist_id = null,
        track_id = null,
        metadata = {},
    } = req.body;

    // Validate plan
    const plan = PLAN_PRICING[plan_id];
    if (!plan) return res.status(400).json({ error: 'Invalid plan_id' });

    try {
        const txnId = `M360_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        await query(`
      INSERT INTO payments
        (transaction_id, user_id, plan_id, amount_paise,
         source_screen, therapist_id, track_id, metadata,
         status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'INITIATED', NOW())
    `, [txnId, user_id, plan_id, plan.amount,
            source, therapist_id, track_id, JSON.stringify(metadata)]);

        const payload = {
            merchantId: PHONEPE_CONFIG.merchantId,
            merchantTransactionId: txnId,
            merchantUserId: user_id,
            amount: plan.amount,
            redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?txn=${txnId}`,
            redirectMode: 'REDIRECT',
            callbackUrl: PHONEPE_CONFIG.callbackUrl,
            paymentInstrument: { type: 'PAY_PAGE' },
            mobileNumber: "9999999999"
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = crypto.createHash('sha256')
            .update(base64Payload + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey)
            .digest('hex') + '###' + PHONEPE_CONFIG.saltIndex;

        let pgResponse;
        try {
            pgResponse = await axios.post(
                `${PHONEPE_CONFIG.apiBase}/pg/v1/pay`,
                { request: base64Payload },
                { headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum } }
            );
        } catch (phonePeErr) {
            console.error("PhonePe API Request Failed:", phonePeErr.message);
            // PRODUCTION: Do not fall back to simulated success - fail fast with clear error
            // This prevents fake successful payments and alerts operators to misconfiguration
            return res.status(500).json({ 
                success: false, 
                message: "Payment gateway unavailable. Please try again later.",
                error: "PAYMENT_GATEWAY_ERROR"
            });
        }

        const paymentUrl = pgResponse.data?.data?.instrumentResponse?.redirectInfo?.url;

        await query(`
      UPDATE payments SET phonepe_ref = $1, status = 'PENDING', updated_at = NOW()
      WHERE transaction_id = $2
    `, [pgResponse.data?.data?.merchantTransactionId, txnId]);

        res.json({
            success: true,
            transaction_id: txnId,
            payment_url: paymentUrl,
            callback_url: PHONEPE_CONFIG.redirectUrl,
            webhook_url: PHONEPE_CONFIG.callbackUrl,
        });

    } catch (err) {
        // Only catch actual logic/db errors here, PhonePe errors are handled above
        console.error('[Payment Create]', err.response?.data || err.message);
        res.status(500).json({ error: 'Payment initiation failed', details: err.message });
    }
});


// ═════════════════════════════════════════════
//  POST /api/v1/payment/verify
// ═════════════════════════════════════════════
router.post('/verify', authMiddleware, async (req, res) => {
    const { transaction_id } = req.body;

    try {
        const { rows: [existing] } = await query(
            'SELECT * FROM payments WHERE transaction_id = $1',
            [transaction_id]
        );

        if (!existing) return res.status(404).json({ error: 'Transaction not found' });

        if (existing.status === 'SUCCESS') {
            const plan = PLAN_PRICING[existing.plan_id];
            const endDate = plan.days === -1 ? new Date('2099-12-31') : new Date(existing.created_at.getTime() + plan.days * 86400000);
            return res.json({ status: 'SUCCESS', subscription_end: endDate.toISOString(), payment_method: existing.payment_method || 'UPI', transaction_id });
        }

        const statusUrl = `${PHONEPE_CONFIG.apiBase}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transaction_id}`;
        const checksum = crypto.createHash('sha256')
            .update(`/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transaction_id}` + PHONEPE_CONFIG.saltKey)
            .digest('hex') + '###' + PHONEPE_CONFIG.saltIndex;

        const pgStatus = await axios.get(statusUrl, {
            headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum, 'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId }
        });

        const pgData = pgStatus.data;
        if (pgData.code === 'PAYMENT_SUCCESS') {
            await processSuccessfulPayment(existing, pgData);

            const plan = PLAN_PRICING[existing.plan_id];
            const now = new Date();
            const endDate = plan.days === -1 ? new Date('2099-12-31') : new Date(now.getTime() + plan.days * 86400000);

            sendConfirmation(existing.user_id, transaction_id).catch(console.error);

            return res.json({
                status: 'SUCCESS',
                subscription_end: endDate.toISOString(),
                payment_method: pgData.data?.paymentInstrument?.type,
                transaction_id: transaction_id,
            });
        } else {
            await query(`UPDATE payments SET status = 'FAILED', error_code = $1 WHERE transaction_id = $2`, [pgData.code, transaction_id]);
            return res.json({ status: 'FAILED', error: pgData.message || 'Payment failed' });
        }

    } catch (err) {
        console.error('[Payment Verify]', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// ═════════════════════════════════════════════
//  GET /api/v1/payment/status/:txnId
// ═════════════════════════════════════════════
router.get('/status/:txnId', authMiddleware, async (req, res) => {
    const { txnId } = req.params;
    try {
        const { rows: [payment] } = await query(`
        SELECT p.*, s.ends_at as subscription_end
        FROM payments p
        LEFT JOIN subscriptions s ON s.payment_transaction_id = p.transaction_id
        WHERE p.transaction_id = $1 AND p.user_id = $2
      `, [txnId, req.user.id]);

        if (!payment) return res.status(404).json({ error: 'Transaction not found' });

        if (payment.status === 'SUCCESS' || payment.status === 'FAILED') {
            return res.json({
                status: payment.status,
                subscription_end: payment.subscription_end,
                payment_method: payment.payment_method,
                error: payment.error_code,
            });
        }

        // Check PhonePe
        const statusUrl = `${PHONEPE_CONFIG.apiBase}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${txnId}`;
        const checksum = crypto.createHash('sha256')
            .update(`/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${txnId}` + PHONEPE_CONFIG.saltKey)
            .digest('hex') + '###' + PHONEPE_CONFIG.saltIndex;

        let pgCheck;
        try {
            const pgResp = await axios.get(statusUrl, {
                headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum, 'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId }
            });
            pgCheck = pgResp.data;
        } catch (e) {
            return res.json({ status: 'PENDING' });
        }

        if (pgCheck.code === 'PAYMENT_SUCCESS') {
            await processSuccessfulPayment(payment, pgCheck);
            const plan = PLAN_PRICING[payment.plan_id];
            const endDate = plan.days === -1 ? new Date('2099-12-31') : new Date(Date.now() + plan.days * 86400000);
            return res.json({ status: 'SUCCESS', subscription_end: endDate.toISOString(), payment_method: pgCheck.data?.paymentInstrument?.type });
        } else if (pgCheck.code === 'PAYMENT_ERROR') {
            await query(`UPDATE payments SET status='FAILED', error_code=$1 WHERE transaction_id=$2`, [pgCheck.code, txnId]);
            return res.json({ status: 'FAILED', error: pgCheck.message });
        }

        return res.json({ status: 'PENDING' });

    } catch (err) {
        console.error('[Payment Status]', err);
        res.status(500).json({ error: 'Status check failed' });
    }
});

// ═════════════════════════════════════════════
//  POST /api/v1/payment/webhook
// ═════════════════════════════════════════════
router.post('/webhook', async (req, res) => {
    const { response } = req.body;

    try {
        // ① Verify webhook signature
        const xVerify = req.headers['x-verify'];
        const expectedChecksum = crypto
            .createHash('sha256')
            .update(response + PHONEPE_CONFIG.saltKey)
            .digest('hex')
            + '###' + PHONEPE_CONFIG.saltIndex;

        if (xVerify !== expectedChecksum) {
            console.error('[Webhook] Signature mismatch!');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // ② Decode payload
        const decoded = JSON.parse(
            Buffer.from(response, 'base64').toString('utf-8')
        );

        const txnId = decoded.data?.merchantTransactionId;
        const pgCode = decoded.code;
        const isSuccess = pgCode === 'PAYMENT_SUCCESS';

        console.log(`[Webhook] ${txnId} → ${pgCode}`);

        // ③ Idempotency check — skip if already processed
        const { rows: [existing] } = await query(
            'SELECT * FROM payments WHERE transaction_id = $1',
            [txnId]
        );

        if (existing?.status === 'SUCCESS' || existing?.status === 'FAILED') {
            return res.status(200).json({ received: true });
        }

        if (isSuccess) {
            await processSuccessfulPayment(existing, decoded);
        } else {
            await query(`
        UPDATE payments SET status = 'FAILED',
          error_code = $1, updated_at = NOW()
        WHERE transaction_id = $2
      `, [pgCode, txnId]);
        }

        // ④ Always return 200 to PhonePe
        res.status(200).json({ received: true });

    } catch (err) {
        console.error('[Webhook Error]', err);
        res.status(200).json({ received: true, error: true });
    }
});

module.exports = router;

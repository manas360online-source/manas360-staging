import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

export async function getPlans(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, tier, price_monthly_paise, price_annual_paise, billing_period_days, is_featured
       FROM subscription_plans
       WHERE is_active = true
       ORDER BY tier ASC`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch plans', error, 'getPlans failed');
  }
}

export async function getCurrentSubscription(req, res) {
  try {
    const result = await pool.query(
      `SELECT s.id, s.status, s.starts_at, s.ends_at, s.auto_renew, s.payment_transaction_id,
              sp.id as plan_id, sp.name as plan_name, sp.tier
       FROM subscriptions s
       JOIN subscription_plans sp ON sp.id = s.plan_id
       WHERE s.user_id = $1::uuid
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.user.userId]
    );

    return res.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch subscription', error, 'getCurrentSubscription failed');
  }
}

export async function upgradeSubscription(req, res) {
  const client = await pool.connect();
  try {
    const { planId } = req.body || {};
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    await client.query('BEGIN');

    const planResult = await client.query(
      'SELECT id, billing_period_days FROM subscription_plans WHERE id = $1::uuid AND is_active = true',
      [planId]
    );

    if (planResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await client.query(
      `UPDATE subscriptions
       SET status = 'cancelled', updated_at = NOW()
       WHERE user_id = $1::uuid AND status = 'active'`,
      [req.user.userId]
    );

    const days = planResult.rows[0].billing_period_days || 30;
    const created = await client.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, starts_at, ends_at)
       VALUES ($1::uuid, $2::uuid, 'active', NOW(), NOW() + ($3::text || ' days')::interval)
       RETURNING id, user_id, plan_id, status, starts_at, ends_at`,
      [req.user.userId, planId, String(days)]
    );

    await client.query('COMMIT');

    return res.status(201).json({ success: true, message: 'Subscription upgraded', data: created.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    return respondInternalError(res, 'Failed to upgrade subscription', error, 'upgradeSubscription failed');
  } finally {
    client.release();
  }
}

export async function cancelSubscription(req, res) {
  try {
    const result = await pool.query(
      `UPDATE subscriptions
       SET status = 'cancelled', auto_renew = false, updated_at = NOW()
       WHERE user_id = $1::uuid AND status = 'active'
       RETURNING id, status, ends_at`,
      [req.user.userId]
    );

    return res.json({
      success: true,
      message: result.rows.length ? 'Subscription cancelled' : 'No active subscription to cancel',
      data: result.rows[0] || null
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to cancel subscription', error, 'cancelSubscription failed');
  }
}

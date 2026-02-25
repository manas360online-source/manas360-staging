/**
 * ════════════════════════════════════════════════════════════════════════════
 * SUBSCRIPTION FEATURE GATING MIDDLEWARE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Ensures users have active subscriptions before accessing premium features
 * 
 * Usage:
 *   router.post(
 *     '/themed-rooms/sessions',
 *     authenticateToken,
 *     requireSubscription('premium_themed_rooms'),
 *     createSessionHandler
 *   )
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

/**
 * Require active subscription (any plan)
 * 
 * Usage:
 *   requireSubscription()  // Any active subscription
 */
export const requireSubscription = (featureName = null) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has active subscription
      const subResult = await pool.query(
        `SELECT s.id, s.plan_id, sp.name as plan_name, s.status, s.ends_at
         FROM subscriptions s
         JOIN subscription_plans sp ON s.plan_id = sp.id
         WHERE s.user_id = $1
         AND s.status = 'active'
         AND s.ends_at > NOW()
         LIMIT 1`,
        [req.user.userId]
      );

      if (subResult.rows.length === 0) {
        // No active subscription
        return res.status(402).json({
          success: false,
          message: 'Active subscription required to access this feature',
          code: 'SUBSCRIPTION_REQUIRED',
          action: 'subscribe',
          paymentNeeded: true
        });
      }

      const subscription = subResult.rows[0];
      req.subscription = subscription;

      // If specific feature required, check if plan includes it
      if (featureName) {
        const featureResult = await pool.query(
          `SELECT pf.id
           FROM plan_features pf
           JOIN features f ON pf.feature_id = f.id
           WHERE pf.plan_id = $1
           AND f.name = $2
           AND f.is_active = true`,
          [subscription.plan_id, featureName]
        );

        if (featureResult.rows.length === 0) {
          // Plan doesn't include this feature
          return res.status(403).json({
            success: false,
            message: `Feature '${featureName}' not available on ${subscription.plan_name} plan`,
            code: 'FEATURE_NOT_AVAILABLE',
            currentPlan: subscription.plan_name,
            action: 'upgrade_plan',
            requiredFeature: featureName
          });
        }
      }

      next();
    } catch (error) {
      return respondInternalError(res, 'Failed to verify subscription', error, 'Subscription gating error');
    }
  };
};

/**
 * Require specific subscription tier
 * 
 * Usage:
 *   requireTier(50)  // Require Pro tier (tier >= 50)
 */
export const requireTier = (minimumTier = 0) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const subResult = await pool.query(
        `SELECT s.id, sp.name, sp.tier, s.status, s.ends_at
         FROM subscriptions s
         JOIN subscription_plans sp ON s.plan_id = sp.id
         WHERE s.user_id = $1
         AND s.status = 'active'
         AND s.ends_at > NOW()
         ORDER BY sp.tier DESC
         LIMIT 1`,
        [req.user.userId]
      );

      if (subResult.rows.length === 0) {
        return res.status(402).json({
          success: false,
          message: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const subscription = subResult.rows[0];

      if (subscription.tier < minimumTier) {
        return res.status(403).json({
          success: false,
          message: `This feature requires a plan with tier ${minimumTier} or higher`,
          currentTier: subscription.tier,
          requiredTier: minimumTier,
          currentPlan: subscription.name,
          action: 'upgrade_plan'
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Tier check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify subscription tier'
      });
    }
  };
};

/**
 * Optional: Check subscription and attach to req if exists
 * Unlike requireSubscription, this doesn't block non-subscribers
 * 
 * Usage:
 *   router.get('/features', checkSubscription(), getFeatures)
 *   // Then in handler:
 *   const isPremium = req.subscription?.status === 'active';
 */
export const checkSubscription = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next();
      }

      const subResult = await pool.query(
        `SELECT s.id, s.plan_id, sp.name, sp.tier, s.status, s.ends_at
         FROM subscriptions s
         JOIN subscription_plans sp ON s.plan_id = sp.id
         WHERE s.user_id = $1
         AND s.status = 'active'
         AND s.ends_at > NOW()
         LIMIT 1`,
        [req.user.userId]
      );

      if (subResult.rows.length > 0) {
        req.subscription = subResult.rows[0];
        req.isPremium = true;
      } else {
        req.isPremium = false;
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      // Don't block on error
      next();
    }
  };
};

/**
 * Check if subscription expires within N days
 * Useful for sending renewal reminders
 * 
 * Usage:
 *   router.get('/me', checkSubscription(), checkSubscriptionExpiry(7), getCurrentUser)
 *   // In handler:
 *   if (req.subscriptionExpiressoon) {
 *     res.headers.set('X-Subscription-Expires-Soon', 'true');
 *   }
 */
export const checkSubscriptionExpiry = (daysUntilExpiry = 7) => {
  return (req, res, next) => {
    if (req.subscription) {
      const expiryDate = new Date(req.subscription.ends_at);
      const now = new Date();
      const daysRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

      if (daysRemaining <= daysUntilExpiry && daysRemaining > 0) {
        req.subscriptionExpiresSoon = true;
        req.daysUntilExpiry = daysRemaining;
      }
    }

    next();
  };
};

export default {
  requireSubscription,
  requireTier,
  checkSubscription,
  checkSubscriptionExpiry
};

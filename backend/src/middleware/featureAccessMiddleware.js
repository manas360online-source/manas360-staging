/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 FEATURE ACCESS MIDDLEWARE
 * Subscription-based feature access control
 * ═══════════════════════════════════════════════════════════════
 */

import { pool } from '../config/database.js';
import { logAuditEvent } from '../services/auditService.js';

/**
 * MIDDLEWARE: Check if user has access to a feature
 * Usage: router.get('/premium/dashboard', checkFeatureAccess('premium_dashboard'), controller);
 * 
 * Features are tied to subscription plans
 * @param {string|Array<string>} requiredFeatures - Feature name(s)
 */
export function checkFeatureAccess(requiredFeatures = []) {
    const features = Array.isArray(requiredFeatures) 
        ? requiredFeatures 
        : [requiredFeatures];

    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // Get user's active subscription and features
            const query = `
                SELECT DISTINCT f.name as feature_name
                FROM vw_user_features vuf
                JOIN features f ON vuf.feature_id = f.id
                WHERE vuf.user_id = $1 AND f.is_active = true
            `;

            const result = await pool.query(query, [userId]);
            const userFeatures = result.rows.map(row => row.feature_name);

            // Check if user has required feature
            const hasFeature = features.some(feat => 
                userFeatures.includes(feat)
            );

            if (!hasFeature) {
                // Log feature access denial
                await logAuditEvent(userId, 'feature_access_denied', 'failure',
                    req.ip, req.get('user-agent'), {
                        required_features: features,
                        endpoint: req.originalUrl
                    });

                // Determine if user needs to upgrade
                const subscriptionResult = await pool.query(
                    `SELECT sp.name, sp.tier 
                     FROM vw_users_with_subscription 
                     JOIN subscription_plans sp ON sp.id = (
                        SELECT id FROM subscription_plans WHERE tier = 
                        (SELECT tier FROM subscription_plans 
                         WHERE id IN (SELECT plan_id FROM plan_features 
                         WHERE feature_id IN (SELECT id FROM features WHERE name = $1)))
                        LIMIT 1
                     )
                     WHERE id = $1`,
                    [features[0]]
                ).catch(() => ({ rows: [] }));

                const recommendedPlan = subscriptionResult.rows[0];

                return res.status(403).json({
                    success: false,
                    error: 'FeatureNotAvailable',
                    message: `Feature requires a subscription upgrade`,
                    requiredFeatures: features,
                    recommendedPlan: recommendedPlan?.name,
                    userFeatures: userFeatures
                });
            }

            req.user.features = userFeatures;
            next();

        } catch (error) {
            console.error('Feature access check error:', error);
            res.status(500).json({
                success: false,
                error: 'FeatureCheckError',
                message: 'Failed to verify feature access'
            });
        }
    };
}

/**
 * Get user's available features
 */
export async function getUserFeatures(userId) {
    try {
        const query = `
            SELECT 
                f.id,
                f.name,
                f.description,
                f.category,
                sp.name as plan_name,
                sp.tier as plan_tier
            FROM vw_user_features vuf
            JOIN features f ON vuf.feature_id = f.id
            LEFT JOIN subscription_plans sp ON vuf.plan_id = sp.id
            WHERE vuf.user_id = $1 AND f.is_active = true
            ORDER BY sp.tier DESC, f.name
        `;

        const result = await pool.query(query, [userId]);
        return result.rows;

    } catch (error) {
        console.error('Error fetching user features:', error);
        return [];
    }
}

/**
 * Get user's subscription status
 */
export async function getUserSubscription(userId) {
    try {
        const query = `
            SELECT 
                id,
                plan_name,
                plan_tier,
                subscription_status,
                starts_at,
                ends_at,
                days_remaining,
                is_subscription_active,
                auto_renew,
                next_billing_at
            FROM vw_users_with_subscription
            WHERE id = $1
        `;

        const result = await pool.query(query, [userId]);
        return result.rows[0] || null;

    } catch (error) {
        console.error('Error fetching user subscription:', error);
        return null;
    }
}

/**
 * Check if subscription is active and not expired
 */
export async function isSubscriptionActive(userId) {
    try {
        const query = `
            SELECT is_subscription_active
            FROM vw_users_with_subscription
            WHERE id = $1
        `;

        const result = await pool.query(query, [userId]);
        return result.rows[0]?.is_subscription_active || false;

    } catch (error) {
        console.error('Error checking subscription status:', error);
        return false;
    }
}

/**
 * Check if user has trial remaining
 */
export async function hasTrialRemaining(userId) {
    try {
        const query = `
            SELECT 
                is_trial,
                trial_ends_at,
                EXTRACT(DAY FROM trial_ends_at - NOW()) as days_remaining
            FROM user_subscriptions
            WHERE user_id = $1 
            AND is_trial = true 
            AND trial_ends_at > NOW()
            AND status = 'active'
            ORDER BY trial_ends_at DESC
            LIMIT 1
        `;

        const result = await pool.query(query, [userId]);
        return result.rows[0] || null;

    } catch (error) {
        console.error('Error checking trial status:', error);
        return null;
    }
}

/**
 * API Rate limiting based on subscription plan
 */
export function rateLimitByPlan() {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const endpoint = `${req.method}:${req.path}`;

            if (!userId) {
                return next(); // Skip rate limiting for unauthenticated
            }

            // Get user's plan limits
            const planQuery = `
                SELECT sp.max_api_requests_per_month
                FROM vw_users_with_subscription
                JOIN subscription_plans sp ON sp.id = plan_id
                WHERE id = $1
            `;

            const planResult = await pool.query(planQuery, [userId]);
            const maxRequests = planResult.rows[0]?.max_api_requests_per_month || 100;

            // Check rate limit
            const rateQuery = `
                SELECT request_count
                FROM rate_limit_logs
                WHERE user_id = $1 
                AND endpoint = $2
                AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
            `;

            const rateResult = await pool.query(rateQuery, [userId, endpoint]);
            const currentCount = rateResult.rows[0]?.request_count || 0;

            if (currentCount >= maxRequests) {
                return res.status(429).json({
                    success: false,
                    error: 'RateLimitExceeded',
                    message: `API rate limit exceeded (${maxRequests} requests/month)`,
                    retryAfter: 86400
                });
            }

            // Increment counter
            const incrementQuery = `
                INSERT INTO rate_limit_logs (user_id, endpoint, request_count, created_at, expires_at)
                VALUES ($1, $2, 1, NOW(), NOW() + INTERVAL '1 month')
                ON CONFLICT (user_id, endpoint) DO UPDATE
                SET request_count = request_count + 1
            `;

            await pool.query(incrementQuery, [userId, endpoint]);

            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', maxRequests - currentCount - 1);

            next();

        } catch (error) {
            console.error('Rate limiting error:', error);
            next(); // Continue even if rate limiting fails
        }
    };
}

/**
 * MIDDLEWARE: Require active subscription
 * Usage: router.get('/premium-feature', requireActiveSubscription, controller);
 */
export function requireActiveSubscription(req, res, next) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            const isActive = await isSubscriptionActive(userId);

            if (!isActive) {
                const subscriptionInfo = await getUserSubscription(userId);
                
                await logAuditEvent(userId, 'subscription_required', 'failure',
                    req.ip, req.get('user-agent'), {
                        endpoint: req.originalUrl
                    });

                return res.status(402).json({
                    success: false,
                    error: 'SubscriptionRequired',
                    message: 'This feature requires an active subscription',
                    currentSubscription: subscriptionInfo,
                    upgradeUrl: '/subscribe'
                });
            }

            next();

        } catch (error) {
            console.error('Subscription check error:', error);
            res.status(500).json({
                success: false,
                error: 'SubscriptionCheckError',
                message: 'Failed to verify subscription'
            });
        }
    };
}

export default {
    checkFeatureAccess,
    getUserFeatures,
    getUserSubscription,
    isSubscriptionActive,
    hasTrialRemaining,
    rateLimitByPlan,
    requireActiveSubscription
};

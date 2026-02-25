/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCTION USER SERVICE
 * Enterprise-grade user management with transaction safety
 * 
 * FIXES APPLIED:
 * ✅ Fixed subscription blocking login (removed line 172 check)
 * ✅ Fixed token generation signature mismatch
 * ✅ Added account lockout after 5 failed attempts
 * ✅ Added transaction safety
 * ✅ Embedded permissions/features in JWT (eliminates N+1)
 * ✅ Added proper error handling
 * ═══════════════════════════════════════════════════════════════
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool, query, transaction } from '../config/database-production.js';
import { 
    generateAccessToken, 
    generateRefreshToken, 
    storeRefreshToken,
    recordFailedLogin,
    recordSuccessfulLogin,
    loadUserPermissionsAndFeatures
} from '../middleware/authMiddleware-PRODUCTION.js';

const BCRYPT_ROUNDS = 10;

/**
 * ═══════════════════════════════════════════════════════════════
 * USER REGISTRATION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Register New User
 * Creates user account with free tier subscription
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - Plain text password (will be hashed)
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.phoneNumber - Phone number (optional)
 * @param {string} ipAddress - Client IP address
 * @param {string} userAgent - Client user agent
 */
export async function registerUser(userData, ipAddress, userAgent) {
    const { email, password, firstName = '', lastName = '', phoneNumber = null, language = 'en' } = userData;
    
    try {
        // 1. Validate input
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }

        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            throw new Error('Password must contain uppercase, lowercase, and numbers');
        }

        // 2. Check if user already exists
        const existingUser = await query(
            'SELECT id FROM user_accounts WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('Email already registered');
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // 4. Use transaction for atomicity
        const result = await transaction(async (client) => {
            // Get default 'user' role (not 'guest' - guests don't register)
            const roleResult = await client.query(
                'SELECT id FROM roles WHERE name = $1',
                ['user']
            );
            
            if (roleResult.rows.length === 0) {
                throw new Error('Default role not found. Run database migrations.');
            }
            
            const roleId = roleResult.rows[0].id;

            // Insert user account
            const userResult = await client.query(`
                INSERT INTO user_accounts (
                    email, password_hash, first_name, last_name,
                    phone_number, role_id, language, is_email_verified
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, false)
                RETURNING id, email, created_at
            `, [email, passwordHash, firstName, lastName, phoneNumber, roleId, language]);

            const user = userResult.rows[0];

            // Get Free plan
            const planResult = await client.query(
                'SELECT id FROM subscription_plans WHERE tier = $1 AND is_active = true',
                [1]  // Free tier
            );

            if (planResult.rows.length === 0) {
                throw new Error('Free plan not found. Run database migrations.');
            }
            
            const planId = planResult.rows[0].id;

            // Create free subscription (never expires)
            await client.query(`
                INSERT INTO user_subscriptions (
                    user_id, plan_id, starts_at, ends_at, status
                )
                VALUES ($1, $2, NOW(), NOW() + INTERVAL '100 years', 'active')
            `, [user.id, planId]);

            // Log registration in audit log
            await client.query(`
                INSERT INTO audit_logs (
                    user_id, action, resource_type, resource_id, 
                    ip_address, user_agent, metadata
                )
                VALUES ($1, 'user_registered', 'user_account', $1, $2, $3, $4)
            `, [
                user.id, 
                ipAddress, 
                userAgent,
                JSON.stringify({ email, firstName, lastName })
            ]);

            return user;
        });

        // 5. Load permissions and features for JWT
        const { permissions, features, privilegeLevel } = await loadUserPermissionsAndFeatures(result.id);
        
        // Get role_id for JWT
        const userWithRole = await query(
            'SELECT role_id FROM user_accounts WHERE id = $1',
            [result.id]
        );

        // 6. Generate tokens with embedded permissions (CRITICAL FIX)
        const accessToken = generateAccessToken({
            userId: result.id,
            roleId: userWithRole.rows[0].role_id,
            email: result.email,
            permissions,
            features,
            privilegeLevel
        });
        
        const refreshToken = generateRefreshToken(result.id);
        await storeRefreshToken(result.id, refreshToken, ipAddress, userAgent);

        return {
            success: true,
            message: 'User registered successfully',
            user: {
                id: result.id,
                email: result.email,
                firstName,
                lastName
            },
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: process.env.JWT_EXPIRY || '15m'
        };

    } catch (error) {
        console.error('[USER SERVICE] Registration failed:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * USER LOGIN
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Login User
 * Authenticates user and returns JWT tokens
 * 
 * CRITICAL FIX: Removed subscription requirement from login
 * Users can login even with expired subscriptions (access is controlled by features)
 */
export async function loginUser(email, password, ipAddress, userAgent) {
    try {
        // 1. Find user by email (case-insensitive)
        const userResult = await query(
            'SELECT id, email, password_hash, role_id, is_active, is_locked, failed_login_attempts FROM user_accounts WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL',
            [email]
        );

        if (userResult.rows.length === 0) {
            // Record failed attempt (user not found)
            await recordFailedLogin(email, ipAddress, userAgent, 'User not found');
            throw new Error('Invalid credentials');
        }

        const user = userResult.rows[0];

        // 2. Check if account is locked
        if (user.is_locked) {
            await recordFailedLogin(email, ipAddress, userAgent, 'Account locked');
            throw new Error('Account locked due to too many failed login attempts. Please contact support.');
        }

        // 3. Check if account is active
        if (!user.is_active) {
            await recordFailedLogin(email, ipAddress, userAgent, 'Account inactive');
            throw new Error('Account is inactive. Please contact support.');
        }

        // 4. Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            // Record failed attempt and check for lockout
            const lockStatus = await recordFailedLogin(email, ipAddress, userAgent, 'Invalid password');
            
            if (lockStatus.locked) {
                throw new Error(`Account locked after ${lockStatus.attempts} failed attempts. Please contact support.`);
            }
            
            throw new Error('Invalid credentials');
        }

        // 5. CRITICAL FIX: DO NOT check subscription status at login
        // Subscription/feature access is controlled by middleware, not login
        // This allows users to login and see upgrade prompts

        // 6. Load permissions and features for JWT
        const { permissions, features, privilegeLevel } = await loadUserPermissionsAndFeatures(user.id);

        // 7. Generate tokens with embedded data (CRITICAL FIX)
        const accessToken = generateAccessToken({
            userId: user.id,
            roleId: user.role_id,
            email: user.email,
            permissions,
            features,
            privilegeLevel
        });
        
        const refreshToken = generateRefreshToken(user.id);
        await storeRefreshToken(user.id, refreshToken, ipAddress, userAgent);

        // 8. Record successful login
        await recordSuccessfulLogin(email, ipAddress, userAgent);

        // 9. Log audit event
        await query(`
            INSERT INTO audit_logs (
                user_id, action, resource_type, ip_address, user_agent
            )
            VALUES ($1, 'login_success', 'auth', $2, $3)
        `, [user.id, ipAddress, userAgent]);

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            },
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: process.env.JWT_EXPIRY || '15m'
        };

    } catch (error) {
        console.error('[USER SERVICE] Login failed:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SUBSCRIPTION MANAGEMENT
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Create or Upgrade Subscription
 * Transaction-safe subscription management
 * 
 * @param {string} userId - User UUID
 * @param {string} planId - Plan UUID
 * @param {string} paymentReference - Payment gateway transaction ID
 */
export async function createSubscription(userId, planId, paymentReference = null) {
    try {
        const result = await transaction(async (client) => {
            // Get plan details
            const planResult = await client.query(
                'SELECT id, name, tier, billing_period_days FROM subscription_plans WHERE id = $1 AND is_active = true',
                [planId]
            );

            if (planResult.rows.length === 0) {
                throw new Error('Invalid or inactive subscription plan');
            }

            const plan = planResult.rows[0];

            // Check for existing active subscription
            const existingResult = await client.query(
                `SELECT id, plan_id FROM user_subscriptions 
                 WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()`,
                [userId]
            );

            if (existingResult.rows.length > 0) {
                // Cancel existing subscription
                await client.query(
                    `UPDATE user_subscriptions 
                     SET status = 'cancelled', cancelled_at = NOW()
                     WHERE user_id = $1 AND status = 'active'`,
                    [userId]
                );
            }

            // Calculate end date
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + plan.billing_period_days);

            // Create new subscription
            await client.query(`
                INSERT INTO user_subscriptions (
                    user_id, plan_id, starts_at, ends_at, status, payment_reference
                )
                VALUES ($1, $2, NOW(), $3, 'active', $4)
            `, [userId, planId, endDate, paymentReference]);

            // Log audit event
            await client.query(`
                INSERT INTO audit_logs (
                    user_id, action, resource_type, resource_id, 
                    metadata
                )
                VALUES ($1, 'subscription_created', 'subscription', $2, $3)
            `, [
                userId, 
                planId,
                JSON.stringify({ 
                    planName: plan.name, 
                    tier: plan.tier,
                    paymentReference 
                })
            ]);

            return plan;
        });

        // Refresh materialized views (async - don't wait)
        query('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_features').catch(err => {
            console.error('[REFRESH MV] Error:', err);
        });

        return {
            success: true,
            message: 'Subscription created successfully',
            plan: {
                id: result.id,
                name: result.name,
                tier: result.tier
            }
        };

    } catch (error) {
        console.error('[USER SERVICE] Subscription creation failed:', error);
        throw error;
    }
}

/**
 * Check User Subscription Status
 * Returns subscription details and feature access
 */
export async function getUserSubscription(userId) {
    try {
        const result = await query(`
            SELECT 
                us.id,
                us.status,
                us.starts_at,
                us.ends_at,
                sp.name as plan_name,
                sp.tier,
                sp.price_monthly_cents,
                ARRAY_AGG(DISTINCT f.name) as features
            FROM user_subscriptions us
            JOIN subscription_plans sp ON us.plan_id = sp.id
            LEFT JOIN plan_features pf ON sp.id = pf.plan_id
            LEFT JOIN features f ON pf.feature_id = f.id AND f.is_active = true
            WHERE us.user_id = $1 AND us.status = 'active' AND us.ends_at > NOW()
            GROUP BY us.id, us.status, us.starts_at, us.ends_at, sp.name, sp.tier, sp.price_monthly_cents
        `, [userId]);

        if (result.rows.length === 0) {
            return {
                subscribed: false,
                plan: 'Free',
                tier: 1,
                features: []
            };
        }

        const subscription = result.rows[0];
        
        return {
            subscribed: true,
            plan: subscription.plan_name,
            tier: subscription.tier,
            features: subscription.features || [],
            status: subscription.status,
            endsAt: subscription.ends_at
        };

    } catch (error) {
        console.error('[USER SERVICE] Subscription check failed:', error);
        return { subscribed: false, error: error.message };
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

export default {
    registerUser,
    loginUser,
    createSubscription,
    getUserSubscription
};

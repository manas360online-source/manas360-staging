/**
 * ═══════════════════════════════════════════════════════════════
 * USER SERVICE - PRODUCTION SAAS IMPLEMENTATION
 * Handles user registration, authentication, and subscription logic
 * ═══════════════════════════════════════════════════════════════
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { generateAccessToken, generateRefreshToken, storeRefreshToken } from '../middleware/authMiddleware.js';
import { logAuditEvent } from './auditService.js';

const BCRYPT_ROUNDS = 10;

/**
 * SECURE USER REGISTRATION
 * Core logic for new user signup
 */
export async function registerUser({
    email,
    password,
    firstName = '',
    lastName = '',
    phoneNumber = null,
    language = 'en'
}, ipAddress, userAgent) {
    
    try {
        // 1. Validate input
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }

        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        // 2. Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM user_accounts WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('Email already registered');
        }

        // 3. Hash password with bcrypt
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // 4. Get default 'guest' role
        const roleResult = await pool.query(
            'SELECT id FROM roles WHERE name = $1',
            ['guest']
        );
        const roleId = roleResult.rows[0].id;

        // 5. Create user account in transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Insert user
            const insertQuery = `
                INSERT INTO user_accounts (
                    email, password_hash, first_name, last_name,
                    phone_number, role_id, language
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, email, created_at
            `;

            const userResult = await client.query(insertQuery, [
                email, passwordHash, firstName, lastName, phoneNumber, roleId, language
            ]);

            const user = userResult.rows[0];

            // Assign free subscription plan
            const freeplanResult = await client.query(
                'SELECT id FROM subscription_plans WHERE tier = $1',
                [1] // Free tier
            );

            const planId = freeplanResult.rows[0].id;

            // Create subscription for free plan
            await client.query(`
                INSERT INTO user_subscriptions (
                    user_id, plan_id, starts_at, ends_at, status
                )
                VALUES ($1, $2, NOW(), NOW() + INTERVAL '100 years', 'active')
            `, [user.id, planId]);

            // Log audit event
            await logAuditEvent(client, {
                userId: user.id,
                action: 'user_registered',
                resourceType: 'user_account',
                resourceId: user.id,
                ipAddress,
                userAgent
            });

            await client.query('COMMIT');

            // Generate tokens
            const tokens = await generateAccessToken({ id: user.id, email: user.email });
            await storeRefreshToken(user.id, tokens.refreshToken, ipAddress);

            return {
                success: true,
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName,
                    lastName
                },
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

/**
 * LOGIN USER - Verify credentials and return tokens
 */
export async function loginUser(email, password, ipAddress, userAgent) {
    try {
        // 1. Find user
        const userResult = await pool.query(
            'SELECT id, email, password_hash, role_id FROM user_accounts WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );

        if (userResult.rows.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = userResult.rows[0];

        // 2. Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            // Log failed login attempt
            await logAuditEvent({
                userId: user.id,
                action: 'login_failed',
                resourceType: 'auth',
                ipAddress,
                userAgent
            });

            throw new Error('Invalid credentials');
        }

        // 3. Check if user subscription is active
        const subscriptionResult = await pool.query(
            `SELECT id, plan_id, status FROM user_subscriptions 
             WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()`,
            [user.id]
        );

        if (subscriptionResult.rows.length === 0) {
            throw new Error('No active subscription found');
        }

        // 4. Generate tokens
        const tokens = await generateAccessToken({
            id: user.id,
            email: user.email,
            roleId: user.role_id
        });

        // 5. Store refresh token
        await storeRefreshToken(user.id, tokens.refreshToken, ipAddress);

        // 6. Log successful login
        await logAuditEvent({
            userId: user.id,
            action: 'login_success',
            resourceType: 'auth',
            ipAddress,
            userAgent
        });

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };

    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

/**
 * CHECK USER SUBSCRIPTION STATUS
 */
export async function isUserSubscribed(userId, featureName = null) {
    try {
        // Check if user has active subscription
        const subscriptionResult = await pool.query(
            `SELECT us.id, us.plan_id, us.status, sp.tier
             FROM user_subscriptions us
             JOIN subscription_plans sp ON us.plan_id = sp.id
             WHERE us.user_id = $1 AND us.status = 'active' AND us.ends_at > NOW()`,
            [userId]
        );

        if (subscriptionResult.rows.length === 0) {
            return { subscribed: false, tier: 0 };
        }

        const subscription = subscriptionResult.rows[0];

        // If feature check is requested
        if (featureName) {
            const featureResult = await pool.query(
                `SELECT pf.id FROM plan_features pf
                 JOIN features f ON pf.feature_id = f.id
                 WHERE pf.plan_id = $1 AND f.name = $2`,
                [subscription.plan_id, featureName]
            );

            return {
                subscribed: true,
                tier: subscription.tier,
                hasFeature: featureResult.rows.length > 0
            };
        }

        return {
            subscribed: true,
            tier: subscription.tier
        };

    } catch (error) {
        console.error('Subscription check failed:', error);
        return { subscribed: false, error: error.message };
    }
}

/**
 * CREATE OR UPGRADE SUBSCRIPTION
 */
export async function createSubscription(userId, planId, paymentReference = null) {
    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Fetch plan details
            const planResult = await client.query(
                'SELECT id, name, tier, billing_cycle_days FROM subscription_plans WHERE id = $1',
                [planId]
            );

            if (planResult.rows.length === 0) {
                throw new Error('Plan not found');
            }

            const plan = planResult.rows[0];

            // Check for existing active subscription
            const existingResult = await client.query(
                `SELECT id, status FROM user_subscriptions 
                 WHERE user_id = $1 AND status = 'active'`,
                [userId]
            );

            if (existingResult.rows.length > 0) {
                // Upgrade existing subscription
                await client.query(
                    `UPDATE user_subscriptions 
                     SET plan_id = $1, upgraded_at = NOW(), payment_reference = $2
                     WHERE user_id = $3 AND status = 'active'`,
                    [planId, paymentReference, userId]
                );
            } else {
                // Create new subscription
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + plan.billing_cycle_days);

                await client.query(
                    `INSERT INTO user_subscriptions 
                     (user_id, plan_id, starts_at, ends_at, status, payment_reference)
                     VALUES ($1, $2, NOW(), $3, 'active', $4)`,
                    [userId, planId, endDate, paymentReference]
                );
            }

            // Log subscription event
            await logAuditEvent(client, {
                userId,
                action: 'subscription_created',
                resourceType: 'subscription',
                resourceId: planId
            });

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Subscription created successfully',
                plan: {
                    id: plan.id,
                    name: plan.name,
                    tier: plan.tier
                }
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Subscription creation failed:', error);
        throw error;
    }
}

export default {
    registerUser,
    loginUser,
    isUserSubscribed,
    createSubscription
};

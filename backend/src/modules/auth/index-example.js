// ================================================================
// Auth Module - Main Entry Point
// ================================================================
// Exports router with all authentication endpoints
// Public routes (no authentication required)
// ================================================================

import express from 'express';
import * as controllers from './controllers.js';
import { validateInput } from '../../middlewares/validateInput.js';

const router = express.Router();

/**
 * POST /api/v1/auth/send-otp
 * Send OTP via WhatsApp
 * Body: { phoneNumber: string }
 */
router.post('/send-otp', validateInput((req) => {
  if (!req.body.phoneNumber || req.body.phoneNumber.length < 10) {
    throw new Error('Invalid phone number');
  }
}), controllers.sendOTP);

/**
 * POST /api/v1/auth/verify-otp
 * Verify OTP and return JWT tokens
 * Body: { phoneNumber: string, otp: string }
 */
router.post('/verify-otp', validateInput((req) => {
  if (!req.body.phoneNumber || !req.body.otp) {
    throw new Error('Phone number and OTP required');
  }
}), controllers.verifyOTP);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken: string }
 */
router.post('/refresh', validateInput((req) => {
  if (!req.body.refreshToken) {
    throw new Error('Refresh token required');
  }
}), controllers.refreshAccessToken);

/**
 * POST /api/v1/auth/logout
 * Logout user
 * Headers: Authorization: Bearer <token>
 */
router.post('/logout', controllers.logout);

export default router;

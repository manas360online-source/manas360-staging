import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { sendWhatsAppOTP, checkWhatsAppNumber } from '../config/heyoo.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err);
});

/**
 * Generate 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate JWT token
 */
function generateToken(userId, userType) {
  return jwt.sign({ userId, userType }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

/**
 * STEP 1: Send OTP via WhatsApp
 * POST /api/auth/send-otp
 */
export async function sendOTPController(req, res) {
  try {
    const { phoneNumber, countryCode = '+91', language = 'en' } = req.body;

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Format phone number (E.164)
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    // Rate limiting: Check if OTP was sent recently (within 1 minute)
    const recentOTP = await pool.query(
      `SELECT * FROM otp_verifications 
             WHERE phone_number = $1 
             AND created_at > NOW() - INTERVAL '1 minute'
             ORDER BY created_at DESC
             LIMIT 1`,
      [fullPhoneNumber]
    );

    if (recentOTP.rows.length > 0) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting another OTP'
      });
    }

    // Optional: Check if number is on WhatsApp
    const whatsappCheck = await checkWhatsAppNumber(fullPhoneNumber);
    if (!whatsappCheck.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid WhatsApp number. Please ensure you have WhatsApp installed.'
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await pool.query(
      `INSERT INTO otp_verifications 
             (phone_number, otp_code, otp_hash, expires_at)
             VALUES ($1, $2, $3, $4)`,
      [fullPhoneNumber, otpCode, otpHash, expiresAt]
    );

    // Send OTP via WhatsApp (Heyoo)
    const result = await sendWhatsAppOTP(fullPhoneNumber, otpCode, language);

    if (!result.success) {
      console.error('WhatsApp OTP send failed:', result.error);

      // Return appropriate error message
      let errorMessage = 'Failed to send OTP via WhatsApp. Please try again.';

      if (result.errorCode === 'RATE_LIMIT') {
        errorMessage = 'Too many requests. Please try again in a few minutes.';
      } else if (result.errorCode === 'INVALID_PHONE_NUMBER') {
        errorMessage = 'Invalid WhatsApp number. Please check and try again.';
      }

      return res.status(500).json({
        success: false,
        message: errorMessage
      });
    }

    // Log successful OTP send
    console.log(
      `WhatsApp OTP sent to ${fullPhoneNumber}, messageId: ${result.messageId}`
    );

    // For development: Return OTP (REMOVE IN PRODUCTION!)
    const responseData = {
      success: true,
      message: `OTP sent to your WhatsApp (+${phoneNumber})`,
      method: 'whatsapp',
      expiresIn: 300, // 5 minutes in seconds
      messageId: result.messageId
    };

    if (process.env.NODE_ENV === 'development') {
      responseData.otp = otpCode; // ONLY FOR TESTING!
      responseData._dev_note = 'OTP shown only in development mode';
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
}

/**
 * STEP 2: Verify OTP and login
 * (Same as before - no changes needed)
 */
export async function verifyOTPController(req, res) {
  try {
    const { phoneNumber, countryCode = '+91', otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    // Fetch latest OTP for this phone number
    const otpRecord = await pool.query(
      `SELECT * FROM otp_verifications 
             WHERE phone_number = $1 
             AND is_verified = FALSE
             AND expires_at > NOW()
             ORDER BY created_at DESC
             LIMIT 1`,
      [fullPhoneNumber]
    );

    if (otpRecord.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or invalid. Please request a new OTP.'
      });
    }

    const otpData = otpRecord.rows[0];

    // Check max attempts
    if (otpData.attempts >= otpData.max_attempts) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, otpData.otp_hash);

    if (!isValidOTP) {
      // Increment attempts
      await pool.query(
        `UPDATE otp_verifications 
                 SET attempts = attempts + 1 
                 WHERE id = $1`,
        [otpData.id]
      );

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${otpData.max_attempts - otpData.attempts - 1} attempts remaining.`
      });
    }

    // Mark OTP as verified
    await pool.query(
      `UPDATE otp_verifications 
             SET is_verified = TRUE 
             WHERE id = $1`,
      [otpData.id]
    );

    // Check if user exists
    const userResult = await pool.query(
      `SELECT * FROM users WHERE phone_number = $1 AND is_active = TRUE`,
      [fullPhoneNumber]
    );

    if (userResult.rows.length === 0) {
      // User doesn't exist - they need to sign up first
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please sign up first.',
        action: 'signup_required',
        phoneNumber: fullPhoneNumber
      });
    }

    const user = userResult.rows[0];

    // Update last login time
    await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [
      user.id
    ]);

    // Generate JWT token
    const token = generateToken(user.id, user.user_type);

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d'
    });

    // Create session
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      `INSERT INTO user_sessions 
             (user_id, session_token, refresh_token, device_info, expires_at)
             VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        token,
        refreshToken,
        JSON.stringify({
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          loginMethod: 'whatsapp_otp'
        }),
        sessionExpiresAt
      ]
    );

    // Return success with user data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          phoneNumber: user.phone_number,
          fullName: user.full_name,
          email: user.email,
          userType: user.user_type,
          profileCompleted: user.profile_completed,
          isVerified: user.is_verified
        },
        redirectTo: getRedirectURL(user.user_type)
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
}

/**
 * Get redirect URL based on user type
 */
function getRedirectURL(userType) {
  const redirectMap = {
    patient: '/patient/dashboard',
    psychologist: '/therapist/dashboard',
    psychiatrist: '/therapist/dashboard',
    nlp_coach: '/coach/dashboard',
    corporate_admin: '/corporate/dashboard',
    education_admin: '/education/dashboard'
  };

  return redirectMap[userType] || '/dashboard';
}

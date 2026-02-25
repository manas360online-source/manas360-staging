import axios from 'axios';

// Heyoo Configuration
const HEYOO_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.HEYOO_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.HEYOO_WHATSAPP_TOKEN;

/**
 * Send WhatsApp OTP via Heyoo
 * @param {string} phoneNumber - E.164 format (+919876543210)
 * @param {string} otpCode - 6-digit OTP
 * @param {string} language - 'en', 'hi', 'kn', 'te', 'ta'
 */
export async function sendWhatsAppOTP(phoneNumber, otpCode, language = 'en') {
  try {
    // Template names by language
    const templateNames = {
      en: 'manas360_otp_verification',
      hi: 'manas360_otp_hindi',
      kn: 'manas360_otp_kannada',
      te: 'manas360_otp_telugu',
      ta: 'manas360_otp_tamil'
    };

    const templateName = templateNames[language] || templateNames.en;

    // Heyoo API endpoint
    const url = `${HEYOO_API_URL}/${PHONE_NUMBER_ID}/messages`;

    // Message payload
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'en'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: otpCode
              }
            ]
          }
        ]
      }
    };

    // Send request to Heyoo API
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`WhatsApp OTP sent to ${phoneNumber}:`, response.data);

    return {
      success: true,
      messageId: response.data.messages[0].id,
      phone: phoneNumber
    };
  } catch (error) {
    console.error('Heyoo WhatsApp error:', error.response?.data || error.message);

    // Parse error
    const errorMessage =
      error.response?.data?.error?.message || 'Failed to send WhatsApp message';
    const errorCode = error.response?.data?.error?.code || 'UNKNOWN';

    return {
      success: false,
      error: errorMessage,
      errorCode
    };
  }
}

/**
 * Send WhatsApp message (non-template)
 * Note: Only works for users who have messaged you first
 */
export async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const url = `${HEYOO_API_URL}/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      messageId: response.data.messages[0].id
    };
  } catch (error) {
    console.error('WhatsApp message error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to send message'
    };
  }
}

/**
 * Verify Heyoo webhook signature
 * For receiving messages from users (future feature)
 */
export function verifyWebhookSignature(req, res, next) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.HEYOO_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  return res.status(403).send('Forbidden');
}

/**
 * Check WhatsApp number validity
 * Optional: Verify phone number exists on WhatsApp before sending OTP
 */
export async function checkWhatsAppNumber(phoneNumber) {
  try {
    // Note: This is a placeholder - WhatsApp doesn't provide number validation API
    // You can implement your own logic or use third-party services

    // For now, assume all Indian numbers are valid
    if (phoneNumber.startsWith('+91') && phoneNumber.length === 13) {
      return { valid: true };
    }

    return { valid: false, error: 'Invalid phone number format' };
  } catch (error) {
    console.error('WhatsApp number check error:', error);
    return { valid: false, error: error.message };
  }
}

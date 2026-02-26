import { validateTimestamp, verifyWebhookSignature } from '../../backend/src/utils/webhookSignature.js';

export async function verifyPaymentWebhook(req, res, next) {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;

  const tsCheck = validateTimestamp(timestamp);
  if (!tsCheck.valid) {
    return res.status(401).json({ success: false, message: 'Invalid webhook timestamp' });
  }

  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString('utf8')
    : JSON.stringify(req.body || {});

  const sigCheck = verifyWebhookSignature({
    rawBody,
    timestamp,
    signature,
    secret
  });

  if (!sigCheck.valid) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }

  return next();
}

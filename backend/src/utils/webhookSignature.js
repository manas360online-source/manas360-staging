import crypto from 'crypto';

const MAX_DRIFT_MS = 5 * 60 * 1000;

export function validateTimestamp(timestampHeader) {
  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) {
    return { valid: false, reason: 'invalid_timestamp' };
  }

  const now = Date.now();
  const drift = Math.abs(now - timestamp);
  if (drift > MAX_DRIFT_MS) {
    return { valid: false, reason: 'timestamp_out_of_window' };
  }

  return { valid: true };
}

export function computeWebhookSignature({ rawBody, timestamp, secret }) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');
}

export function verifyWebhookSignature({ rawBody, timestamp, signature, secret }) {
  if (!rawBody || !timestamp || !signature || !secret) {
    return { valid: false, reason: 'missing_signature_fields' };
  }

  const normalizedSignature = String(signature).replace(/^sha256=/, '');
  const expected = computeWebhookSignature({ rawBody, timestamp, secret });

  const sigBuffer = Buffer.from(normalizedSignature, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');

  if (sigBuffer.length !== expectedBuffer.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }

  const valid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  return { valid, reason: valid ? null : 'signature_mismatch' };
}

export default {
  validateTimestamp,
  computeWebhookSignature,
  verifyWebhookSignature
};

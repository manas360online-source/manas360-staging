import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

function hotp(secret, counter) {
  const buffer = Buffer.alloc(8);
  for (let index = 7; index >= 0; index -= 1) {
    buffer[index] = counter & 0xff;
    counter >>= 8;
  }

  const hmac = crypto.createHmac('sha1', secret).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff);

  return String(binary % 1000000).padStart(6, '0');
}

function parseSetCookies(setCookies = []) {
  const jar = {};
  for (const cookie of setCookies) {
    const first = cookie.split(';')[0];
    const idx = first.indexOf('=');
    if (idx > 0) {
      jar[first.slice(0, idx)] = first.slice(idx + 1);
    }
  }
  return jar;
}

function toCookieHeader(jar) {
  return Object.entries(jar)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

function getSetCookies(response) {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }

  const setCookie = response.headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

async function run() {
  const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5001';
  const email = process.env.SMOKE_ADMIN_EMAIL || 'admin@manas360.com';
  const otp = process.env.SMOKE_PRIMARY_OTP || '123456';
  const mfaBaseSecret = process.env.ADMIN_MFA_SECRET || process.env.JWT_SECRET;

  const results = { baseUrl, email };

  if (!mfaBaseSecret) {
    console.log(JSON.stringify({ ok: false, error: 'Missing ADMIN_MFA_SECRET/JWT_SECRET in env' }, null, 2));
    process.exit(1);
  }

  const loginInitResponse = await fetch(`${baseUrl}/api/v1/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const loginInitBody = await loginInitResponse.json().catch(() => ({}));
  results.adminLoginInitiateStatus = loginInitResponse.status;

  if (loginInitResponse.status !== 200 || !loginInitBody?.mfaToken) {
    results.ok = false;
    results.failure = 'admin_login_initiate_failed';
    results.body = loginInitBody;
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }

  const step = Math.floor(Date.now() / 1000 / 30);
  const mfaSecret = `${mfaBaseSecret}:${email}`;
  const mfaCode = hotp(mfaSecret, step);

  const loginVerifyResponse = await fetch(`${baseUrl}/api/v1/auth/admin-login/verify-mfa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaToken: loginInitBody.mfaToken, mfaCode })
  });
  const loginVerifyBody = await loginVerifyResponse.json().catch(() => ({}));
  const cookieJar = parseSetCookies(getSetCookies(loginVerifyResponse));

  results.adminLoginVerifyMfaStatus = loginVerifyResponse.status;
  results.cookiesIssued = Object.keys(cookieJar);

  if (
    loginVerifyResponse.status !== 200
    || !cookieJar.access_token
    || !cookieJar.refresh_token
    || !cookieJar.csrf_token
  ) {
    results.ok = false;
    results.failure = 'admin_mfa_verify_failed';
    results.body = loginVerifyBody;
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }

  const adminUsersResponse = await fetch(`${baseUrl}/api/v1/admin/users`, {
    headers: { Cookie: toCookieHeader(cookieJar) }
  });
  results.adminUsersStatus = adminUsersResponse.status;

  const refreshResponse = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': cookieJar.csrf_token,
      Cookie: toCookieHeader(cookieJar)
    },
    body: JSON.stringify({ refreshToken: cookieJar.refresh_token })
  });
  const refreshedJar = {
    ...cookieJar,
    ...parseSetCookies(getSetCookies(refreshResponse))
  };
  results.refreshFirstStatus = refreshResponse.status;

  const replayResponse = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': refreshedJar.csrf_token,
      Cookie: toCookieHeader(refreshedJar)
    },
    body: JSON.stringify({ refreshToken: cookieJar.refresh_token })
  });
  const replayBody = await replayResponse.json().catch(() => ({}));
  results.refreshReplayOldStatus = replayResponse.status;
  results.refreshReplayOldMessage = replayBody?.message;

  const logoutResponse = await fetch(`${baseUrl}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': refreshedJar.csrf_token,
      Cookie: toCookieHeader(refreshedJar)
    }
  });
  results.logoutStatus = logoutResponse.status;

  const refreshAfterLogoutResponse = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': refreshedJar.csrf_token,
      Cookie: toCookieHeader(refreshedJar)
    },
    body: JSON.stringify({ refreshToken: refreshedJar.refresh_token })
  });
  const refreshAfterLogoutBody = await refreshAfterLogoutResponse.json().catch(() => ({}));
  results.refreshAfterLogoutStatus = refreshAfterLogoutResponse.status;
  results.refreshAfterLogoutMessage = refreshAfterLogoutBody?.message;

  const forgedWebhookResponse = await fetch(`${baseUrl}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchantTransactionId: 'txn_forged', status: 'success' })
  });
  results.webhookForgedStatus = forgedWebhookResponse.status;

  results.ok = (
    results.adminLoginInitiateStatus === 200
    && results.adminLoginVerifyMfaStatus === 200
    && results.adminUsersStatus === 200
    && results.refreshFirstStatus === 200
    && results.refreshReplayOldStatus === 401
    && results.logoutStatus === 200
    && results.refreshAfterLogoutStatus === 401
    && results.webhookForgedStatus === 401
  );

  console.log(JSON.stringify(results, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

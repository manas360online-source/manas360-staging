# External APIs and Services Configuration Guide

## Overview
This document lists all external APIs, services, and integrations used in the MANAS360 platform, along with setup instructions and where to obtain API keys.

---

## 🤖 AI/ML Services

### Google Gemini AI
**Purpose**: Powers the Meera AI Chatbot for mental health conversations

**Setup**:
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

**Used In**: `frontend/apps/meera-ai-chatbot/`

---

### OpenAI API (Optional)
**Purpose**: Alternative AI service for chatbot or text generation

**Setup**:
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

**Pricing**: Pay-per-use (GPT-4, GPT-3.5)

---

### Anthropic Claude (Optional)
**Purpose**: Advanced AI conversations

**Setup**:
1. Visit: https://console.anthropic.com/
2. Generate API key
3. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

---

### HuggingFace (Optional)
**Purpose**: Open-source ML models

**Setup**:
1. Visit: https://huggingface.co/settings/tokens
2. Create access token
3. Add to `.env.local`: `HUGGINGFACE_API_KEY=hf_...`

---

## 💬 Messaging & Communication

### WhatsApp Business API (Heyoo)
**Purpose**: Send OTP and notifications via WhatsApp

**Setup**:
1. Create WhatsApp Business account: https://business.whatsapp.com/
2. Get API access through Meta Business Suite
3. Use Heyoo library for simplified API access
4. Add to `.env.local`:
   ```
   HEYOO_WHATSAPP_TOKEN=your_permanent_token
   HEYOO_PHONE_NUMBER_ID=your_phone_id
   HEYOO_WEBHOOK_VERIFY_TOKEN=your_verify_token
   ```

**Documentation**: https://developers.facebook.com/docs/whatsapp/cloud-api
**Used In**: `backend/src/config/heyoo.js`

---

### Twilio (Optional)
**Purpose**: SMS, Voice, WhatsApp alternative

**Setup**:
1. Visit: https://www.twilio.com/console
2. Get Account SID and Auth Token
3. Get phone number
4. Add to `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Pricing**: Pay-as-you-go

---

## 💳 Payment Gateways

### PhonePe (Primary - India)
**Purpose**: Primary payment gateway for Indian users

**Setup**:
1. Visit: https://www.phonepe.com/business-solutions/payment-gateway/
2. Create merchant account
3. Get Merchant ID, Salt Key, Salt Index
4. Test with sandbox credentials (already in .env)
5. Production credentials in `.env.local`:
   ```
   PHONEPE_MERCHANT_ID=YOURMERCHANTID
   PHONEPE_SALT_KEY=your_salt_key_here
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=PRODUCTION
   ```

**Documentation**: https://developer.phonepe.com/
**Used In**: `backend/payment-gateway/`

---

### Stripe (Global)
**Purpose**: International payments

**Setup**:
1. Visit: https://dashboard.stripe.com/
2. Get API keys (Test & Live)
3. Add to `.env.local`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

**Documentation**: https://stripe.com/docs/api

---

### Razorpay (India)
**Purpose**: Alternative payment gateway for India

**Setup**:
1. Visit: https://dashboard.razorpay.com/
2. Get Key ID and Secret
3. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

**Documentation**: https://razorpay.com/docs/api/

---

### PayPal
**Purpose**: PayPal payments

**Setup**:
1. Visit: https://developer.paypal.com/
2. Create app and get credentials
3. Add to `.env.local`:
   ```
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   PAYPAL_MODE=sandbox
   ```

---

## 📧 Email Services

### SMTP (Gmail/Generic)
**Purpose**: Send emails (notifications, verification)

**Setup for Gmail**:
1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   ```

---

### SendGrid (Recommended for Production)
**Purpose**: Reliable email delivery service

**Setup**:
1. Visit: https://sendgrid.com/
2. Create API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@manas360.com
   ```

**Free Tier**: 100 emails/day

---

## 🎥 Video Conferencing

### Jitsi Meet (Free)
**Purpose**: Video sessions between patients and therapists

**Setup**:
1. Use public Jitsi server: `meet.jit.si` (no API key needed)
2. Or self-host: https://jitsi.github.io/handbook/docs/devops-guide/
3. Add to `.env.local`:
   ```
   JITSI_DOMAIN=meet.jit.si
   JITSI_APP_ID=your_app_id (if using custom domain)
   ```

**Used In**: `frontend/apps/single-meeting-jitsi/`, `frontend/apps/group-sessions/`

---

### Zoom (Optional)
**Purpose**: Alternative video conferencing

**Setup**:
1. Visit: https://marketplace.zoom.us/
2. Create Server-to-Server OAuth app
3. Add to `.env.local`:
   ```
   ZOOM_API_KEY=...
   ZOOM_API_SECRET=...
   ```

**Pricing**: Free for basic, Pro for advanced features

---

### Agora (Optional)
**Purpose**: Low-latency video streaming

**Setup**:
1. Visit: https://console.agora.io/
2. Create project
3. Add to `.env.local`:
   ```
   AGORA_APP_ID=...
   AGORA_APP_CERTIFICATE=...
   ```

---

### VideoSDK (Optional)
**Purpose**: Video SDK for custom implementation

**Setup**:
1. Visit: https://www.videosdk.live/
2. Get API keys
3. Add to `.env.local`:
   ```
   VIDEOSDK_API_KEY=...
   VIDEOSDK_SECRET_KEY=...
   ```

---

## ☁️ Cloud Storage

### AWS S3
**Purpose**: Store user uploads (images, documents, videos)

**Setup**:
1. Visit: https://console.aws.amazon.com/s3/
2. Create S3 bucket
3. Create IAM user with S3 access
4. Add to `.env.local`:
   ```
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtn...
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=manas360-uploads
   ```

**Pricing**: Free tier 5GB for 12 months

---

### Cloudinary (Easier Alternative)
**Purpose**: Image/video hosting and transformations

**Setup**:
1. Visit: https://cloudinary.com/
2. Create account (free tier available)
3. Get credentials from dashboard
4. Add to `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

**Free Tier**: 25GB storage, 25GB bandwidth/month

---

## 🔐 OAuth / Social Login

### Google OAuth
**Purpose**: Login with Google

**Setup**:
1. Visit: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI
4. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

---

### Facebook Login
**Purpose**: Login with Facebook

**Setup**:
1. Visit: https://developers.facebook.com/apps/
2. Create app with Facebook Login
3. Add to `.env.local`:
   ```
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   ```

---

## 📊 Analytics & Monitoring

### Google Analytics
**Purpose**: Track user behavior and page views

**Setup**:
1. Visit: https://analytics.google.com/
2. Create property
3. Add to `.env.local`:
   ```
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

**Implementation**: Add script to `index.html`

---

### Sentry
**Purpose**: Error tracking and monitoring

**Setup**:
1. Visit: https://sentry.io/
2. Create project
3. Add to `.env.local`:
   ```
   SENTRY_DSN=https://...@sentry.io/...
   SENTRY_ENVIRONMENT=production
   ```

**Free Tier**: 5,000 errors/month

---

### Mixpanel
**Purpose**: Product analytics

**Setup**:
1. Visit: https://mixpanel.com/
2. Create project
3. Add to `.env.local`:
   ```
   MIXPANEL_TOKEN=...
   ```

---

### Hotjar
**Purpose**: Heatmaps and user recordings

**Setup**:
1. Visit: https://www.hotjar.com/
2. Add site
3. Add to `.env.local`:
   ```
   HOTJAR_ID=...
   ```

---

## 🔔 Push Notifications

### Firebase Cloud Messaging (FCM)
**Purpose**: Web and mobile push notifications

**Setup**:
1. Visit: https://console.firebase.google.com/
2. Create project
3. Enable Cloud Messaging
4. Get Server Key and Sender ID
5. Add to `.env.local`:
   ```
   FCM_SERVER_KEY=...
   FCM_SENDER_ID=...
   ```

---

### OneSignal (Easier Alternative)
**Purpose**: Push notifications (easier than FCM)

**Setup**:
1. Visit: https://onesignal.com/
2. Create app
3. Add to `.env.local`:
   ```
   ONESIGNAL_APP_ID=...
   ONESIGNAL_API_KEY=...
   ```

**Free Tier**: Unlimited notifications

---

## 🗺️ Maps & Location

### Google Maps API
**Purpose**: Location search, maps display

**Setup**:
1. Visit: https://console.cloud.google.com/google/maps-apis/
2. Enable Maps JavaScript API
3. Create API key with restrictions
4. Add to `.env.local`:
   ```
   GOOGLE_MAPS_API_KEY=AIza...
   ```

**Free Tier**: $200 credit/month

---

### Mapbox (Alternative)
**Purpose**: Custom maps and geocoding

**Setup**:
1. Visit: https://www.mapbox.com/
2. Get access token
3. Add to `.env.local`:
   ```
   MAPBOX_ACCESS_TOKEN=pk.ey...
   ```

---

## 🗄️ Database & Cache

### PostgreSQL
**Purpose**: Primary database

**Setup**:
1. Install locally: `brew install postgresql@14` (macOS)
2. Or use cloud: https://www.elephantsql.com/ (free tier)
3. Add to `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/manas360
   ```

---

### Redis
**Purpose**: Session storage and caching

**Setup**:
1. Install locally: `brew install redis` (macOS)
2. Or use cloud: https://redis.io/try-free/ (free tier)
3. Add to `.env.local`:
   ```
   REDIS_URL=redis://localhost:6379
   ```

---

## 🔗 External APIs

### QR Code API
**Purpose**: Generate QR codes

**Service**: https://api.qrserver.com/ (free, no API key needed)

**Already Configured**: No setup needed

---

## 📋 Quick Setup Checklist

### Minimum Required (Core Features)
- [x] PostgreSQL database
- [x] JWT_SECRET (generate random 32+ chars)
- [ ] GEMINI_API_KEY (for AI chatbot)
- [ ] HEYOO_WHATSAPP_TOKEN (for OTP)
- [ ] PHONEPE credentials (for payments)

### Recommended for Production
- [ ] SMTP or SendGrid (email)
- [ ] AWS S3 or Cloudinary (file storage)
- [ ] Redis (caching)
- [ ] Sentry (error tracking)
- [ ] Google Analytics (analytics)

### Optional Enhancements
- [ ] Stripe/Razorpay (alternate payments)
- [ ] Zoom/Agora (video conferencing)
- [ ] Google OAuth (social login)
- [ ] OneSignal (push notifications)
- [ ] Google Maps (location services)

---

## 🔒 Security Best Practices

1. **Never commit secrets**: Use `.env.local` for real credentials
2. **Rotate keys regularly**: Especially for production
3. **Use environment-specific keys**: Separate test/production
4. **Restrict API keys**: Enable IP restrictions where possible
5. **Monitor usage**: Set up alerts for unusual activity
6. **Use HTTPS**: Always in production
7. **Implement rate limiting**: Prevent API abuse

---

## 💰 Cost Estimates (Production)

| Service | Free Tier | Paid Starts At |
|---------|-----------|----------------|
| Google Gemini | Limited | ~$0.001/1K chars |
| SendGrid | 100 emails/day | $15/month |
| AWS S3 | 5GB/12mo | ~$0.023/GB |
| Cloudinary | 25GB | $89/month |
| PhonePe | Transaction fees | 1.99% + GST |
| Stripe | None | 2.9% + $0.30 |
| Twilio SMS | Trial credit | ~$0.0075/SMS |
| Sentry | 5K errors/mo | $26/month |
| Redis Cloud | 30MB | $5/month |

**Estimated Monthly Cost** (1000 active users): $50-200/month

---

## 📞 Support Resources

- **Documentation**: See individual service docs linked above
- **Community**: Stack Overflow, service-specific forums
- **Support**: Most services offer email/chat support

---

**Last Updated**: February 24, 2026  
**Maintained By**: MANAS360 Development Team

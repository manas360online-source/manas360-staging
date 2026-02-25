# Environment Variables Quick Reference

## 🚀 Quick Start

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual API keys.

---

## ✅ Minimum Configuration Required

To run the application locally with basic features:

```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/manas360

# JWT (generate a random 32+ character string)
JWT_SECRET=use_openssl_rand_-hex_32_to_generate
JWT_REFRESH_SECRET=another_random_32_char_string

# For development, these can be empty initially:
GEMINI_API_KEY=
HEYOO_WHATSAPP_TOKEN=
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
```

---

## 🔑 How to Generate Secrets

### JWT Secrets
```bash
# macOS/Linux
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Session Secret
```bash
openssl rand -base64 32
```

---

## 📋 Services by Feature

### AI Chatbot (Meera)
```env
GEMINI_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
```
**Get Key**: https://makersuite.google.com/app/apikey

---

### WhatsApp OTP
```env
HEYOO_WHATSAPP_TOKEN=your_token
HEYOO_PHONE_NUMBER_ID=your_phone_id
HEYOO_WEBHOOK_VERIFY_TOKEN=your_verify_token
```
**Setup**: https://developers.facebook.com/docs/whatsapp/cloud-api

---

### Payment Gateway
```env
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=PRODUCTION
```
**For Testing**: Use sandbox credentials (already in .env)

---

### Email Notifications
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```
**Gmail App Password**: https://myaccount.google.com/apppasswords

---

### File Upload (Optional)
```env
# Option 1: AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=manas360-uploads

# Option 2: Cloudinary (easier)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### Video Calls (Optional)
```env
# Use free Jitsi (no key needed)
JITSI_DOMAIN=meet.jit.si

# OR use Zoom
ZOOM_API_KEY=your_key
ZOOM_API_SECRET=your_secret
```

---

## 🔄 Environment-Specific Configuration

### Development (.env.local)
```env
NODE_ENV=development
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Production (.env.production)
```env
NODE_ENV=production
API_BASE_URL=https://api.manas360.com
FRONTEND_URL=https://manas360.com
```

---

## 🧪 Testing Configuration

For running tests without external services:

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/manas360_test
JWT_SECRET=test_secret_key_for_testing_only
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local` (already in .gitignore)
- [ ] Use different API keys for dev/staging/production
- [ ] Rotate secrets periodically
- [ ] Use strong, random JWT secrets (32+ chars)
- [ ] Enable API key restrictions where possible
- [ ] Set up CORS_ORIGIN to specific domains in production

---

## 📊 Service Priority

### Critical (App won't work without these)
1. DATABASE_URL
2. JWT_SECRET
3. JWT_REFRESH_SECRET

### High Priority (Core features)
4. GEMINI_API_KEY (AI Chatbot)
5. HEYOO_WHATSAPP_TOKEN (Authentication OTP)
6. PHONEPE credentials (Payments)

### Medium Priority (Enhanced features)
7. SMTP or SENDGRID (Email notifications)
8. AWS_S3 or CLOUDINARY (File uploads)
9. REDIS_URL (Caching/performance)

### Low Priority (Optional enhancements)
10. Google Analytics (Tracking)
11. Sentry (Error monitoring)
12. Social login (Google/Facebook OAuth)

---

## 🆘 Troubleshooting

### "Database connection failed"
```env
# Check DATABASE_URL format
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### "JWT malformed"
```env
# Ensure JWT_SECRET is set and minimum 32 chars
JWT_SECRET=$(openssl rand -hex 32)
```

### "CORS error"
```env
# Add your frontend URL to CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### "Payment webhook verification failed"
```env
# Ensure PHONEPE_SALT_KEY matches your merchant config
PHONEPE_SALT_KEY=your_actual_salt_key
```

---

## 📁 File Locations

- **Default values**: `.env` (committed to git)
- **Your secrets**: `.env.local` (never commit)
- **Example/template**: `.env.example` (committed to git)
- **Production**: `.env.production` (deploy to server)
- **Backend specific**: `backend/.env` (backend overrides)

---

## 🔗 Useful Links

- **API Keys Guide**: See `EXTERNAL_APIS_GUIDE.md`
- **Full Configuration**: See `.env.example`
- **Test Results**: See `INTEGRATION_TEST_REPORT.md`

---

## 💡 Tips

1. **Use `.env.local` for development** - Overrides `.env` values
2. **Test mode**: Most services have sandbox/test modes (use those first)
3. **Free tiers**: Many services offer generous free tiers (see EXTERNAL_APIS_GUIDE.md)
4. **Gradual setup**: Start with minimum config, add services as needed
5. **Documentation**: Each service has detailed setup docs (linked in EXTERNAL_APIS_GUIDE.md)

---

**Remember**: Never commit files with real API keys or passwords!

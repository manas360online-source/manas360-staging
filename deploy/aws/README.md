# AWS Deployment Readiness

## ⚠️ CRITICAL: Pre-Deployment Audit Requirements

**Status:** 🔴 **NOT PRODUCTION READY** (See [COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md](../../COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md))

### Blocking Issues (Must Fix Before Deployment):
- ❌ Security middleware missing (Helmet, CORS, rate limiting)
- ❌ N+1 database queries (will fail at 100K users)
- ❌ Connection pool misconfigured (max: 10, needs 50+)
- ❌ No permission caching (60M queries/day)
- ❌ Token generation bug (JWT payload malformed)
- ❌ No account lockout (brute force attacks)
- ❌ No graceful shutdown (data loss risk)
- ❌ No structured logging (cannot debug production)

### Required Actions Before AWS Deployment:

1. **Review Audit Report:**
   - Read [COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md](../../COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md)
   - Review [AUDIT_CRITICAL_FIXES.md](../../AUDIT_CRITICAL_FIXES.md)

2. **Phase 1: Security Hardening (1 week)**
   - Apply production-ready code files
   - Run `backend/migrations/database-optimization.sql`
   - Update environment variables
   - See: [AUDIT_CRITICAL_FIXES.md#phase-1-critical-security](../../AUDIT_CRITICAL_FIXES.md#phase-1-critical-security-week-1---must-complete-before-production)

3. **Phase 2: Database Optimization (1 week)**
   - Configure connection pool (min:20, max:50)
   - Create all indexes
   - Implement permission caching
   - See: [AUDIT_CRITICAL_FIXES.md#phase-2](../../AUDIT_CRITICAL_FIXES.md#phase-2-database-optimization-week-2-3---for-performance)

4. **Phase 3: Production Setup (1 week)**
   - Graceful shutdown implementation
   - Health check enhancement
   - Monitoring setup (CloudWatch)
   - See: [AUDIT_CRITICAL_FIXES.md#phase-3](../../AUDIT_CRITICAL_FIXES.md#phase-3-scalability-week-3---for-load-handling)

5. **Load Testing & Validation (1 week)**
   - Test 10K+ concurrent users
   - Security penetration testing
   - Performance benchmarking

---

This project is now structured with backend services under `backend/` and **will be ready for production container-based AWS deployment after completing audit fixes**.

## Service Ports
- Frontend: `3000`
- Unified Backend API: `5001`
- Payment Backend API: `5002`

## Updated Structure
- `backend/src` → core backend modules
- `backend/admin` → admin backend
- `backend/payment-gateway` → payment backend (merged from `integrations/payment-gateway/backend`)
- `frontend/main-app/components/payment-gateway` → integrated payment UI in main app

## Local Container Validation
From repo root:

```bash
npm run aws:compose:up
```

Or directly:

```bash
docker compose -f deploy/aws/docker-compose.aws.yml up --build
```

## AWS Target Options
- **ECS Fargate** (recommended): deploy the 3 services as separate tasks/services.
- **App Runner**: deploy each service independently from container images.
- **EKS**: convert compose to Kubernetes manifests if needed.

## Required Environment Variables
Set these in AWS Secrets Manager / Parameter Store and inject into services:
- `DATABASE_URL` - PostgreSQL connection
- `PAYMENT_DATABASE_URL` - Payment service database
- `JWT_SECRET` - Min 32 characters, highly random ⚠️
- `JWT_REFRESH_SECRET` - Min 32 characters, different from JWT_SECRET ⚠️
- `JWT_EXPIRY` - Token TTL (default: 24h)
- `JWT_REFRESH_EXPIRY` - Refresh TTL (default: 7d)
- `GEMINI_API_KEY` - For AI features
- `DB_POOL_MIN` - Min pool connections (recommended: 20)
- `DB_POOL_MAX` - Max pool connections (recommended: 50)
- `ALLOWED_ORIGINS` - CORS allowed domains
- `LOG_LEVEL` - info/debug/error
- `NODE_ENV` - production
- `REDIS_HOST` - Redis endpoint (for rate limiting)
- `REDIS_PORT` - Redis port (default: 6379)
- `INTERNAL_IP` - Internal IP for health checks (e.g., 127.0.0.1)

**⚠️ DO NOT deploy without updating these!** See [AUDIT_CRITICAL_FIXES.md](../../AUDIT_CRITICAL_FIXES.md)

## Pre-Deployment Checklist

### Application Readiness
- [ ] All Phase 1 security fixes implemented
- [ ] All Phase 2 database optimizations applied
- [ ] Production-ready code files deployed
- [ ] Database indexes created
- [ ] Connection pool configured (min:20, max:50)
- [ ] Permission caching in JWT working
- [ ] Rate limiting configured and tested
- [ ] Account lockout mechanism working
- [ ] Graceful shutdown implemented
- [ ] Structured logging configured

### AWS Infrastructure
- [ ] Security groups configured
- [ ] ALB/NLB with health checks
- [ ] RDS PostgreSQL with Multi-AZ
- [ ] ElastiCache Redis (for rate limiting)
- [ ] CloudWatch monitoring configured
- [ ] CloudWatch alarms set up
- [ ] Auto-scaling policies configured
- [ ] Secrets Manager with all keys
- [ ] VPC/subnet configuration
- [ ] IAM roles configured

### Deployment Strategy
- [ ] Staging environment tested first
- [ ] Load testing passed (10K+ users)
- [ ] Security scanning completed
- [ ] Backup/recovery plan documented
- [ ] Rollback plan documented
- [ ] On-call runbooks created
- [ ] Monitoring dashboards configured

## Post-Deployment Monitoring

After deployment, monitor these metrics:
- Database connection pool utilization
- Response times (target: <200ms)
- Error rates (target: <0.1%)
- CPU/memory usage per container
- Token generation/validation latency
- Authentication success/failure rates

See [COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md](../../COMPREHENSIVE_ENTERPRISE_AUDIT_REPORT.md) for complete guidance.

## Notes
- `backend` and `payment-backend` should share VPC/database access.
- Use ALB routing rules if exposing multiple backends publicly.
- For production frontend hosting, consider S3 + CloudFront for static assets.
- All environment variables must be set BEFORE deploying (see AWS Secrets Manager section).
- Production database must pass optimization script: `backend/migrations/database-optimization.sql`

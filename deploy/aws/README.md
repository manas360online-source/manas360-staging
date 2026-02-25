# AWS Deployment Readiness

This project is now structured with backend services under `backend/` and is ready for container-based AWS deployment.

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
- `DATABASE_URL`
- `PAYMENT_DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `GEMINI_API_KEY` (if used at runtime)

## Notes
- `backend` and `payment-backend` should share VPC/database access.
- Use ALB routing rules if exposing multiple backends publicly.
- For production frontend hosting, consider S3 + CloudFront for static assets.

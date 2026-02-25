# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Overview

This guide covers deploying the unified MANAS360 backend to production on AWS/cloud infrastructure.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code Quality

- [ ] All tests passing: `npm run test:all`
- [ ] No console.log statements (use logger instead)
- [ ] No hardcoded credentials
- [ ] No npm security vulnerabilities: `npm audit`
- [ ] ESLint passing: `npm run lint`
- [ ] Type checking passing (if TypeScript)

### Documentation

- [ ] README updated
- [ ] API documentation updated
- [ ] Architecture diagram included
- [ ] Deployment runbook created
- [ ] Rollback procedures documented

### Database

- [ ] All migrations tested locally
- [ ] Migration scripts backup created
- [ ] Database backup procedure defined
- [ ] Read replicas configured (if needed)

### Security

- [ ] All environment secrets prepared (no hardcoding)
- [ ] JWT secrets generated (use: `openssl rand -base64 32`)
- [ ] CORS origins restricted to production domain
- [ ] Helmet CSP configured appropriately
- [ ] Rate limiting tested
- [ ] HTTPS/TLS configured

### Monitoring

- [ ] CloudWatch/DataDog dashboards created
- [ ] Alerting configured for:
  - [ ] High error rate (> 5%)
  - [ ] High latency (> 1000ms)
  - [ ] Database connection pool exhaustion
  - [ ] Memory usage > 80%
- [ ] Log aggregation configured
- [ ] Performance baseline established

---

## 🐳 DOCKER DEPLOYMENT

### Build Image

```bash
# Build Docker image
docker build -t manas360-backend:latest -f backend/Dockerfile .

# Tag for registry
docker tag manas360-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/manas360-backend:latest

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/manas360-backend:latest
```

### Run Locally

```bash
# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Verify health
curl http://localhost:5000/health

# Stop
docker-compose down
```

---

## ☁️ AWS ECS DEPLOYMENT

### Create ECS Task Definition

```json
{
  "family": "manas360-backend",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/manas360-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:manas360/database-URL"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:manas360/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/manas360-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024"
}
```

### Create ECS Service

```bash
aws ecs create-service \
  --cluster manas360-prod \
  --service-name manas360-backend \
  --task-definition manas360-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED} \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=5000 \
  --enable-ecs-managed-tags \
  --tags key=Environment,value=production key=Service,value=manas360-backend
```

---

## 🔄 CONTINUOUS DEPLOYMENT (GitHub Actions)

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - 'package*.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: manas360-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f backend/Dockerfile .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster manas360-prod \
            --service manas360-backend \
            --force-new-deployment

      - name: Wait for service update
        run: |
          aws ecs wait services-stable \
            --cluster manas360-prod \
            --services manas360-backend
```

---

## 📊 MONITORING & ALERTING

### CloudWatch Dashboard

Create dashboard to monitor:

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          [".", "MemoryUtilization", {"stat": "Average"}],
          ["AWS/ApplicationELB", "TargetResponseTime", {"stat": "Average"}],
          [".", "HTTPCode_Target_5XX_Count", {"stat": "Sum"}],
          [".", "HTTPCode_Target_4XX_Count", {"stat": "Sum"}]
        ],
        "period": 60,
        "stat": "Average",
        "region": "us-east-1",
        "title": "Backend Health"
      }
    }
  ]
}
```

### CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name manas360-backend-high-errors \
  --alarm-description "Alert when error rate > 5%" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 25 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789:alerts

# High latency alarm
aws cloudwatch put-metric-alarm \
  --alarm-name manas360-backend-high-latency \
  --alarm-description "Alert when latency > 1000ms" \
  --metric-name TargetResponseTime \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789:alerts
```

---

## 🔍 HEALTH CHECKS & MONITORING

### Verify Deployment

```bash
# Check service status
aws ecs describe-services \
  --cluster manas360-prod \
  --services manas360-backend

# Check task health
aws ecs describe-tasks \
  --cluster manas360-prod \
  --tasks $(aws ecs list-tasks --cluster manas360-prod --service-name manas360-backend --query 'taskArns[0]' --output text)

# Check logs
aws logs tail /ecs/manas360-backend --follow

# Verify health endpoint
curl https://api.manas360.com/health
```

### Database Verification

```bash
# Check connection pool
curl https://api.manas360.com/health/db

# Response should show:
# {
#   "status": "ok",
#   "database": "connected",
#   "poolStats": {
#     "checked_out": 5,
#     "idle": 25,
#     "waiting": 0
#   }
# }
```

---

## 🔄 SCALING CONFIGURATION

### Auto-scaling Policy

```bash
# Target tracking scaling (recommended)
aws application-autoscaling put-scaling-policy \
  --policy-name manas360-target-tracking \
  --service-namespace ecs \
  --resource-id service/manas360-prod/manas360-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration 'TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization},ScaleOutCooldown=60,ScaleInCooldown=300'

# Set min/max tasks
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/manas360-prod/manas360-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10
```

---

## 🔐 SECRETS MANAGEMENT

### Store Secrets in AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name manas360/database-url \
  --secret-string "postgresql://user:pass@host:5432/db"

# Create JWT secrets
aws secretsmanager create-secret \
  --name manas360/jwt-secret \
  --secret-string "$(openssl rand -base64 32)"

aws secretsmanager create-secret \
  --name manas360/jwt-refresh-secret \
  --secret-string "$(openssl rand -base64 32)"

# Retrieve in code (auto-injected by ECS from task definition)
```

---

## 📈 PERFORMANCE TUNING

### Database Connection Pool

Recommended settings for production:

```env
DB_POOL_MAX=50          # Max connections (usually 2x expected concurrent users)
DB_POOL_MIN=10          # Min connections (warm pool)
DB_IDLE_TIMEOUT=30000   # Release idle connections after 30s
DB_CONNECTION_TIMEOUT=2000  # Fast fail on connection issues
DB_STATEMENT_TIMEOUT=60000  # Allow up to 1min for long queries
```

### Memory Settings

```bash
# Node.js heap size (if needed)
NODE_OPTIONS=--max-old-space-size=512 npm start
```

### Request Timeout

Application-level timeout: 30 seconds (in app.js)
Load balancer timeout: 60 seconds (ALB setting)

---

## 🚨 INCIDENT RESPONSE

### High Error Rate

```bash
# 1. Check logs
aws logs tail /ecs/manas360-backend --since 5m

# 2. Check metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --start-time 2026-02-25T12:00:00Z \
  --end-time 2026-02-25T12:30:00Z \
  --period 300 \
  --statistics Sum

# 3. Roll back if needed
git revert <commit>
git push
# CD pipeline automatically deploys previous version
```

### Database Issue

```bash
# Check connection pool
curl https://api.manas360.com/health/db

# Scale down if pool exhausted
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --desired-count 1

# Investigate and fix
# Then scale back up
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --desired-count 2
```

---

## 📝 OPERATIONAL TASKS

### Daily

- [ ] Monitor error rate (should be < 0.5%)
- [ ] Check response times (p95 < 500ms)
- [ ] Verify database health
- [ ] Check disk space

### Weekly

- [ ] Review log aggregation
- [ ] Check slow query log
- [ ] Review security logs
- [ ] Verify backups were successful

### Monthly

- [ ] Analyze performance trends
- [ ] Autoscaling effectiveness review
- [ ] Cost analysis
- [ ] Security audit
- [ ] Capacity planning review

---

## 🔐 SECURITY HARDENING

### Network

- [ ] Enable WAF (AWS WAF with rate limiting)
- [ ] Enable DDoS protection (AWS Shield)
- [ ] Restrict security groups to necessary ports only
- [ ] Enable VPC Flow Logs

### Application

- [ ] Enable request signing
- [ ] Implement request rate limiting by user
- [ ] Implement login attempt protection
- [ ] Enable audit logging for all operations

### Data

- [ ] Enable encryption at rest (RDS KMS)
- [ ] Enable encryption in transit (TLS 1.3)
- [ ] Enable database activity monitoring
- [ ] Implement automated backups (daily, 30-day retention)

---

## 📊 COST OPTIMIZATION

### Recommendations

1. **Reserved Instances** - 40% savings for production
2. **Spot Instances** - For development environments
3. **NAT Gateway** - Consider using NAT instance for dev
4. **Data Transfer** - Use CloudFront for static assets
5. **Database** - Use read replicas for high traffic

---

## 📚 RUNBOOKS

### Deployment Checklist

```bash
# 1. Create release branch
git checkout -b release/v1.0.0

# 2. Update version
# package.json version bump

# 3. Run tests
npm run test:all

# 4. Build Docker image
docker build -t manas360-backend:v1.0.0 -f backend/Dockerfile .

# 5. Push to registry
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/manas360-backend:v1.0.0

# 6. Update task definition with new image tag

# 7. Deploy to staging first
aws ecs update-service \
  --cluster manas360-staging \
  --service manas360-backend \
  --force-new-deployment

# 8. Smoke tests on staging
curl https://api-staging.manas360.com/health

# 9. Deploy to production
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --force-new-deployment

# 10. Monitor for 30 minutes
# Check error rate, latency, and CPU

# 11. Tag release
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

---

## 🆘 ROLLBACK PROCEDURE

```bash
# If deployment fails:

# 1. Immediately trigger previous version
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --task-definition manas360-backend:PREVIOUS_REVISION

# 2. Wait for rollback
aws ecs wait services-stable \
  --cluster manas360-prod \
  --services manas360-backend

# 3. Verify service
curl https://api.manas360.com/health

# 4. Investigate issue in staging
# 5. Fix and retry deployment
```

---

## 📞 SUPPORT CONTACTS

- **On-Call Engineer:** Check Slack #oncall
- **DevOps Team:** devops@manas360.com
- **AWS Support:** AWS Console
- **Database Team:** dba@manas360.com

---

**Last Updated:** February 25, 2026  
**Next Review:** March 25, 2026

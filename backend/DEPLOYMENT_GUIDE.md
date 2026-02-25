# 🚀 PRODUCTION DEPLOYMENT GUIDE
## AWS Deployment for MANAS360 Backend

**Author:** Principal Backend Architect  
**Target:** 100,000+ concurrent users  
**Platform:** AWS (ECS Fargate / App Runner / EKS)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Required AWS Resources
- [ ] VPC with private/public subnets
- [ ] RDS PostgreSQL 14+ instance
- [ ] ALB (Application Load Balancer)
- [ ] CloudWatch log groups
- [ ] AWS Secrets Manager secrets
- [ ] ECR repository for Docker images
- [ ] IAM roles for ECS task execution

### Required Secrets
- [ ] JWT_SECRET (64+ characters)
- [ ] JWT_REFRESH_SECRET (64+ characters)
- [ ] DATABASE_URL connection string
- [ ] ALLOWED_ORIGINS whitelist

---

## 🗄️ STEP 1: DATABASE SETUP (AWS RDS)

### Create RDS PostgreSQL Instance

```bash
# Via AWS CLI
aws rds create-db-instance \
    --db-instance-identifier manas360-prod-db \
    --db-instance-class db.t3.medium \
    --engine postgres \
    --engine-version 14.9 \
    --master-username manas360admin \
    --master-user-password '<SECURE_PASSWORD>' \
    --allocated-storage 100 \
    --storage-type gp3 \
    --storage-encrypted \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "sun:04:00-sun:05:00" \
    --multi-az \
    --publicly-accessible false \
    --vpc-security-group-ids sg-xxxxx \
    --db-subnet-group-name manas360-db-subnet \
    --enable-cloudwatch-logs-exports '["postgresql"]' \
    --tags Key=Environment,Value=Production Key=Project,Value=Manas360
```

**Recommended Instance Sizes:**

| User Load | Instance Type | vCPU | RAM | Storage | Cost/Month |
|-----------|---------------|------|-----|---------|------------|
| < 10K | db.t3.small | 2 | 2 GB | 50 GB | $25 |
| 10K-50K | db.t3.medium | 2 | 4 GB | 100 GB | $50 |
| 50K-100K | db.r5.large | 2 | 16 GB | 200 GB | $150 |
| 100K+ | db.r5.xlarge | 4 | 32 GB | 500 GB | $300 |

### Enable Required Extensions

```sql
-- Connect to RDS
psql postgresql://manas360admin:<PASSWORD>@<RDS_ENDPOINT>:5432/postgres

-- Create database
CREATE DATABASE manas360_production;
\c manas360_production

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_cron";  -- For scheduled jobs

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE manas360_production TO manas360admin;
```

### Run Database Migration

```bash
# Download schema
wget https://your-repo/backend/PRODUCTION_COMPLETE_SCHEMA.sql

# Apply schema (idempotent - safe to re-run)
psql postgresql://manas360admin:<PASSWORD>@<RDS_ENDPOINT>:5432/manas360_production \
    < PRODUCTION_COMPLETE_SCHEMA.sql

# Verify tables
psql $DATABASE_URL -c "\dt"

# Expected output: 13 tables
# - user_accounts
# - roles
# - permissions
# - role_permissions
# - subscription_plans
# - features
# - plan_features
# - user_subscriptions
# - tokens
# - sessions
# - audit_logs
# - rate_limit_logs
# - login_attempts

# Verify materialized views
psql $DATABASE_URL -c "\dm"

# Expected output: 3 materialized views
# - mv_users_with_subscription
# - mv_user_permissions
# - mv_user_features
```

### Setup Cron Jobs (Materialized View Refresh)

```sql
-- Refresh every 5 minutes (required for production)
SELECT cron.schedule(
    'refresh-materialized-views',
    '*/5 * * * *',
    'SELECT refresh_materialized_views();'
);

-- Cleanup expired tokens daily at 2 AM
SELECT cron.schedule(
    'cleanup-expired-tokens',
    '0 2 * * *',
    'SELECT cleanup_expired_tokens();'
);

-- Archive old audit logs monthly
SELECT cron.schedule(
    'cleanup-audit-logs',
    '0 3 1 * *',
    'SELECT cleanup_old_audit_logs();'
);

-- Verify cron jobs
SELECT * FROM cron.job;
```

---

## 🔐 STEP 2: SECRETS MANAGEMENT

### Generate Strong Secrets

```bash
# Generate JWT secret (64 characters)
openssl rand -base64 48

# Generate refresh token secret (64 characters)
openssl rand -base64 48

# Example output:
# JWT_SECRET=8x9K2mPzQw5vN3jL7eR1tY6uI0oP4sA8fG2hJ5kM9nB3vC7xZ1
# JWT_REFRESH_SECRET=3nM9kJ5fS2aG7hD4qW1eR8tY0uI6oP3zA5lK2xC9vB7nN4mJ1
```

### Store in AWS Secrets Manager

```bash
# Create secrets
aws secretsmanager create-secret \
    --name manas360/production/jwt-secret \
    --secret-string "8x9K2mPzQw5vN3jL7eR1tY6uI0oP4sA8fG2hJ5kM9nB3vC7xZ1" \
    --description "JWT access token secret for Manas360 production"

aws secretsmanager create-secret \
    --name manas360/production/jwt-refresh-secret \
    --secret-string "3nM9kJ5fS2aG7hD4qW1eR8tY0uI6oP3zA5lK2xC9vB7nN4mJ1" \
    --description "JWT refresh token secret for Manas360 production"

aws secretsmanager create-secret \
    --name manas360/production/database-url \
    --secret-string "postgresql://manas360admin:<PASSWORD>@<RDS_ENDPOINT>:5432/manas360_production" \
    --description "Database connection string"

# Retrieve secrets (for testing)
aws secretsmanager get-secret-value \
    --secret-id manas360/production/jwt-secret \
    --query SecretString --output text
```

---

## 🐳 STEP 3: CONTAINERIZATION

### Create Dockerfile

```dockerfile
# File: backend/Dockerfile

FROM node:18-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# ---------------------------------------------------

FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --chown=nodejs:nodejs package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Start server
CMD ["node", "src/server-PRODUCTION.js"]
```

### Build and Push to ECR

```bash
# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository \
    --repository-name manas360/backend \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Build image
docker build -t manas360-backend:latest \
    -f backend/Dockerfile \
    backend/

# Tag image
docker tag manas360-backend:latest \
    123456789012.dkr.ecr.us-east-1.amazonaws.com/manas360/backend:latest

# Push image
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/manas360/backend:latest
```

---

## ☁️ STEP 4: AWS DEPLOYMENT OPTIONS

### **Option A: ECS Fargate (Recommended for 100K+ users)**

**Best for:** Production workloads with auto-scaling  
**Cost:** $50-300/month (depends on vCPU/memory)  
**Pros:** Full control, auto-scaling, VPC networking  
**Cons:** More complex setup

#### Create Task Definition

```json
{
  "family": "manas360-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/manas360BackendTaskRole",
  "containerDefinitions": [
    {
      "name": "manas360-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/manas360/backend:latest",
      "cpu": 1024,
      "memory": 2048,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "PORT", "value": "5000" },
        { "name": "DB_POOL_MAX", "value": "50" },
        { "name": "DB_POOL_MIN", "value": "10" },
        { "name": "JWT_EXPIRY", "value": "15m" },
        { "name": "JWT_REFRESH_EXPIRY", "value": "7d" },
        { "name": "ALLOWED_ORIGINS", "value": "https://manas360.com,https://app.manas360.com" },
        { "name": "ROTATE_REFRESH_TOKEN", "value": "true" }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:manas360/production/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:manas360/production/jwt-secret"
        },
        {
          "name": "JWT_REFRESH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:manas360/production/jwt-refresh-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/manas360-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "api"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:5000/ready', (r) => process.exit(r.statusCode === 200 ? 0 : 1));\""],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Create ECS Service with Auto-Scaling

```bash
# Create service
aws ecs create-service \
    --cluster manas360-production \
    --service-name manas360-backend-service \
    --task-definition manas360-backend:1 \
    --desired-count 3 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/manas360-api/xxxxx,containerName=manas360-api,containerPort=5000" \
    --health-check-grace-period-seconds 60 \
    --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"

# Setup auto-scaling (scale 3-20 tasks)
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/manas360-production/manas360-backend-service \
    --min-capacity 3 \
    --max-capacity 20

# CPU-based scaling policy
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/manas360-production/manas360-backend-service \
    --policy-name manas360-cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
        "TargetValue": 60.0,
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
        },
        "ScaleInCooldown": 300,
        "ScaleOutCooldown": 60
    }'
```

**Cost Estimation (ECS Fargate):**
- CPU: 1 vCPU × $0.04048/hour = $29.95/month
- Memory: 2 GB × $0.004445/hour = $6.56/month
- **Per task:** $36.51/month
- **3 tasks (minimum):** $109.53/month
- **10 tasks (peak):** $365.10/month

---

### **Option B: AWS App Runner (Easier Setup)**

**Best for:** Simple deployments, < 50K users  
**Cost:** $25-100/month  
**Pros:** Fully managed, auto-scaling, simple  
**Cons:** Less control, higher per-request cost

```bash
# Create apprunner.yaml
cat > apprunner.yaml << 'EOF'
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm ci --only=production
run:
  runtime-version: 18
  command: node src/server-PRODUCTION.js
  network:
    port: 5000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
    - name: DB_POOL_MAX
      value: "20"
    - name: ALLOWED_ORIGINS
      value: "https://manas360.com"
EOF

# Deploy via CLI
aws apprunner create-service \
    --service-name manas360-backend \
    --source-configuration '{
        "CodeRepository": {
            "RepositoryUrl": "https://github.com/yourorg/manas360",
            "SourceCodeVersion": {"Type": "BRANCH", "Value": "main"},
            "CodeConfiguration": {
                "ConfigurationSource": "REPOSITORY",
                "CodeConfigurationValues": {
                    "Runtime": "NODEJS_18"
                }
            }
        },
        "AutoDeploymentsEnabled": true
    }' \
    --instance-configuration '{
        "Cpu": "1 vCPU",
        "Memory": "2 GB",
        "InstanceRoleArn": "arn:aws:iam::123456789012:role/AppRunnerInstanceRole"
    }' \
    --auto-scaling-configuration-arn arn:aws:apprunner:us-east-1:123456789012:autoscalingconfiguration/manas360-autoscaling/1/xxxxx
```

---

### **Option C: EKS (For Enterprise Scale)**

**Best for:** Multi-service architectures, 100K+ users  
**Cost:** $150-500/month (cluster + nodes)  
**Pros:** Kubernetes ecosystem, horizontal pod autoscaler  
**Cons:** Complex, requires K8s expertise

#### Kubernetes Deployment Manifest

```yaml
# File: k8s/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: manas360-backend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: manas360-backend
  template:
    metadata:
      labels:
        app: manas360-backend
    spec:
      containers:
      - name: api
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/manas360/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
        - name: DB_POOL_MAX
          value: "50"
        - name: ALLOWED_ORIGINS
          value: "https://manas360.com,https://app.manas360.com"
        envFrom:
        - secretRef:
            name: manas360-secrets
        resources:
          requests:
            cpu: "500m"
            memory: "1Gi"
          limits:
            cpu: "1000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /live
            port: 5000
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: manas360-backend-service
  namespace: production
spec:
  type: LoadBalancer
  selector:
    app: manas360-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: manas360-backend-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: manas360-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 70
```

Apply:
```bash
kubectl apply -f k8s/deployment.yaml
```

---

## 📊 STEP 5: MONITORING & LOGGING

### CloudWatch Dashboard

```bash
# Create custom dashboard
aws cloudwatch put-dashboard \
    --dashboard-name Manas360-Production \
    --dashboard-body file://cloudwatch-dashboard.json
```

**cloudwatch-dashboard.json:**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          [".", "MemoryUtilization", {"stat": "Average"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "ECS Resource Usage"
      }
    },
    {
      "type": "log",
      "properties": {
        "query": "SOURCE '/ecs/manas360-backend'\n| fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 20",
        "region": "us-east-1",
        "title": "Recent Errors"
      }
    }
  ]
}
```

### Alarms

```bash
# High error rate
aws cloudwatch put-metric-alarm \
    --alarm-name manas360-high-error-rate \
    --alarm-description "Alert when error rate > 1%" \
    --metric-name ErrorRate \
    --namespace Manas360/Production \
    --statistic Average \
    --period 300 \
    --threshold 1.0 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:us-east-1:123456789012:manas360-alerts

# Slow response time
aws cloudwatch put-metric-alarm \
    --alarm-name manas360-slow-response \
    --metric-name ResponseTime \
    --namespace Manas360/Production \
    --statistic Average \
    --period 60 \
    --threshold 100 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 3

# Database connection pool exhaustion
aws cloudwatch put-metric-alarm \
    --alarm-name manas360-db-pool-exhaustion \
    --metric-name DatabasePoolUtilization \
    --namespace Manas360/Production \
    --statistic Average \
    --period 300 \
    --threshold 90 \
    --comparison-operator GreaterThanThreshold
```

---

## 🔄 STEP 6: CI/CD PIPELINE

### GitHub Actions Workflow

```yaml
# File: .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: manas360/backend
  ECS_SERVICE: manas360-backend-service
  ECS_CLUSTER: manas360-production
  ECS_TASK_DEFINITION: task-definition.json

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f backend/Dockerfile backend/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Update ECS task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: ${{ env.ECS_TASK_DEFINITION }}
          container-name: manas360-api
          image: ${{ steps.build-image.outputs.image }}

      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true

      - name: Verify deployment
        run: |
          # Wait for new tasks to be running
          sleep 60
          
          # Check health endpoint
          LOAD_BALANCER_URL=$(aws elbv2 describe-load-balancers --names manas360-alb --query 'LoadBalancers[0].DNSName' --output text)
          HEALTH_STATUS=$(curl -s https://$LOAD_BALANCER_URL/health | jq -r '.status')
          
          if [ "$HEALTH_STATUS" != "healthy" ]; then
            echo "Deployment health check failed"
            exit 1
          fi
          
          echo "Deployment successful - health check passed"
```

---

## 🧪 STEP 7: POST-DEPLOYMENT VALIDATION

### Health Check

```bash
# Get load balancer URL
ALB_URL=$(aws elbv2 describe-load-balancers \
    --names manas360-alb \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

# Check health endpoint
curl https://$ALB_URL/health | jq

# Expected output:
# {
#   "status": "healthy",
#   "database": "connected",
#   "pool": {
#     "total": 50,
#     "idle": 35,
#     "waiting": 0
#   },
#   "uptime": 3600
# }
```

### Load Test

```bash
# Install Apache Bench
brew install httpd  # macOS
# or
sudo apt-get install apache2-utils  # Ubuntu

# Run load test (1000 requests, 100 concurrent)
ab -n 1000 -c 100 -H "Authorization: Bearer <TEST_TOKEN>" \
    https://$ALB_URL/api/v1/users/profile

# Expected results:
# Requests per second: 2000+
# Time per request: 50ms (mean)
# Failed requests: 0
```

### Database Verification

```bash
# Check materialized view refresh
psql $DATABASE_URL -c "SELECT NOW() - last_refresh as age FROM pg_stat_all_tables WHERE schemaname = 'public' AND relname LIKE 'mv_%';"

# Should show last_refresh < 5 minutes ago

# Check cron jobs
psql $DATABASE_URL -c "SELECT * FROM cron.job;"

# Verify connection count
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'manas360_production';"

# Should be < DB_POOL_MAX (50 in production)
```

---

## 📦 ROLLBACK PROCEDURE

### ECS Rollback

```bash
# List previous task definitions
aws ecs list-task-definitions \
    --family-prefix manas360-backend \
    --sort DESC

# Rollback to previous version
aws ecs update-service \
    --cluster manas360-production \
    --service manas360-backend-service \
    --task-definition manas360-backend:PREVIOUS_REVISION \
    --force-new-deployment

# Monitor rollback
aws ecs wait services-stable \
    --cluster manas360-production \
    --services manas360-backend-service
```

### Database Rollback (if needed)

```sql
-- Rollback schema changes (if any)
BEGIN;

-- Drop new tables/columns added in latest migration
-- (Only if deployment added schema changes)

COMMIT;
```

---

## 📈 SCALING GUIDE

### Horizontal Scaling (Add more servers)

```bash
# Increase ECS service desired count
aws ecs update-service \
    --cluster manas360-production \
    --service manas360-backend-service \
    --desired-count 10  # Scale to 10 tasks
```

### Vertical Scaling (Bigger servers)

```json
// Update task definition CPU/memory
{
  "cpu": "2048",     // 2 vCPU (was 1024)
  "memory": "4096"   // 4 GB (was 2048)
}
```

### Database Scaling

```bash
# Increase RDS instance size
aws rds modify-db-instance \
    --db-instance-identifier manas360-prod-db \
    --db-instance-class db.r5.xlarge \  # Upgrade from db.t3.medium
    --apply-immediately
```

---

## 💰 COST OPTIMIZATION TIPS

1. **Use Reserved Instances** (1-year commitment)
   - Savings: 30-40% on RDS and ECS

2. **Enable RDS Auto-Scaling Storage**
   - Only pay for storage you use

3. **Use CloudFront CDN**
   - Reduce backend load for static assets

4. **Enable S3 Lifecycle Policies**
   - Archive old logs to Glacier

5. **Right-size instances**
   - Monitor CloudWatch and adjust CPU/memory

**Estimated Monthly Cost (100K users):**
- ECS Fargate: $200 (6 tasks)
- RDS db.r5.large: $150
- ALB: $25
- CloudWatch: $10
- Data Transfer: $50
- **Total: ~$435/month**

---

## ✅ PRODUCTION LAUNCH CHECKLIST

- [ ] Database migrated and verified
- [ ] Secrets stored in AWS Secrets Manager
- [ ] Docker image built and pushed to ECR
- [ ] ECS service deployed with 3+ tasks
- [ ] Load balancer configured with SSL certificate
- [ ] Auto-scaling policies configured
- [ ] CloudWatch alarms created
- [ ] Health checks passing
- [ ] Load testing completed (10K+ req/sec)
- [ ] Rollback procedure tested
- [ ] Backup/restore procedure tested
- [ ] Monitoring dashboard configured
- [ ] On-call rotation established
- [ ] Documentation updated
- [ ] DNS updated to point to ALB

**Status:** ✅ Ready for production deployment

---

**END OF DEPLOYMENT GUIDE**

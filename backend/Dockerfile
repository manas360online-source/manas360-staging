# ================================================================
# MANAS360 Unified Backend - Production Dockerfile
# ================================================================
# Multi-stage build for optimized production image
# Based on Node.js 20 LTS
# ================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# ================================================================
# PRODUCTION IMAGE
# ================================================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend ./backend

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)});"

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "backend/src/server.js"]

# Multi-stage Dockerfile for AMD64 and ARM64

# Stage 1: Builder - install dependencies only
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
#RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production image
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs . .

EXPOSE 3000
USER nodejs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>r.statusCode===200?process.exit(0):process.exit(1))"

CMD ["node", "src/server.js"]

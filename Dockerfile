# Frontend Builder
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Backend Stage
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./

RUN npm ci --only=production

# Copy backend code
COPY backend/ .

# Copy frontend dist to serve static files
COPY --from=frontend-builder /app/dist ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]

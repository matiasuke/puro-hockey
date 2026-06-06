# PURO HOCKEY Backend - Dockerfile simplificado
# Node.js 18 Alpine - Solo Backend

FROM node:18-alpine

WORKDIR /app

# Copiar package.json del backend
COPY backend/package*.json ./

# Instalar dependencias (production)
RUN npm ci --only=production 2>&1 || npm install --production

# Copiar código del backend
COPY backend/ .

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Iniciar aplicación
CMD ["node", "app-simple.js"]

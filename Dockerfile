# PURO HOCKEY - Backend Dockerfile para Railway
# Node.js Express Backend + PostgreSQL

FROM node:18-alpine

WORKDIR /app

# Copiar package.json del backend
COPY backend/package*.json ./

# Instalar dependencias de produccion
RUN npm ci --only=production

# Copiar codigo del backend
COPY backend/ .

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar aplicacion
CMD ["npm", "start"]

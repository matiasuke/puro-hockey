# PURO HOCKEY Backend - Dockerfile simplificado
# Node.js 18 Alpine

FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo package.json
COPY package.json package-lock.json ./

# Instalar dependencias (production only)
RUN npm ci --only=production 2>&1 || npm install --production

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Iniciar aplicación
CMD ["node", "app.js"]

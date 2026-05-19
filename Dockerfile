# ------------------ Stage 1: Dev ------------------
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos todas las dependencias (dev incluidas)
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Exponer puerto que usará Vite
EXPOSE 5173

# Ejecutar Vite en modo dev, escuchando en todas las interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


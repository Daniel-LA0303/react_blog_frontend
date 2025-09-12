# ------------------ Stage 1: Build ------------------
# Use Node 18 Alpine for minimal build image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml / yarn.lock)
COPY package*.json ./

# Install all dependencies (dev included, needed for building)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the frontend (Vite will generate static files in /dist)
RUN npm run build

# ------------------ Stage 2: Serve ------------------
# Use a minimal nginx image to serve static files
FROM nginx:alpine

# Copy the build output to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 5173

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

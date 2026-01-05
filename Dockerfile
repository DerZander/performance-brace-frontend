# Multi-Stage Build
FROM node:20-alpine AS build

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Dependencies
RUN npm ci --silent

# Kopiere den restlichen Code
COPY . .

# Build Arguments für Vite (optional, mit Default)
ARG VITE_API_URL=http://localhost:8080/api
ARG VITE_FRONTEND_URL=http://localhost:5173
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}

# Baue die Anwendung
RUN npm run build

# Production Stage mit nginx
FROM nginx:alpine

# Kopiere die gebaute App
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiere nginx Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port
EXPOSE 80

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]


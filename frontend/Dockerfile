# ─────────────────────────────────────────────────────────────
# Frontend Dockerfile — React (CRA) + Nginx
#
# Stage 1: Builder  — Node.js, installs deps, runs `npm build`
# Stage 2: Runtime  — Nginx serves the static /build output
#           Nginx also reverse-proxies /api → FastAPI backend
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer cache: only re-runs npm ci if deps changed)
COPY package.json package-lock.json* ./

# Clean install — reproducible, faster than `npm install`
RUN npm ci --silent

# Copy rest of the source
COPY . .

# Create optimised production build (output: /app/build)
RUN npm run build


# ── Stage 2: Nginx Runtime ───────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config (handles SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (HTTP)
EXPOSE 80

# Nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]

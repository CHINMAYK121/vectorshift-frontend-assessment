# ─────────────────────────────────────────────────────────────
# Backend Dockerfile — FastAPI + Uvicorn
# Stage 1: Builder  (installs dependencies)
# Stage 2: Runtime  (minimal image, no build tools)
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies (needed for some pip packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (leverages Docker layer cache)
COPY requirements.txt .

# Install all dependencies into a local prefix (not system-wide)
RUN pip install --upgrade pip \
    && pip install --prefix=/install --no-cache-dir -r requirements.txt


# ── Stage 2: Runtime ─────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run Uvicorn — production-grade ASGI server
# --host 0.0.0.0 → accepts connections from outside the container
# --workers 2    → 2 worker processes (tune to 2× vCPUs on EC2)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]

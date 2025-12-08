#!/bin/bash
# Create bucket if not exists (requires mc or use API)
# For simplicity, this script uses curl to S3-compatible API (works if MinIO is up)
MINIO_URL="${MINIO_URL:-http://localhost:9000}"
ACCESS="${MINIO_ACCESS:-minioadmin}"
SECRET="${MINIO_SECRET:-minioadmin}"
BUCKET="${MINIO_BUCKET:-feac-artifacts}"

echo "Check MinIO bucket (manual step). If MinIO not up, start docker-compose first."

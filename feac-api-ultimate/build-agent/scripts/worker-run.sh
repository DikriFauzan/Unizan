#!/bin/bash
# Simple wrapper to run worker processes locally (for TERMUX testing)
cd "$(dirname "$0")/../.." || exit 1
# Run producer and worker using node
# In dev: ensure backend is built (tsc) or use ts-node
echo "[build-agent] Starting producer (bridging LPUSH -> Bull)..."
node backend/dist/worker/producer.js &
echo "[build-agent] Starting worker..."
node backend/dist/worker/worker.js &
echo "[build-agent] All worker processes started."

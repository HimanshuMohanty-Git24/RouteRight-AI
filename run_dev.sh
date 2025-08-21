#!/usr/bin/env bash
set -euo pipefail

# Simple concurrent runner for backend (FastAPI) and frontend (Vite)
# Usage:
#   chmod +x run_dev.sh
#   ./run_dev.sh
# Optionally export PORT or FRONTEND_PORT before running.

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

backend() {
  echo "[BACKEND] Starting FastAPI on :$BACKEND_PORT"
  cd "$SCRIPT_DIR/backend/app"
  # Prefer uvicorn in current venv / path
  uvicorn main:app --reload --port "$BACKEND_PORT"
}

frontend() {
  echo "[FRONTEND] Starting Vite on :$FRONTEND_PORT"
  cd "$SCRIPT_DIR/frontend"
  npm run dev -- --port "$FRONTEND_PORT"
}

trap_handler() {
  echo "\nStopping services..."
  pkill -P $$ || true
  wait || true
  echo "Done."
}

trap trap_handler INT TERM

backend &
BACKEND_PID=$!
frontend &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
wait $BACKEND_PID $FRONTEND_PID
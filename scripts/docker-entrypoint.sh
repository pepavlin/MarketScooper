#!/bin/sh
set -e

# Extract host and port from DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:/]*\).*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')

echo "[entrypoint] Waiting for database at ${DB_HOST}:${DB_PORT}..."
for i in $(seq 1 30); do
  if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
    echo "[entrypoint] Database is reachable."
    sleep 1
    break
  fi
  echo "[entrypoint] Database not ready, attempt $i/30..."
  sleep 2
done

echo "[entrypoint] Running migrations..."
npx prisma migrate deploy 2>&1 || {
  echo "[entrypoint] migrate deploy failed, falling back to db push..."
  npx prisma db push --accept-data-loss 2>&1
}

echo "[entrypoint] Seeding database..."
pnpm db:seed 2>&1 || echo "[entrypoint] Seed skipped (may already exist)"

echo "[entrypoint] Starting: $@"
exec "$@"

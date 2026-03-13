#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1; do
  echo "Database not ready, retrying in 2s..."
  sleep 2
done

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
pnpm db:seed || true

echo "Starting application..."
exec "$@"

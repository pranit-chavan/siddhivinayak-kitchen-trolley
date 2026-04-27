#!/bin/sh
set -e

echo "==> Waiting for DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Exiting."
  exit 1
fi

echo "==> DATABASE_URL is set. Running Prisma push..."
npx prisma db push --schema=../database/schema.prisma --accept-data-loss

echo "==> Starting NestJS application..."
node dist/main

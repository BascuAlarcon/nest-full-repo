#!/bin/sh

# Run Prisma migrations
npx prisma migrate deploy

# Verify the main.js file exists (checking both possible locations)
if [ -f "dist/main.js" ]; then
  MAIN_FILE="dist/main.js"
elif [ -f "dist/apps/products-service/main.js" ]; then
  MAIN_FILE="dist/apps/products-service/main.js"
else
  echo "Error: main.js not found!"
  echo "Checking dist structure:"
  ls -la dist/ || echo "dist directory not found"
  find dist -name "main.js" || echo "No main.js found anywhere in dist"
  exit 1
fi

echo "Starting application from: $MAIN_FILE"

# Start the application with tsconfig-paths support
exec node -r tsconfig-paths/register "$MAIN_FILE"

#!/bin/sh

# Run Prisma migrations
npx prisma migrate deploy

MAIN_FILE="dist/apps/products-service/main.js"  

# Start the application with tsconfig-paths support
exec node -r tsconfig-paths/register "$MAIN_FILE"

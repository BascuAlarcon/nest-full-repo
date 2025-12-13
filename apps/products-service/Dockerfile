# Base image
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory to match monorepo structure
WORKDIR /usr/src/app/apps/products-service

# Copy package files from products-service
COPY ./apps/products-service/package*.json ./

# Install dependencies (including dev dependencies for tsconfig-paths)
RUN npm install

# Copy Prisma schema and generate client
COPY ./apps/products-service/prisma ./prisma
RUN npx prisma generate

# Copy source code from products-service
COPY ./apps/products-service/src ./src
COPY ./apps/products-service/main.ts ./
COPY ./apps/products-service/app.module.ts ./
COPY ./apps/products-service/tsconfig.json ./
COPY ./apps/products-service/nest-cli.json ./

# Copy shared libraries to maintain monorepo structure
COPY ./libs /usr/src/app/libs

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la dist/ || echo "Build failed - no dist directory"

# Copy entrypoint script
COPY ./apps/products-service/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Start the application using entrypoint script
CMD ["./docker-entrypoint.sh"]
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY ./apps/products-service/prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Copy shared libraries
COPY ../../libs ./libs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
# File: Dockerfile

# Stage 1: The Build Environment
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy and install ALL dependencies from package.json and package-lock.json
# This step ensures all dependencies are resolved and cached by Docker.
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the production build command (if your app requires one)
RUN npm run build

# Stage 2: The Final, Lightweight Production Image
FROM node:18-alpine

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary production files and dependencies
# The --only=production flag is now handled by npm's own logic during install.
COPY --chown=appuser:appgroup --from=builder /usr/src/app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /usr/src/app/ecosystem.config.js .
COPY --chown=appuser:appgroup --from=builder /usr/src/app/package*.json .
# Copy any other necessary files
# COPY --from=builder /usr/src/app/dist ./dist

# The production command to start your application
CMD ["/usr/src/app/node_modules/.bin/pm2-runtime", "start", "ecosystem.config.js"]
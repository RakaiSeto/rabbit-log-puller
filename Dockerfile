# Stage 1: The Build Environment
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript application
# This will create the compiled JS files in the dist directory
RUN npm run build

# Stage 2: The Final, Lightweight Production Image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the correct permissions for the working directory
RUN chown -R appuser:appgroup /usr/src/app

# Switch to the non-root user
USER appuser

# Copy only the necessary source and build files from the builder stage
COPY --chown=appuser:appgroup --from=builder /usr/src/app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /usr/src/app/ecosystem.config.js .
COPY --chown=appuser:appgroup --from=builder /usr/src/app/package*.json .
# Copy all other necessary non-code files (e.g., assets, configs)

# Install only the production dependencies
RUN npm install --only=production

# Expose the application port (if applicable)
# EXPOSE 3000

# Command to run your application using PM2's runtime
CMD ["/usr/src/app/node_modules/.bin/pm2-runtime", "start", "ecosystem.config.js"]
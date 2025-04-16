# Multi-stage build for UW Waste Management App

####################
# BUILD STAGE
####################
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

####################
# PRODUCTION STAGE
####################
FROM node:18-alpine AS production

WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built files from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/backend ./backend

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "backend/server.js"]

####################
# DEVELOPMENT STAGE
####################
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies including dev dependencies
RUN npm install

# Expose ports for dev server and API
EXPOSE 3000
EXPOSE 3001

# Use nodemon for development
RUN npm install -g nodemon

# Set volume mount point for source code
VOLUME ["/app"]

# Start development server
CMD ["npm", "run", "dev"]
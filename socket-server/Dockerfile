# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first to leverage cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN yarn run tsc

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Use non-root user for better security
USER node

CMD ["node", "dist/index.js"]

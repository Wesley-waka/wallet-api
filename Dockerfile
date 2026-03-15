FROM node:22-alpine AS base
WORKDIR /app

# stage build 1 for optimal image size
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Prisma generation
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Create user for running app and Backend access
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy node_modules from builder to Builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
# Copy compiled TypeScript output to user directory
COPY --from=builder /app/dist ./dist
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
CMD ["npm", "start"]
# Base image
FROM node:22-alpine AS base
WORKDIR /app


FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force


FROM base AS builder
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json package-lock.json ./

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000
CMD ["npm", "start"]
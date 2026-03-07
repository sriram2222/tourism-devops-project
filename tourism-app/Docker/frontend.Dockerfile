# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# copy only package files first (for cache)
COPY package*.json ./

# clean cache + install (best for CI/CD)
RUN npm cache clean --force
RUN npm ci

# copy rest of project
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# build nextjs
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# install only production deps
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm","start"]
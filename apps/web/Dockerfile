FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM base AS app

RUN apk add --no-cache tini

WORKDIR /app

COPY --from=builder --chown=node /app/.next/standalone ./
COPY --from=builder --chown=node /app/.next/static ./.next/static
COPY --from=builder --chown=node /app/prisma ./prisma
COPY --from=builder --chown=node /app/public ./public

RUN npm install --global --save-exact "prisma@$(node --print 'require("./node_modules/@prisma/client/package.json").version')"

COPY start.sh /usr/local/bin
RUN chmod +x /usr/local/bin/start.sh

ENV CHECKPOINT_DISABLE=1
ENV DISABLE_PRISMA_TELEMETRY=true
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

ENTRYPOINT [ "start.sh" ]

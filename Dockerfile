# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.10.5 prune --scope=api --scope=web --docker

FROM base AS builder
ARG API_URL=http://localhost:4000
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV API_URL=$API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ ./
RUN pnpm turbo run build --filter=api --filter=web

FROM node:22-bookworm-slim AS runner-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=builder /app /app

FROM runner-base AS api
EXPOSE 4000
CMD ["pnpm", "--filter", "api", "start"]

FROM runner-base AS web
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]

FROM runner-base AS migrate
CMD ["sh", "-c", "pnpm --filter @repo/db db:deploy && pnpm --filter api seed:admin"]

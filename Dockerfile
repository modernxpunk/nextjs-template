# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.8.14 prune --scope=api --scope=web --docker

FROM base AS builder
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
CMD ["pnpm", "--filter", "@repo/db", "db:deploy"]

# syntax=docker/dockerfile:1.7

# Pin the exact image used by the baseline so builds are reproducible while
# retaining the existing Node.js and glibc runtime.
ARG NODE_IMAGE=node:22-bookworm-slim@sha256:6c74791e557ce11fc957704f6d4fe134a7bc8d6f5ca4403205b2966bd488f6b3

FROM ${NODE_IMAGE} AS build-base
ENV PNPM_HOME="/pnpm" \
	PATH="$PNPM_HOME:$PATH" \
	NEXT_TELEMETRY_DISABLED=1 \
	TURBO_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

FROM build-base AS pruner
COPY . .
RUN --mount=type=cache,id=pnpm-prune-v4,target=/pnpm/store,sharing=locked \
	pnpm dlx turbo@2.10.5 prune api web --docker

FROM build-base AS builder
ARG API_URL=http://localhost:4000
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV API_URL=$API_URL \
	NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-build-v4,target=/pnpm/store,sharing=locked \
	pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ ./
RUN pnpm turbo run build --filter=api --filter=web

# Retain pnpm's native workspace links while installing only the API and its
# production dependency closure. This avoids both the full build tree and the
# legacy deploy implementation's extra resolution/copy pass.
FROM build-base AS api-production
COPY --from=pruner /app/out/json/ ./
# Taking the lockfile from builder intentionally schedules this after the full
# install/build has populated the shared package cache.
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-build-v4,target=/pnpm/store,sharing=locked \
	pnpm install --frozen-lockfile --prod --filter=api... --ignore-scripts

# drizzle-kit and the seed tooling are intentionally present only in the
# one-shot migration image.
FROM build-base AS migrate-dependencies
COPY --from=pruner /app/out/json/ ./
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-build-v4,target=/pnpm/store,sharing=locked \
	pnpm install --frozen-lockfile --filter=api... --filter=@repo/db... --ignore-scripts

FROM scratch AS api-bundle
COPY --from=api-production /app/ /app/
COPY --from=builder /app/apps/api/dist/ /app/apps/api/dist/
COPY --from=builder /app/apps/api/openapi.json /app/apps/api/openapi.json
COPY --from=builder /app/packages/db/dist/ /app/packages/db/dist/
COPY --from=builder /app/packages/email/dist/ /app/packages/email/dist/

FROM scratch AS migrate-bundle
COPY --from=migrate-dependencies /app/ /app/
COPY --from=builder /app/apps/api/dist/ /app/apps/api/dist/
COPY --from=builder /app/packages/db/dist/ /app/packages/db/dist/
COPY --from=builder /app/packages/db/drizzle.config.ts /app/packages/db/drizzle.config.ts
COPY --from=builder /app/packages/db/drizzle/ /app/packages/db/drizzle/
COPY --from=builder /app/packages/db/src/ /app/packages/db/src/
COPY --from=builder /app/packages/email/dist/ /app/packages/email/dist/

FROM scratch AS web-bundle
COPY --from=builder /app/apps/web/.next/standalone/ /app/
COPY --from=builder /app/apps/web/public/ /app/apps/web/public/
COPY --from=builder /app/apps/web/.next/static/ /app/apps/web/.next/static/
COPY --from=builder /app/apps/web/scripts/with-api-ready.mjs /app/apps/web/scripts/with-api-ready.mjs

FROM ${NODE_IMAGE} AS runtime-base
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
USER node

FROM runtime-base AS api
COPY --from=api-bundle --chown=node:node /app/ /app/
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]

FROM runtime-base AS web
ENV HOSTNAME=0.0.0.0
COPY --from=web-bundle --chown=node:node /app/ /app/
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "scripts/with-api-ready.mjs", "node", "server.js"]

FROM runtime-base AS migrate
COPY --from=migrate-bundle --chown=node:node /app/ /app/
WORKDIR /app/packages/db
CMD ["sh", "-c", "npm run db:deploy && cd /app/apps/api && DB_LOGGING=false node dist/scripts/seed-admin.js"]

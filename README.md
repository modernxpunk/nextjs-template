# nextjs-template

Production-oriented TypeScript monorepo with a Next.js web app, a NestJS API,
Better Auth, PostgreSQL/Drizzle, S3-compatible object storage, shared UI and email
packages, and local observability through Loki and Grafana.

## Prerequisites

- Node.js 22.6 or newer
- pnpm 10.16.1 (managed through Corepack)
- Docker with Compose

## Local development

The automated setup installs dependencies, starts the local services, and applies
database migrations:

```bash
pnpm setup:local
pnpm dev
```

For manual setup:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
docker compose up -d postgres rustfs rustfs-init loki grafana
pnpm db:deploy
pnpm dev
```

Local endpoints:

- Web: http://localhost:3000
- API: http://localhost:4000
- API documentation: http://localhost:4000/docs
- Sample admin: admin@example.com / change-me-admin-password
- RustFS console: http://localhost:9001
- Grafana: http://localhost:3001

## Validation

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Create a migration after changing `packages/db/src/schema.ts`, then apply it:

```bash
pnpm --filter @repo/db db:generate
pnpm db:deploy
```

Seed or refresh the local sample admin user:

```bash
pnpm db:seed
```

## Docker stack

Copy the Docker environment template and bootstrap the complete stack:

```bash
cp .env.docker.example .env.docker
pnpm docker:bootstrap
```

Useful commands:

```bash
pnpm docker:logs
pnpm docker:migrate
pnpm docker:down
```

`API_URL` is used for server-to-server calls. `NEXT_PUBLIC_API_URL` is embedded
in the browser bundle and must be reachable by users. `WEB_ORIGIN` accepts a
comma-separated list of exact frontend origins. Configure `RESEND_TOKEN` and
`RESEND_FROM` to enable password-reset email delivery.

Run `docker compose --env-file .env.docker down -v` only when you intentionally want to remove local
PostgreSQL, Grafana, Loki, and RustFS data volumes.

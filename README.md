# nextjs-template

## Local Development

### Quick Start

```bash
pnpm setup:local
pnpm dev
```

This will install dependencies, start Docker services, run migrations, and prepare everything for development.

### Manual Setup

<details>
<summary>Click to expand manual steps</summary>

#### Prerequisites

- Node.js 20+
- pnpm
- Docker (for PostgreSQL and RustFS)

#### 1. Install dependencies

```bash
pnpm install
```

#### 2. Prepare env

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

#### 3. Start services

Start PostgreSQL and RustFS (S3-compatible storage):

```bash
docker-compose up -d postgres rustfs rustfs-init
```

This will:
- Start PostgreSQL on port 5432
- Start RustFS on ports 9000 (S3 API) and 9001 (console)
- Auto-create `uploads` bucket with public read access

#### 4. Run migrations

```bash
pnpm --filter @repo/db db:migrate
```

#### 5. Start dev server

```bash
pnpm dev
```

</details>

### URLs

- API: http://localhost:4000
- Web: http://localhost:3000
- RustFS Console: http://localhost:9001 (login: admin / password123)

### Reset storage

To clear all uploaded files:

```bash
docker-compose stop rustfs rustfs-init
docker-compose rm -f rustfs rustfs-init
docker volume rm nextjs-template_rustfs-data
docker-compose up -d rustfs rustfs-init
```

---

## Docker setup

This repository runs in Docker with 4 services:
- `postgres`: PostgreSQL 16
- `migrate`: one-off Drizzle deploy job
- `api`: NestJS (`http://localhost:4000`)
- `web`: Next.js (`http://localhost:3000`)

### 1. Prepare env

```bash
cp .env.docker.example .env.docker
```

### 2. Bootstrap stack

```bash
pnpm docker:bootstrap
```

This command:
1. Starts `postgres`
2. Runs DB migrations (`migrate` service)
3. Builds and starts `api` and `web`

### 3. Useful commands

```bash
pnpm docker:logs
pnpm docker:migrate
pnpm docker:down
```

To remove PostgreSQL volume too:

```bash
docker compose down -v
```

## Important env notes

- `API_URL` in `.env.docker` is the public API URL (`http://localhost:4000`) used by API auth config.
- `web` service overrides `API_URL` to `http://api:4000` in `docker-compose.yml` for internal Docker network calls.
- `PUBLIC_API_URL` is used by the browser and should point to host-accessible API URL, e.g. `http://localhost:4000`.
- `WEB_ORIGIN` must match where users open frontend, e.g. `http://localhost:3000`.
- `BETTER_AUTH_SECRET` must be set. Generate a long random string for non-local environments.

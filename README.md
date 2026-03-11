# nextjs-template

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

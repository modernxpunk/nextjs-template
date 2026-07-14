# Web application

The web workspace is a Next.js App Router application. It communicates with the
NestJS API through `API_URL` on the server and `NEXT_PUBLIC_API_URL` in the
browser. Run it from the repository root so Turbo can build its workspace
dependencies and generate the API client:

```bash
pnpm dev
```

See the repository README for environment setup, validation, and Docker usage.

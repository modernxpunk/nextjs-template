#!/bin/sh
set -ex

# Run DB migrations before start if needed:
# pnpm --filter @repo/db db:deploy

exec /sbin/tini -- node server.js

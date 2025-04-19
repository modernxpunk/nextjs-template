#!/bin/sh
set -ex

bunx --no-update-notifier prisma migrate deploy

bun server.js
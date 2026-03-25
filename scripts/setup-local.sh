#!/bin/bash
set -e

echo "🚀 Setting up local development environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first: npm install -g pnpm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Copy env files if they don't exist
echo -e "${YELLOW}Setting up environment files...${NC}"

if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "  Created apps/api/.env"
else
    echo "  apps/api/.env already exists, skipping"
fi

if [ ! -f "apps/web/.env" ]; then
    cp apps/web/.env.example apps/web/.env
    echo "  Created apps/web/.env"
else
    echo "  apps/web/.env already exists, skipping"
fi

echo -e "${GREEN}✓ Environment files ready${NC}"

# Start Docker services
echo -e "${YELLOW}Starting Docker services (PostgreSQL, RustFS)...${NC}"
docker-compose up -d postgres rustfs

# Wait for postgres to be healthy
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U modernpunk -d app &> /dev/null; do
    sleep 1
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Wait for rustfs to be ready
echo -e "${YELLOW}Waiting for RustFS to be ready...${NC}"
sleep 3
docker-compose up -d rustfs-init
echo -e "${GREEN}✓ RustFS is ready${NC}"

# Build database package
echo -e "${YELLOW}Building database package...${NC}"
pnpm --filter @repo/db build
echo -e "${GREEN}✓ Database package built${NC}"

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
pnpm --filter @repo/db db:migrate
echo -e "${GREEN}✓ Migrations complete${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Run 'pnpm dev' to start the development server"
echo ""
echo "URLs:"
echo "  - API: http://localhost:4000"
echo "  - Web: http://localhost:3000"
echo "  - RustFS Console: http://localhost:9001 (admin / password123)"

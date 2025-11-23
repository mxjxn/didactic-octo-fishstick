#!/bin/bash

# Farcaster Risk Game - Quick Setup Script

set -e

echo "🎮 Farcaster Risk Game - Quick Setup"
echo "===================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    echo "   Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup backend
echo ""
echo "🔧 Setting up backend..."
cd apps/backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created apps/backend/.env (please add your NEYNAR_API_KEY)"
else
    echo "⚠️  apps/backend/.env already exists, skipping"
fi
cd ../..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd apps/frontend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created apps/frontend/.env"
else
    echo "⚠️  apps/frontend/.env already exists, skipping"
fi
cd ../..

# Setup database (optional)
echo ""
echo "💾 Setting up database..."
cd packages/database
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created packages/database/.env"
else
    echo "⚠️  packages/database/.env already exists, skipping"
fi

# Generate Prisma client
echo "   Generating Prisma client..."
npm run db:generate
cd ../..

# Build all packages
echo ""
echo "🔨 Building all packages..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add your Neynar API key to apps/backend/.env"
echo "      Get one at: https://neynar.com"
echo ""
echo "   2. Start the development servers:"
echo "      npm run dev"
echo ""
echo "   3. Open your browser:"
echo "      Frontend: http://localhost:3000"
echo "      Backend:  http://localhost:4000"
echo ""
echo "🎮 Happy gaming!"

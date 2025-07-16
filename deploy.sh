#!/bin/bash
set -e

echo "🚀 Starting deployment..."
echo "----------------------------------------"

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull

# Frontend deployment
echo ""
echo "🎨 Frontend deployment"
echo "----------------------------------------"
cd /var/www/almalex.ch/frontend

echo "📦 Installing frontend dependencies..."
pnpm install

echo "🔨 Building frontend application..."
pnpm build

echo "🧹 Cleaning up source maps..."
find build -name "*.map" -delete

# Backend deployment
echo ""
echo "⚙️  Backend deployment"
echo "----------------------------------------"
cd /var/www/almalex.ch/backend

echo "📦 Installing backend dependencies..."
uv pip install -r pyproject.toml

echo "🗄️  Running database migrations..."
uv run alembic upgrade head

# Service restart
echo ""
echo "🔄 Restarting services"
echo "----------------------------------------"
echo "🔄 Reloading backend service..."
sudo systemctl reload almalex-backend.service

echo "🔄 Reloading frontend service..."
sudo systemctl reload almalex-frontend.service

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 almalex.ch is now updated"

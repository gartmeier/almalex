#!/bin/bash
set -e

echo "🚀 Starting deployment..."
echo "----------------------------------------"

# Reset to latest changes
echo "📥 Resetting to latest changes from git..."
git fetch origin
git reset --hard origin/main

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

# Systemd services
echo ""
echo "⚡ Installing systemd services"
echo "----------------------------------------"
cd /var/www/almalex.ch
echo "📋 Copying systemd files..."
sudo cp systemd/*.service systemd/*.timer /etc/systemd/system/

echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

# Service restart
echo ""
echo "🔄 Restarting services"
echo "----------------------------------------"
echo "🔄 Reloading backend service..."
sudo systemctl reload almalex-backend.service

#echo "🔄 Reloading frontend service..."
#sudo systemctl reload almalex-frontend.service

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 almalex.ch is now updated"

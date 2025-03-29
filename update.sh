#!/bin/bash

# Pull latest changes
git pull

# Copy .env.local to .env
cp .env.local .env

# Rebuild and restart containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Deployment completed successfully"
echo "Website available at: https://thansohoc.mystic.vn" 
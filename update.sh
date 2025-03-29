#!/bin/bash

# Pull latest changes
git pull

# Copy .env.local to .env
cp .env.local .env

# Đảm bảo chmod cho các file
chmod +x setup-nginx.sh 

# Xóa các container và images cũ để rebuild hoàn toàn
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d

echo "Deployment completed successfully"
echo "Website available at: https://thansohoc.mystic.vn" 
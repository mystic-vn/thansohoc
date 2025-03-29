#!/bin/bash

# Cài đặt Nginx và Certbot
apt update
apt install -y nginx certbot python3-certbot-nginx

# Sao chép file cấu hình
cp nginx-thansohoc.conf /etc/nginx/sites-available/thansohoc

# Tạo symbolic link
ln -s /etc/nginx/sites-available/thansohoc /etc/nginx/sites-enabled/

# Kiểm tra cấu hình Nginx
nginx -t

# Khởi động lại Nginx
systemctl restart nginx

# Cài đặt SSL (bỏ comment dòng dưới sau khi DNS đã được cấu hình đúng)
# certbot --nginx -d thansohoc.mystic.vn

echo "Đã cài đặt Nginx. Bạn cần cấu hình DNS đúng trước khi cài đặt SSL."
echo "Sau khi DNS đã được cấu hình, chạy lệnh:"
echo "certbot --nginx -d thansohoc.mystic.vn" 
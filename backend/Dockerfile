FROM node:18-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json 
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Sao chép source code
COPY . .

# Build ứng dụng
RUN npm run build

# Khởi động ứng dụng
CMD ["npm", "run", "start:prod"]

# Mở cổng 3001
EXPOSE 3001 
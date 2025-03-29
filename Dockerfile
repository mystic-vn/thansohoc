FROM node:18-alpine AS base

# Biến Argument cho quá trình build
ARG MONGODB_URI
ARG MONGODB_DB
ARG OPENAI_API_KEY
ARG REDIS_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Đặt biến môi trường từ ARG
ENV MONGODB_URI=${MONGODB_URI}
ENV MONGODB_DB=${MONGODB_DB}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV REDIS_URL=${REDIS_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Cài đặt các phụ thuộc cho các thư viện
RUN apk add --no-cache libc6-compat

# Thư mục làm việc
WORKDIR /app

# 1. Bước cài đặt các dependencies
FROM base AS deps
# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm ci

# 2. Bước build ứng dụng
FROM base AS builder
WORKDIR /app
# Sao chép node_modules từ bước deps
COPY --from=deps /app/node_modules ./node_modules
# Sao chép tất cả các file khác
COPY . .

# Biến môi trường
ENV NEXT_TELEMETRY_DISABLED=1

# Build ứng dụng
RUN npm run build

# 3. Bước chạy ứng dụng
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tạo người dùng non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép public directory
COPY --from=builder /app/public ./public

# Đặt quyền cho người dùng non-root
RUN mkdir .next
RUN chown -R nextjs:nodejs .next

# Sao chép các file build từ bước builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển sang người dùng non-root
USER nextjs

# Port mặc định
EXPOSE 3000

ENV PORT=3000

# Chạy ứng dụng
CMD ["node", "server.js"] 
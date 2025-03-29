# Thần Số Học

Ứng dụng tra cứu thần số học chuyên nghiệp.

## Cài đặt

Dự án này bao gồm hai phần chính:
- Frontend: Next.js
- Backend: NestJS với MongoDB

### Yêu cầu hệ thống

- Node.js 18+
- MongoDB
- npm hoặc yarn

### Cài đặt dependencies

```bash
# Cài đặt dependencies cho frontend
npm install

# Cài đặt dependencies cho backend
cd backend
npm install
cd ..
```

## Cấu hình biến môi trường

### Frontend (.env.local)

Tạo file `.env.local` trong thư mục gốc dự án với các biến sau:

```
# Cấu hình chung
NODE_ENV=development

# API endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Cấu hình xác thực
NEXT_PUBLIC_AUTH_COOKIE_NAME=token

# Cấu hình ứng dụng
NEXT_PUBLIC_APP_NAME=Thần Số Học
NEXT_PUBLIC_APP_DESCRIPTION=Ứng dụng tra cứu thần số học chuyên nghiệp
```

### Backend (.env)

Tạo file `.env` trong thư mục `backend/` với các biến sau:

```
# Cấu hình server
PORT=3001
NODE_ENV=development

# MongoDB
DATABASE_URI=mongodb://username:password@localhost:27017/thansohoc?authSource=admin
DATABASE_NAME=thansohoc

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM="Thần Số Học <your-email@gmail.com>"

# Ứng dụng
APP_URL=http://localhost:3000
APP_NAME=Thần Số Học
APP_DESCRIPTION=Ứng dụng tra cứu thần số học chuyên nghiệp
```

> **Lưu ý**: Điều chỉnh các thông tin kết nối MongoDB và cấu hình email theo môi trường của bạn.

## Chạy ứng dụng

### Chạy Backend (NestJS)

```bash
cd backend
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3001`

### Chạy Frontend (Next.js)

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## Tài khoản mặc định

- Email: admin@thansohoc.com
- Mật khẩu: Admin@123

## API Endpoints

### Authentication
- POST /auth/login - Đăng nhập
- POST /auth/refresh - Làm mới token

### Users
- GET /users - Lấy danh sách người dùng
- GET /users/:id - Lấy thông tin người dùng
- POST /users - Tạo người dùng mới
- PUT /users/:id - Cập nhật người dùng
- DELETE /users/:id - Xóa người dùng (soft delete)
- DELETE /users/:id/permanent - Xóa vĩnh viễn người dùng
- POST /users/:id/restore - Khôi phục người dùng đã xóa
- POST /users/verify-email - Xác minh email bằng OTP
- POST /users/resend-otp - Gửi lại mã OTP

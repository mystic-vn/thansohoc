import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Thêm xử lý tùy chỉnh trước khi kiểm tra JWT token
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Nếu có lỗi xác thực hoặc không tìm thấy người dùng
    if (err || !user) {
      throw err || new UnauthorizedException('Xác thực không hợp lệ');
    }
    return user;
  }
} 
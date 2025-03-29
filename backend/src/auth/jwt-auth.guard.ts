import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Lấy request để debug
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    console.log('🔒 JWT-Auth-Guard: Request headers:', {
      authorization: token ? `${token.substring(0, 15)}...` : 'không có token',
      path: request.path,
      method: request.method
    });
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔒 JWT-Auth-Guard: Kết quả xác thực:', {
      error: err ? 'Có lỗi' : 'Không có lỗi',
      user: user ? `User ID: ${user._id || user.id}` : 'Không có user',
      info: info || 'Không có info'
    });
    
    if (err || !user) {
      console.error('🔒 JWT-Auth-Guard: Lỗi xác thực:', err || 'User không tồn tại');
      throw err || new UnauthorizedException('Không có quyền truy cập');
    }
    return user;
  }
} 
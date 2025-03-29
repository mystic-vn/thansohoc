import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Nếu không có roles nào được yêu cầu, cho phép truy cập
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false; // Nếu không có thông tin người dùng, từ chối truy cập
    }
    
    console.log('🔒 Role guard kiểm tra: ', { 
      requiredRoles: roles, 
      userRole: user.role || 'không có role', 
      userRoles: user.roles || 'không có roles',
      userId: user._id || user.id || 'không có id'
    });
    
    // Kiểm tra role trong cả 2 trường hợp: role là string hoặc roles là array
    if (user.role) {
      // Nếu user có trường role dạng string (cấu trúc phổ biến nhất)
      return roles.some(role => role === user.role);
    } else if (user.roles && Array.isArray(user.roles)) {
      // Nếu user có trường roles dạng array
      return this.matchRoles(roles, user.roles);
    }
    
    return false; // Mặc định từ chối nếu không có thông tin quyền
  }

  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }
} 
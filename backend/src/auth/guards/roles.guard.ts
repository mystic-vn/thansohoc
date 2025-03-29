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
      console.log('🔑 Kiểm tra role:', {required: roles, userRole: user.role});
      
      // So sánh không phân biệt hoa thường để tránh lỗi 'Admin' vs 'admin'
      return roles.some(role => 
        role.toLowerCase() === user.role.toLowerCase()
      );
    } else if (user.roles && Array.isArray(user.roles)) {
      // Nếu user có trường roles dạng array
      console.log('🔑 Kiểm tra roles array:', {required: roles, userRoles: user.roles});
      
      // So sánh không phân biệt hoa thường
      return this.matchRolesIgnoreCase(roles, user.roles);
    }
    
    return false; // Mặc định từ chối nếu không có thông tin quyền
  }

  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }

  private matchRolesIgnoreCase(requiredRoles: string[], userRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.some(userRole => userRole.toLowerCase() === role.toLowerCase()));
  }
} 
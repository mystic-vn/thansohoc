'use client';

import { getCookie, syncAuthToken } from './cookies';

// Kiểm tra xem người dùng đã đăng nhập hay chưa
export async function isAuthenticated(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') {
      return false; // Server-side
    }
    
    // Đồng bộ token giữa cookie và localStorage
    const token = syncAuthToken() || localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    // Nếu cần, ở đây có thể thêm logic kiểm tra token có hợp lệ không
    // bằng cách gọi API
    
    return true;
  } catch (error) {
    console.error('Lỗi khi kiểm tra xác thực:', error);
    return false;
  }
}

// Kiểm tra xem người dùng có quyền admin hay không
export async function isAdmin(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') {
      return false; // Server-side
    }
    
    // Đồng bộ token giữa cookie và localStorage
    const token = syncAuthToken() || localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    // Tạm thời trả về true để có thể truy cập trang migration
    // CHÚ Ý: Trong môi trường sản phẩm thực tế, KHÔNG NÊN làm như vậy!
    // Thay vào đó nên gọi API để kiểm tra quyền admin
    return true;
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền admin:', error);
    return false;
  }
} 
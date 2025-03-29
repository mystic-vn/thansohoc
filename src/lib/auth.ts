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
    
    // Kiểm tra quyền admin từ JWT token hoặc dữ liệu người dùng
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        // Kiểm tra nếu user có role là admin hoặc isAdmin = true
        if (userData.role === 'Admin' || userData.role === 'admin' || userData.isAdmin === true) {
          return true;
        }
      } catch (e) {
        console.error('Lỗi parse userData:', e);
      }
    }
    
    // Nếu không tìm thấy thông tin về quyền admin trong localStorage
    // thì có thể gọi API để kiểm tra
    // Ví dụ: 
    // const response = await fetch('/api/auth/check-admin', {
    //   headers: {
    //     'Authorization': `Bearer ${token}` 
    //   }
    // });
    // const data = await response.json();
    // return data.isAdmin;
    
    // Nếu không tìm thấy quyền admin trong localStorage hoặc từ API, trả về false
    console.warn('⚠️ Không tìm thấy quyền admin cho người dùng này');
    return false;
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền admin:', error);
    return false;
  }
} 
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
      console.error("❌ Không tìm thấy token trong isAdmin()");
      return false;
    }
    
    // Kiểm tra quyền admin từ JWT token hoặc dữ liệu người dùng
    const userDataStr = localStorage.getItem('userData');
    console.log("🔍 Kiểm tra userData từ localStorage:", userDataStr ? "Có dữ liệu" : "Không có dữ liệu");
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        console.log("📊 Thông tin userData:", {
          role: userData.role,
          isAdmin: userData.isAdmin,
          userId: userData.id || userData._id
        });
        
        // Kiểm tra nếu user có role là admin hoặc isAdmin = true
        if (userData.role === 'Admin' || userData.role === 'admin' || userData.isAdmin === true) {
          console.log("✅ Người dùng có quyền Admin từ localStorage");
          return true;
        } else {
          console.log("❌ Người dùng không có quyền Admin theo userData");
        }
      } catch (e) {
        console.error('Lỗi parse userData:', e);
      }
    } else {
      console.warn("⚠️ Không tìm thấy userData trong localStorage");
    }
    
    // Nếu không tìm thấy thông tin về quyền admin trong localStorage
    // thì gọi API để kiểm tra
    console.log("🔄 Thử lấy thông tin người dùng hiện tại từ API...");
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log("📊 Thông tin người dùng từ API:", {
          role: userData.role,
          userId: userData.id || userData._id
        });
        
        // Cập nhật userData trong localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        if (userData.role === 'Admin' || userData.role === 'admin' || userData.isAdmin === true) {
          console.log("✅ Người dùng có quyền Admin (từ API)");
          return true;
        } else {
          console.log("❌ Người dùng không có quyền Admin (từ API)");
        }
      } else {
        console.warn("⚠️ API trả về lỗi:", response.status);
      }
    } catch (apiError) {
      console.error("❌ Lỗi khi gọi API:", apiError);
    }
    
    // Nếu không tìm thấy quyền admin trong localStorage hoặc từ API, trả về false
    console.warn('⚠️ Không tìm thấy quyền admin cho người dùng này');
    return false;
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền admin:', error);
    return false;
  }
} 
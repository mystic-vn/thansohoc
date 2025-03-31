// Typings cho các tùy chọn của cookie
interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Đặt cookie với tên và giá trị cho trước
 * @param name Tên của cookie
 * @param value Giá trị cần lưu trữ
 * @param options Tùy chọn bổ sung cho cookie
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Lấy giá trị cookie theo tên
 * @param name Tên của cookie cần lấy
 * @returns Giá trị của cookie hoặc null nếu không tìm thấy
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    
    // Fallback: kiểm tra localStorage nếu không tìm thấy trong cookie
    if (typeof window !== 'undefined' && window.localStorage) {
      const localValue = localStorage.getItem(name);
      if (localValue) {
        // Đồng bộ từ localStorage vào cookies
        setCookie(name, localValue, 7);
        return localValue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Lỗi khi đọc cookie:', error);
    return null;
  }
}

/**
 * Xóa cookie với tên chỉ định
 * @param name Tên của cookie cần xóa
 */
export function removeCookie(name: string) {
  if (typeof document === 'undefined') {
    return; // Không thực hiện nếu đang chạy trên máy chủ (SSR)
  }

  // Đặt cookie với thời gian hết hạn trong quá khứ để xóa nó
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  // Xóa khỏi localStorage nếu có
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.error('Lỗi khi xóa localStorage:', e);
    }
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  // Xóa khỏi localStorage nếu có
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.error('Lỗi khi xóa localStorage:', e);
    }
  }
}

// Hàm đồng bộ token giữa cookie và localStorage
export function syncAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token';
    let token = getCookie(cookieName);
    
    // Nếu token có trong cookie nhưng không có trong localStorage, lưu vào localStorage
    if (token && !localStorage.getItem('token')) {
      localStorage.setItem('token', token);
    }
    // Nếu token có trong localStorage nhưng không có trong cookie, lưu vào cookie
    else if (!token && localStorage.getItem('token')) {
      token = localStorage.getItem('token');
      if (token) {
        setCookie(cookieName, token, 7);
      }
    }
    
    return token;
  } catch (error) {
    console.error('Lỗi khi đồng bộ token:', error);
    return null;
  }
} 
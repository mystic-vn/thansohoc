// Hàm lấy giá trị từ lưu trữ một cách an toàn
export const safeGetItem = (key: string): string | null => {
  try {
    // Thử lấy từ sessionStorage trước (ưu tiên cho mobile)
    if (typeof sessionStorage !== 'undefined') {
      const value = sessionStorage.getItem(key);
      if (value) return value;
    }
    
    // Nếu không có, thử từ localStorage
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
    
    // Cuối cùng, thử từ cookie
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === key) return cookieValue;
      }
    }
    
    return null;
  } catch (e) {
    console.error('Lỗi khi lấy dữ liệu:', e);
    return null;
  }
};

// Hàm lưu giá trị vào lưu trữ một cách an toàn
export const safeSetItem = (key: string, value: string): void => {
  try {
    // Thử lưu vào tất cả các nơi lưu trữ có thể
    
    // SessionStorage (tốt nhất cho mobile)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
    
    // LocalStorage (có thể không được trên một số mobile)
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.log('localStorage không khả dụng');
    }
    
    // Cookie (phương án dự phòng)
    if (typeof document !== 'undefined') {
      const date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
      document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
    }
  } catch (e) {
    console.error('Lỗi khi lưu dữ liệu:', e);
  }
};

// Hàm xóa giá trị khỏi lưu trữ một cách an toàn
export const safeRemoveItem = (key: string): void => {
  try {
    // Xóa khỏi tất cả các nơi lưu trữ
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    }
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
    
    if (typeof document !== 'undefined') {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  } catch (e) {
    console.error('Lỗi khi xóa dữ liệu:', e);
  }
}; 
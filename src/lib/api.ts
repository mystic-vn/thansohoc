// Đường dẫn API cơ sở
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// API service
const API_URL = API_BASE_URL;

// User interfaces
export interface User {
  id: number;
  _id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  created: string;
  birthDate?: string;
  isDeleted: boolean;
  isEmailVerified: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  birthDate?: string;
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Inactive';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

// API Functions
export const userApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách người dùng');
    }
    return response.json();
  },

  // Get user by ID
  getById: async (id: number, withDeleted: boolean = false): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}?withDeleted=${withDeleted}`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy thông tin người dùng');
    }
    return response.json();
  },

  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
    return response.json();
  },

  // Create user
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Lỗi khi tạo người dùng');
    }
    return response.json();
  },

  // Update user
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Lỗi khi cập nhật người dùng');
    }
    return response.json();
  },

  // Soft delete user
  softDelete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Lỗi khi xóa người dùng');
    }
  },

  // Hard delete user
  hardDelete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}/permanent`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Lỗi khi xóa hoàn toàn người dùng');
    }
  },

  // Restore user
  restore: async (id: number): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}/restore`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Lỗi khi khôi phục người dùng');
    }
    return response.json();
  },

  // Verify email with OTP
  verifyEmail: async (data: VerifyEmailRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/users/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Lỗi khi xác thực email');
    }
    return response.json();
  },

  // Resend OTP
  resendOtp: async (data: ResendOtpRequest): Promise<void> => {
    const response = await fetch(`${API_URL}/users/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Lỗi khi gửi lại mã OTP');
    }
  },

  // Get current user based on JWT token
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Lấy token từ cả localStorage và cookie để đảm bảo xác thực
      let token = '';
      
      if (typeof window !== 'undefined') {
        // Thử lấy từ localStorage trước
        token = localStorage.getItem('token') || '';
        
        // Nếu không có trong localStorage, thử lấy từ cookie
        if (!token) {
          const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token';
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
              token = cookie.substring(cookieName.length + 1);
              break;
            }
          }
        }
      }
      
      // Log để debug
      console.log('Token sử dụng cho API getCurrentUser:', token ? `${token.substring(0, 10)}...` : 'Không có token');
      
      if (!token) {
        console.error('Không tìm thấy token xác thực trong getCurrentUser');
        return null;
      }
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Ngăn cache để đảm bảo dữ liệu mới nhất
      });
      
      // Log response status để debug
      console.log('Kết quả API getCurrentUser:', response.status, response.statusText);
      
      // Kiểm tra mã trạng thái 401 (Unauthorized) riêng để xử lý tốt hơn
      if (response.status === 401) {
        console.error('Token xác thực đã hết hạn hoặc không hợp lệ');
        // Xóa token không hợp lệ
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          document.cookie = `${process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token'}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        return null;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Lỗi từ API getCurrentUser:', errorData);
        return null;
      }
      
      // Lấy dữ liệu và kiểm tra nội dung
      const responseText = await response.text();
      
      // Xử lý trường hợp phản hồi rỗng
      if (!responseText || responseText.trim() === '') {
        console.error('API trả về dữ liệu rỗng');
        return null;
      }
      
      console.log('Dữ liệu thô từ API:', responseText.length > 100 ? `${responseText.substring(0, 100)}...` : responseText);
      
      // Chuyển đổi dữ liệu văn bản thành JSON
      let userData: any;
      try {
        userData = JSON.parse(responseText);
      } catch (e) {
        console.error('Lỗi phân tích JSON:', e);
        return null;
      }
      
      // Kiểm tra dữ liệu trả về
      if (!userData) {
        console.error('Dữ liệu người dùng không hợp lệ: null');
        return null;
      }
      
      // Kiểm tra xem đối tượng có rỗng không
      if (Object.keys(userData).length === 0) {
        console.error('Dữ liệu người dùng không hợp lệ: đối tượng rỗng');
        return null;
      }
      
      // Tạo một đối tượng User mặc định nếu thiếu trường
      const defaultUser: User = {
        id: userData.id || userData._id || 0,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'User',
        status: userData.status || 'Active',
        created: userData.created || new Date().toISOString(),
        birthDate: userData.birthDate || '',
        isDeleted: userData.isDeleted || false,
        isEmailVerified: userData.isEmailVerified || false
      };
      
      // Lưu token vào localStorage nếu chưa có (đồng bộ giữa cookie và localStorage)
      if (typeof window !== 'undefined' && token && !localStorage.getItem('token')) {
        localStorage.setItem('token', token);
      }
      
      console.log('Dữ liệu người dùng hợp lệ nhận được:', { 
        id: defaultUser.id, 
        email: defaultUser.email, 
        firstName: defaultUser.firstName,
        lastName: defaultUser.lastName
      });
      
      return defaultUser;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error);
      return null;
    }
  },

  // Logout
  logout: (): void => {
    if (typeof window !== 'undefined') {
      // Xóa token và thông tin người dùng
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      document.cookie = `${process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token'}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  },
}; 
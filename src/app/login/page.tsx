'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi } from '@/lib/api';
import { setCookie, getCookie } from '@/lib/cookies';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    if (token) {
      // Nếu đã đăng nhập, chuyển hướng về trang chủ
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Đang gửi yêu cầu đăng nhập...');
      const response = await userApi.login({ email: formData.email, password: formData.password });
      
      // Log kết quả đăng nhập để debug (che giấu token đầy đủ)
      console.log('Đăng nhập thành công:', {
        id: response.id,
        email: response.email,
        token: response.token ? `${response.token.substring(0, 15)}...` : 'Không có token'
      });
      
      if (!response.token) {
        console.error('Không nhận được token từ API đăng nhập');
        setError('Đăng nhập không thành công. Vui lòng thử lại.');
        return;
      }
      
      // Lưu token vào cả localStorage và cookie để đảm bảo nhất quán
      if (typeof window !== 'undefined') {
        console.log('Lưu token vào localStorage và cookie...');
        try {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userName', `${response.firstName} ${response.lastName}`);
          
          // Lưu thông tin người dùng đầy đủ vào localStorage để dùng cho kiểm tra quyền
          const userData = {
            id: response.id,
            _id: response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: response.role,
            isAdmin: response.role === 'Admin',
            status: response.status
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log('Đã lưu thông tin người dùng:', userData);
          
          // Đặt cookie với thời hạn 7 ngày và các thuộc tính tương thích
          const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token';
          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `${cookieName}=${response.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        } catch (err) {
          console.error('Lỗi khi lưu trữ token:', err);
          // Tiếp tục ngay cả khi lưu vào localStorage lỗi
        }
      }
      
      // Kiểm tra trạng thái xác thực email
      if (!response.isEmailVerified) {
        // Nếu email chưa được xác thực, chuyển hướng đến trang xác thực email
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      
      // Chuyển hướng dựa vào vai trò
      if (response.role === 'Admin') {
        console.log('Chuyển hướng đến trang admin...');
        router.push('/admin/dashboard');
      } else {
        console.log('Chuyển hướng đến trang chủ...');
        router.push('/');
      }
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      
      let errorMessage = 'Đăng nhập không thành công. Vui lòng thử lại.';
      
      // Xử lý các loại lỗi cụ thể
      if (err.message?.includes('email') || err.message?.includes('password')) {
        errorMessage = 'Email hoặc mật khẩu không đúng.';
      } else if (err.message?.includes('Network Error') || err.message?.includes('timeout')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn và thử lại.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Hoặc{' '}
            <Link href="/register" className="font-medium text-pink-400 hover:text-pink-300 transition">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-400/20 border border-red-400/50 text-white px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 rounded bg-white/5"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-pink-400 hover:text-pink-300 transition">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg focus:outline-none hover:from-indigo-600 hover:to-purple-700 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 